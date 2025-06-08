const { User } = require('../models');

module.exports = {
  up: async (queryInterface) => {
  const userSeedData = [
    {
      id: 1,
      name: 'Geetanjali',
      email: 'geetanjali0223@gmail.com',
      phone_no: null,
      email_send: 0
    },
    {
      id: 2,
      name: 'Geeta',
      email: 'geetanjali9361@gmail.com',
      phone_no: null,
      email_send: 0
    },
    {
      id: 3,
      name: 'Manuj Sharma',
      email: 'manujsharma3107@gmail.com',
      phone_no: null,
      email_send: 0
    },
  ];

  for (const userData of userSeedData) {
    try {
      const userExist = await User.findOne({
        attributes: ['id'],
        where: { id: userData.id }
      });

      if (!userExist) {
        await User.create(userData);
      }
    } catch (err) {
      console.error(`Failed to create user with id ${userData.id}:`, err.errors || err.message, '\nFull error:', err);
    }
  }
},
down: async (queryInterface) => {
    await User.truncate();
  }
};
