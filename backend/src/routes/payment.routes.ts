import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../plugins/prisma.js';
import { authGuard } from '../middlewares/auth.js';
import { env } from '../config/env.js';

const plans = {
  PLAYER: { title: 'Plano Jogador', price: 19.9 },
  MASTER: { title: 'Plano Mestre', price: 49.9 },
  MASTER_PRO: { title: 'Plano Mestre Pro', price: 89.9 }
} as const;

async function createMercadoPagoPreference(input: {
  title: string;
  amount: number;
  externalReference: string;
  metadata: Record<string, unknown>;
}) {
  if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
    return {
      init_point: null,
      sandbox_init_point: null,
      warning: 'MERCADO_PAGO_ACCESS_TOKEN não configurado. Pagamento criado como pendente para teste local.'
    };
  }

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [{ title: input.title, quantity: 1, currency_id: 'BRL', unit_price: input.amount }],
      external_reference: input.externalReference,
      metadata: input.metadata,
      back_urls: {
        success: env.PAYMENT_SUCCESS_URL,
        failure: env.PAYMENT_FAILURE_URL,
        pending: env.PAYMENT_PENDING_URL
      },
      auto_return: 'approved'
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Mercado Pago recusou a preferência: ${detail}`);
  }

  return response.json() as Promise<{ init_point?: string; sandbox_init_point?: string }>;
}

export async function paymentRoutes(app: FastifyInstance) {
  app.post('/payments/reservation/:reservationId/checkout', { preHandler: authGuard }, async (request, reply) => {
    const params = z.object({ reservationId: z.string() }).parse(request.params);
    const reservation = await prisma.reservation.findUnique({ where: { id: params.reservationId }, include: { campaign: true } });
    if (!reservation) return reply.status(404).send({ message: 'Reserva não encontrada.' });
    if (reservation.userId !== request.user.sub && request.user.role !== 'ADMIN') {
      return reply.status(403).send({ message: 'Você não pode pagar esta reserva.' });
    }

    const externalReference = `reservation:${reservation.id}:${Date.now()}`;
    const preference = await createMercadoPagoPreference({
      title: `Reserva - ${reservation.campaign.title}`,
      amount: reservation.amount,
      externalReference,
      metadata: { purpose: 'RESERVATION', reservationId: reservation.id, campaignId: reservation.campaignId }
    });

    const payment = await prisma.payment.create({
      data: {
        purpose: 'RESERVATION', amount: reservation.amount, userId: request.user.sub,
        reservationId: reservation.id, externalReference, checkoutUrl: preference.init_point || preference.sandbox_init_point || null,
        metadata: preference as any
      }
    });

    return reply.status(201).send({ payment, checkoutUrl: payment.checkoutUrl, preference });
  });

  app.post('/payments/products/:productId/checkout', { preHandler: authGuard }, async (request, reply) => {
    const params = z.object({ productId: z.string() }).parse(request.params);
    const product = await prisma.marketplaceProduct.findUnique({ where: { id: params.productId } });
    if (!product) return reply.status(404).send({ message: 'Produto não encontrado.' });

    const externalReference = `product:${product.id}:${Date.now()}`;
    const preference = await createMercadoPagoPreference({
      title: product.title,
      amount: product.price,
      externalReference,
      metadata: { purpose: 'MARKETPLACE_PRODUCT', productId: product.id }
    });

    const payment = await prisma.payment.create({
      data: {
        purpose: 'MARKETPLACE_PRODUCT', amount: product.price, userId: request.user.sub,
        productId: product.id, externalReference, checkoutUrl: preference.init_point || preference.sandbox_init_point || null,
        metadata: preference as any
      }
    });

    return reply.status(201).send({ payment, checkoutUrl: payment.checkoutUrl, preference });
  });

  app.post('/payments/subscriptions/checkout', { preHandler: authGuard }, async (request, reply) => {
    const body = z.object({ plan: z.enum(['PLAYER', 'MASTER', 'MASTER_PRO']) }).parse(request.body);
    const plan = plans[body.plan];
    const subscription = await prisma.subscription.create({ data: { plan: body.plan, price: plan.price, userId: request.user.sub } });
    const externalReference = `subscription:${subscription.id}:${Date.now()}`;
    const preference = await createMercadoPagoPreference({
      title: plan.title,
      amount: plan.price,
      externalReference,
      metadata: { purpose: 'SUBSCRIPTION', subscriptionId: subscription.id, plan: body.plan }
    });

    const payment = await prisma.payment.create({
      data: {
        purpose: 'SUBSCRIPTION', amount: plan.price, userId: request.user.sub,
        subscriptionId: subscription.id, externalReference, checkoutUrl: preference.init_point || preference.sandbox_init_point || null,
        metadata: preference as any
      }
    });

    return reply.status(201).send({ subscription, payment, checkoutUrl: payment.checkoutUrl, preference });
  });

  app.get('/payments', { preHandler: authGuard }, async (request) => {
    return prisma.payment.findMany({ where: { userId: request.user.sub }, orderBy: { createdAt: 'desc' }, take: 50 });
  });

  app.get('/finance/summary', { preHandler: authGuard }, async (request) => {
    const products = await prisma.marketplaceProduct.findMany({ where: { sellerId: request.user.sub }, select: { id: true } });
    const productIds = products.map((product) => product.id);
    const payments = await prisma.payment.findMany({
      where: {
        OR: [
          { userId: request.user.sub },
          { productId: { in: productIds } }
        ]
      }
    });
    const approved = payments.filter((payment) => payment.status === 'APPROVED');
    return {
      totalPayments: payments.length,
      approvedPayments: approved.length,
      pendingPayments: payments.filter((payment) => payment.status === 'PENDING').length,
      revenue: approved.reduce((sum, payment) => sum + payment.amount, 0),
      projectedRevenue: payments.reduce((sum, payment) => sum + payment.amount, 0)
    };
  });

  app.post('/payments/webhook', async (request, reply) => {
    const body = z.any().parse(request.body);
    const externalReference = body?.external_reference || body?.data?.external_reference || body?.metadata?.externalReference;
    const status = String(body?.status || body?.data?.status || '').toUpperCase();

    if (externalReference) {
      await prisma.payment.updateMany({
        where: { externalReference },
        data: {
          status: status === 'APPROVED' ? 'APPROVED' : status === 'REJECTED' ? 'REJECTED' : 'PENDING',
          providerPaymentId: String(body?.id || body?.data?.id || ''),
          metadata: body
        }
      });
    }

    return reply.status(200).send({ received: true });
  });
}
