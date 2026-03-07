// src/services/emailService.ts

export const emailService = {
    /**
     * Send an email using Brevo's SMTP API
     */
    async sendEmail({ to, subject, htmlContent }: { to: { email: string, name?: string }[], subject: string, htmlContent: string }) {
        const apiKey = import.meta.env.VITE_BREVO_API_KEY;
        const senderEmail = import.meta.env.VITE_BREVO_SENDER_EMAIL || 'no-reply@placeiq.com';

        if (!apiKey) {
            console.warn("VITE_BREVO_API_KEY is not defined. Logging email to console instead of sending.");
            console.log('--- EMAIL MOCK ---');
            console.log('To:', to);
            console.log('Subject:', subject);
            console.log('Content:', htmlContent);
            console.log('------------------');
            return { success: true, mocked: true };
        }

        try {
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'api-key': apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    sender: { email: senderEmail, name: "PlaceIQ System" },
                    to: to,
                    subject: subject,
                    htmlContent: htmlContent
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Brevo API Error:', errorData);
                throw new Error(`Failed to send email: ${errorData.message}`);
            }

            const data = await response.json();
            return { success: true, messageId: data.messageId };
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    },

    /**
     * Send initial password to a newly activated student
     */
    async sendStudentCredentials(email: string, fullName: string, plainPassword: string, registerNumber: string) {
        const subject = "Welcome to PlaceIQ - Your Login Credentials";
        const content = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h2>Welcome to PlaceIQ, ${fullName}!</h2>
        <p>Your mentor has granted you access to the platform.</p>
        <p>Here are your temporary login credentials:</p>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 16px; margin: 20px 0;">
          <strong>Register Number:</strong> ${registerNumber}<br/>
          <strong>Password:</strong> ${plainPassword}
        </div>
        <p><strong>Important:</strong> Please log in and change your password in your Profile Settings as soon as possible.</p>
        <p><a href="${window.location.origin}/login" style="display: inline-block; padding: 10px 20px; background: #6D28D9; color: white; text-decoration: none; border-radius: 5px;">Login Now</a></p>
      </div>
    `;

        return this.sendEmail({
            to: [{ email, name: fullName }],
            subject,
            htmlContent: content
        });
    },

    /**
     * Send OTP for password reset
     */
    async sendPasswordResetOtp(email: string, otpCode: string) {
        const subject = "PlaceIQ - Password Reset OTP";
        const content = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>We received a request to change your password.</p>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 24px; text-align: center; letter-spacing: 5px; margin: 20px 0;">
          <strong>${otpCode}</strong>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

        return this.sendEmail({
            to: [{ email }],
            subject,
            htmlContent: content
        });
    }
};
