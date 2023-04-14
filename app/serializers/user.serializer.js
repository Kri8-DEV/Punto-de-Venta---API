module.exports = (serializer) => {
  serializer.register('user', {
    beforeSerialize: (data) => {
      const role = data.role.name;

      return {
        ...data,
        role,
      }
    },
    id: 'id',
    whitelist: ['username', 'email', 'active', 'role', 'person'],
  });
}
