require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { EmailContent } = require('../models');
const { EmailTrack } = require('../models')
const { User } = require('../models');

class EmailService {
  constructor(name = '') {
    this.name = name;
  }

  // SendGrid method with improved error handling
  async sendEmailBySendgrid(userEmail, name) {
    try {
      const content = await EmailContent.findOne({
        where: { email_no: 1 }
      });

      if (!content || !content.email_content) {
        console.error("No content in email content db");
        return false;
      }
      
      const personalizedContent = content.email_content.replace(/\[userName\]/g, name);

      const msg = {
        to: userEmail,
        from: process.env.EMAIL_FROM,
        subject: content.subject,
        text: 'testing',
        html: personalizedContent,
      };

      // Send email and get response
      const response = await sgMail.send(msg);
      
      // Check if response indicates successful sending
      // SendGrid returns 202 for successful acceptance
      if (response && response[0] && response[0].statusCode === 202) {
        console.log('Email sent successfully via SendGrid to:', userEmail);
        
        // Track successful email
        await EmailTrack.create({
          email_from: process.env.EMAIL_FROM,
          email_to: userEmail,
          status: 'sent',
          email_sent_by: 'SendGrid'
        });
        
        return true;
      } else {
        console.error('SendGrid unexpected response status:', response[0]?.statusCode);
        return false;
      }

    } catch (error) {
      console.error('SendGrid Error Details:');
      console.error('Status Code:', error.code);
      console.error('Error Body:', error.response?.body);
      
      // Check if the error code indicates successful sending
      // SendGrid sometimes throws error with code 202 which means success
      if (error.code === 202) {
        console.log('Email sent successfully via SendGrid to:', userEmail, '(despite error thrown)');
        
        try {
          await EmailTrack.create({
            email_from: process.env.EMAIL_FROM,
            email_to: userEmail,
            status: 'sent',
            email_sent_by: 'SendGrid'
          });
        } catch (trackError) {
          console.error('Error tracking SendGrid email:', trackError.message);
        }
        
        return true;
      }
      
      // If it's a genuine failure, return false
      return false;
    }
  }

  async sendEmailByNodemailer(userEmail, name) {
    try {
      const content = await EmailContent.findOne({
        where: { email_no: 1 }
      });

      if (!content || !content.email_content) {
        console.error("No content in email content db");
        return false;
      }

      // Create transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      const personalizedContent = content.email_content.replace(/\[userName\]/g, name);

      // Email options
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: userEmail,
        subject: content.subject,
        text: 'testing',
        html: personalizedContent
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully via NodeMailer to:', userEmail);
      console.log('Message ID:', info.messageId);
      
      // Track successful email
      try {
        await EmailTrack.create({
          email_from: process.env.GMAIL_USER, // Use Gmail user for NodeMailer
          email_to: userEmail,
          status: 'sent',
          email_sent_by: 'NodeMailer'
        });
      } catch (trackError) {
        console.error('Error tracking NodeMailer email:', trackError.message);
      }
      
      return true;

    } catch (error) {
      console.error('NodeMailer Error:', error.message);
      return false;
    }
  }

  // Generic retry method
  async sendEmailToUser(userEmail, name) {
    try {
      if (this.name === 'SendGrid') {
        return await this.sendEmailBySendgrid(userEmail, name);
      } else if (this.name === 'NodeMailer') {
        return await this.sendEmailByNodemailer(userEmail, name);
      }
      return false;
    } catch (error) {
      console.error('Generic send error:', error.message);
      return false;
    }
  }
}

module.exports = EmailService;