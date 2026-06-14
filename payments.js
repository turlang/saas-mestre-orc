const MestreOrcPayments = (() => {
  async function checkoutProduct(productId) {
    try {
      const response = await MestreOrcApi.post(`/payments/products/${productId}/checkout`, {});
      if (response.checkoutUrl) window.open(response.checkoutUrl, '_blank', 'noopener');
      else alert('Pagamento criado em modo teste. Configure MERCADO_PAGO_ACCESS_TOKEN para abrir checkout real.');
      return response;
    } catch (error) {
      alert(`Não foi possível iniciar o checkout: ${error.message}`);
    }
  }

  async function checkoutPlan(plan) {
    try {
      const response = await MestreOrcApi.post('/payments/subscriptions/checkout', { plan });
      if (response.checkoutUrl) window.open(response.checkoutUrl, '_blank', 'noopener');
      else alert('Assinatura criada em modo teste. Configure Mercado Pago para checkout real.');
      return response;
    } catch (error) {
      alert(`Não foi possível iniciar a assinatura: ${error.message}`);
    }
  }

  async function renderFinanceSummary() {
    const target = document.querySelector('[data-finance-summary]');
    if (!target) return;
    try {
      const data = await MestreOrcApi.get('/finance/summary');
      target.innerHTML = `
        <article class="stat-card"><span>Receita aprovada</span><strong>R$ ${Number(data.revenue || 0).toFixed(2)}</strong></article>
        <article class="stat-card"><span>Receita projetada</span><strong>R$ ${Number(data.projectedRevenue || 0).toFixed(2)}</strong></article>
        <article class="stat-card"><span>Pagamentos pendentes</span><strong>${data.pendingPayments || 0}</strong></article>`;
    } catch {
      target.innerHTML = `<p class="muted-note">Resumo financeiro disponível quando o backend estiver rodando e o usuário estiver logado.</p>`;
    }
  }

  document.addEventListener('DOMContentLoaded', renderFinanceSummary);
  return { checkoutProduct, checkoutPlan, renderFinanceSummary };
})();
