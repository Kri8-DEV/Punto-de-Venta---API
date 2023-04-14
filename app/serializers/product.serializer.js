module.exports = (serializer) => {
  serializer.register('product', {
    id: 'sku',
    whitelist: ['name', 'description', 'price', 'kg_price', 'weight', 'active', 'image'],
  });
}
