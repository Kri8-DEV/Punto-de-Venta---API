module.exports = (serializer) => {
  serializer.register('customer', {
    id: 'id',
    whitelist: ['person']
  });
}
