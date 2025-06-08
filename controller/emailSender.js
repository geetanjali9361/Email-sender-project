const { User } = require('../models');
const helper = require("../helper/comman");
const EmailService = require('../helper/emailClass');

const emailService = async (req, res) => {
    try {
        helper.writeLogMessage(`Fetching emails from DB to send mails...`);
        const BATCH_SIZE = 10;
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
            const users = await User.findAll({
                where: { email_send: 0 },
                limit: BATCH_SIZE,
                offset,
            });

            if (!users || users.length === 0) {
                hasMore = false;
                break;
            }

            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                let emailSentSuccessfully = false;

                // Try SendGrid first with retry using the generic method
                console.log(`Attempting to send email to ${user.email} via SendGrid...`);
                const sendGridService = new EmailService('SendGrid');
                let sentViaSendGrid = await sendGridService.sendEmailToUser(user.email, user.name);
                
                // Retry SendGrid once if it failed
                if (sentViaSendGrid === false) {
                    console.log(`Retrying SendGrid for ${user.email}...`);
                    sentViaSendGrid = await sendGridService.sendEmailToUser(user.email, user.name);
                }

                if (sentViaSendGrid === true) {
                    // Email sent successfully via SendGrid
                    await User.update({ email_send: 1 }, { where: { id: user.id } });
                    helper.writeLogMessage(`Email sent to ${user.email} via SendGrid`);
                    emailSentSuccessfully = true;
                    console.log(`SendGrid success for ${user.email} - skipping NodeMailer`);
                } else {
                    // SendGrid failed, try NodeMailer as fallback
                    console.log(`SendGrid failed for ${user.email}, trying NodeMailer as fallback...`);
                    
                    const nodeMailerService = new EmailService('NodeMailer');
                    const sentViaNodeMailer = await nodeMailerService.sendEmailToUser(user.email, user.name);

                    if (sentViaNodeMailer === true) {
                        await User.update({ email_send: 1 }, { where: { id: user.id } });
                        helper.writeLogMessage(`Email sent to ${user.email} via NodeMailer (fallback)`);
                        emailSentSuccessfully = true;
                        console.log(`NodeMailer fallback success for ${user.email}`);
                    } else {
                        console.log(`Both SendGrid and NodeMailer failed for ${user.email}`);
                        helper.writeLogMessage(`Failed to send email to ${user.email} via both services`);
                    }
                }

                // Add a small delay between emails to avoid rate limiting
                if (i < users.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            offset += BATCH_SIZE;
        }
        
        helper.writeLogMessage(`Email sending process complete.`);
        return res.status(200).json({ message: "Email sending process complete." });

    } catch (err) {
        helper.handleException(err);
        console.error(`Error in email sending process:`, err.message);
        return res.status(500).json({ message: "Error while sending email" });
    }
};

module.exports = {
    emailService
}