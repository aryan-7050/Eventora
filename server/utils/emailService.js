const nodemailer = require('nodemailer');
const dns = require('dns');

// Fix for Render: Forces Node.js to prioritize IPv4 over IPv6
dns.setDefaultResultOrder('ipv4first');

const sendApprovalEmail = async (clubEmail, clubName, headName) => {
    try {
        const transporter = nodemailer.createTransport({
            // Changed from service: 'gmail' to explicit host and port for better reliability on Render
            host: 'smtp.gmail.com', 
            port: 465,
            secure: true, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `"EventMatrix Admin" <${process.env.EMAIL_USER}>`,
            to: clubEmail,
            subject: 'Club Registration Approved - EventMatrix',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #6d28d9; color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">EventMatrix</h1>
                    </div>
                    <div style="padding: 20px;">
                        <h2 style="color: #6d28d9;">Congratulations, ${headName}!</h2>
                        <p>We are pleased to inform you that your club, <strong>${clubName}</strong>, has been officially approved by the institutional administrator.</p>
                        <p>You can now access your dashboard to create events, manage registrations, and engage with the student body.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}/club/login" style="background-color: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Log In to Dashboard</a>
                        </div>
                        <p style="font-size: 0.9rem; color: #666;">If you have any questions, please contact the administrative office.</p>
                    </div>
                    <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 0.8rem; color: #999;">
                        &copy; ${new Date().getFullYear()} EventMatrix. All rights reserved.
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent to ${clubEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending approval email:', error);
        return false;
    }
};

module.exports = { sendApprovalEmail };