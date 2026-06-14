# Blueprint MongoDB — Marketplace e Mobile

## MarketplaceProduct
- id
- ownerId
- title
- category: Aventura | Mapa | Token | Foundry | Campanha
- description
- price
- files[]
- previewImages[]
- ratingAverage
- status: draft | published | archived
- createdAt / updatedAt

## MarketplaceOrder
- id
- buyerId
- sellerId
- productIds[]
- subtotal
- platformFee
- paymentStatus
- createdAt

## MobileDeviceSession
- id
- userId
- deviceName
- lastAccess
- pushEnabled

## Rotas futuras
- GET /marketplace/products
- POST /marketplace/products
- POST /marketplace/orders
- GET /me/purchases
- POST /mobile/push-subscription
