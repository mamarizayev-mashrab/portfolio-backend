/**
 * Email Utility
 * Sends email notifications using Nodemailer
 */

const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ SMTP not configured - emails will be logged to console');
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

/**
 * Send contact form notification email
 * @param {Object} messageData - Contact form data
 */
const sendContactNotification = async (messageData) => {
    const { name, email, subject, message } = messageData;
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
        subject: `📬 New Contact: ${subject || 'No Subject'} - from ${name}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #a855f7, #06b6d4); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; }
          .value { margin-top: 5px; color: #1f2937; }
          .message-box { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #a855f7; }
          .footer { text-align: center; padding: 15px; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">📬 New Contact Message</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            ${subject ? `
            <div class="field">
              <div class="label">Subject</div>
              <div class="value">${subject}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">Message</div>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            Sent from your Portfolio Contact Form
          </div>
        </div>
      </body>
      </html>
    `,
        text: `
      New Contact Message
      -------------------
      From: ${name}
      Email: ${email}
      Subject: ${subject || 'N/A'}
      
      Message:
      ${message}
    `
    };

    // If no transporter (SMTP not configured), log to console
    if (!transporter) {
        console.log('\n📧 Contact Form Submission (Email not sent - SMTP not configured):');
        console.log(`   From: ${name} <${email}>`);
        console.log(`   Subject: ${subject || 'N/A'}`);
        console.log(`   Message: ${message.substring(0, 100)}...`);
        return { success: true, logged: true };
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Contact notification email sent for message from ${email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendContactNotification
};
