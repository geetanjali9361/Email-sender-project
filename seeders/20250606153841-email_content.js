const { EmailContent } = require('../models');

module.exports = {
  up: async (queryInterface) => {
  const emailContentSeedData = [
    {
      id: 1,
      email_no: 1,
      subject: 'Welcome to Email Sender',
      email_content: '<p style="margin:0;">Dear <strong>[userName]</strong>,</p><p style="margin:12px 0 0 0;">I hope this message finds you well.</p><p style="margin:12px 0 0 0;">This is a test email to test if the <strong>email sender</strong> class is working fine.</p><p style="margin:12px 0 0 0;">Thank you,</p><p style="margin:0;">Team Testing</p>',
    },
  ];

  for (const emailContentData of emailContentSeedData) {
    try {
      const emailContentExist = await EmailContent.findOne({
        attributes: ['id'],
        where: { id: emailContentData.id }
      });

      if (!emailContentExist) {
        await EmailContent.create(emailContentData);
      }
    } catch (err) {
      console.error(`Failed to create user with id ${emailContentData.id}:`, err.errors || err.message, '\nFull error:', err);
    }
  }
},
down: async (queryInterface) => {
    await EmailContent.truncate();
  }
};
