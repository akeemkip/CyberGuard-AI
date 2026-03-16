import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import prisma, { PLATFORM_SETTINGS_ID } from '../config/database';
import { decrypt } from '../utils/encryption';
import { logger } from '../utils/logger';

// Resend client for transactional emails (password reset, etc.)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Get SMTP configuration from platform settings
 */
export async function getSMTPConfig(): Promise<SMTPConfig | null> {
  const settings = await prisma.platformSettings.findUnique({
    where: { id: PLATFORM_SETTINGS_ID },
    select: {
      smtpHost: true,
      smtpPort: true,
      smtpUser: true,
      smtpPassword: true,
    },
  });

  if (!settings || !settings.smtpHost || !settings.smtpUser || !settings.smtpPassword) {
    return null;
  }

  const port = parseInt(settings.smtpPort) || 587;

  // Decrypt the password
  let password = '';
  try {
    password = decrypt(settings.smtpPassword);
  } catch (error) {
    // If decryption fails, try using as plain text (for backwards compatibility)
    password = settings.smtpPassword;
  }

  return {
    host: settings.smtpHost,
    port,
    secure: port === 465, // Use TLS for port 465
    auth: {
      user: settings.smtpUser,
      pass: password,
    },
  };
}

/**
 * Create a nodemailer transporter from platform settings
 */
export async function createTransporter(): Promise<nodemailer.Transporter | null> {
  const config = await getSMTPConfig();

  if (!config) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });
}

/**
 * Send an email using the configured SMTP settings
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = await createTransporter();

    if (!transporter) {
      logger.warn(`Email not sent to ${options.to} (subject: "${options.subject}"): SMTP not configured`);
      return { success: false, error: 'SMTP not configured. Please configure SMTP settings first.' };
    }

    const settings = await prisma.platformSettings.findUnique({
      where: { id: PLATFORM_SETTINGS_ID },
      select: { smtpUser: true, platformName: true },
    });

    const from = `"${settings?.platformName || 'CyberGuard AI'}" <${settings?.smtpUser}>`;

    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    logger.error('Email send error:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

/**
 * Send enrollment confirmation email
 */
export async function sendEnrollmentEmail(
  toEmail: string,
  studentName: string,
  courseTitle: string
): Promise<{ success: boolean; error?: string }> {
  const settings = await prisma.platformSettings.findUnique({
    where: { id: PLATFORM_SETTINGS_ID },
    select: { platformName: true },
  });
  const platformName = settings?.platformName || 'CyberGuard AI';

  return sendEmail({
    to: toEmail,
    subject: `You're enrolled in ${courseTitle} - ${platformName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3b82f6;">Welcome to ${courseTitle}!</h1>
        <p>Hi ${studentName},</p>
        <p>You have been successfully enrolled in <strong>${courseTitle}</strong>.</p>
        <p>Log in to ${platformName} to start learning and build your cybersecurity skills.</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
          This is an automated message from ${platformName}.
        </p>
      </div>
    `,
  });
}

/**
 * Send course completion / certificate email
 */
export async function sendCompletionEmail(
  toEmail: string,
  studentName: string,
  courseTitle: string
): Promise<{ success: boolean; error?: string }> {
  const settings = await prisma.platformSettings.findUnique({
    where: { id: PLATFORM_SETTINGS_ID },
    select: { platformName: true },
  });
  const platformName = settings?.platformName || 'CyberGuard AI';

  return sendEmail({
    to: toEmail,
    subject: `Congratulations! You completed ${courseTitle} - ${platformName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981;">Course Completed!</h1>
        <p>Hi ${studentName},</p>
        <p>Congratulations on completing <strong>${courseTitle}</strong>!</p>
        <p>A certificate has been issued and is available in your dashboard.</p>
        <p>Keep up the great work and continue building your cybersecurity expertise.</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
          This is an automated message from ${platformName}.
        </p>
      </div>
    `,
  });
}

/**
 * Test the SMTP connection and send a test email
 */
export async function sendTestEmail(toEmail: string): Promise<{ success: boolean; message: string; details?: string }> {
  try {
    const config = await getSMTPConfig();

    if (!config) {
      return {
        success: false,
        message: 'SMTP not configured',
        details: 'Please fill in all SMTP settings (host, port, username, and password) before testing.'
      };
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    // First verify the connection
    await transporter.verify();

    const settings = await prisma.platformSettings.findUnique({
      where: { id: PLATFORM_SETTINGS_ID },
      select: { platformName: true, smtpUser: true },
    });

    const platformName = settings?.platformName || 'CyberGuard AI';
    const from = `"${platformName}" <${settings?.smtpUser}>`;

    // Send test email
    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject: `Test Email from ${platformName}`,
      text: `This is a test email from ${platformName}.\n\nIf you received this email, your SMTP configuration is working correctly!\n\nConfiguration Details:\n- Host: ${config.host}\n- Port: ${config.port}\n- Secure: ${config.secure ? 'Yes (TLS)' : 'No'}\n- Username: ${config.auth.user}\n\nSent at: ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3b82f6;">Test Email from ${platformName}</h1>
          <p>If you received this email, your SMTP configuration is working correctly!</p>

          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Configuration Details:</h3>
            <ul style="color: #6b7280;">
              <li><strong>Host:</strong> ${config.host}</li>
              <li><strong>Port:</strong> ${config.port}</li>
              <li><strong>Secure:</strong> ${config.secure ? 'Yes (TLS)' : 'No'}</li>
              <li><strong>Username:</strong> ${config.auth.user}</li>
            </ul>
          </div>

          <p style="color: #9ca3af; font-size: 12px;">
            Sent at: ${new Date().toISOString()}
          </p>
        </div>
      `,
    });

    return {
      success: true,
      message: 'Test email sent successfully!',
      details: `Email delivered to ${toEmail}. Message ID: ${info.messageId}`
    };
  } catch (error: any) {
    logger.error('Test email error:', error);

    // Provide helpful error messages
    let message = 'Failed to send test email';
    let details = error.message;

    if (error.code === 'ECONNREFUSED') {
      message = 'Connection refused';
      details = `Could not connect to SMTP server. Please verify the host and port are correct.`;
    } else if (error.code === 'EAUTH' || error.responseCode === 535) {
      message = 'Authentication failed';
      details = 'Invalid username or password. For Gmail, you may need to use an App Password.';
    } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
      message = 'Connection timeout';
      details = 'Could not establish connection. Check your firewall settings and SMTP host.';
    } else if (error.code === 'ENOTFOUND') {
      message = 'Host not found';
      details = `The SMTP host "${error.hostname || 'unknown'}" could not be resolved. Please check the hostname.`;
    }

    return { success: false, message, details };
  }
}

/**
 * Send password reset email via Resend
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  userName: string,
  resetToken: string
): Promise<{ success: boolean; error?: string }> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}?page=new-password&token=${resetToken}`;

  const settings = await prisma.platformSettings.findUnique({
    where: { id: PLATFORM_SETTINGS_ID },
    select: { platformName: true },
  });
  const platformName = settings?.platformName || 'CyberGuard AI';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #3b82f6;">Password Reset Request</h1>
      <p>Hi ${userName},</p>
      <p>We received a request to reset your password for your ${platformName} account.</p>
      <p>Click the button below to set a new password:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Reset Password
        </a>
      </p>
      <p style="color: #6b7280; font-size: 14px;">This link expires in 15 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">
        If the button doesn't work, copy and paste this URL into your browser:<br />
        <a href="${resetUrl}" style="color: #3b82f6;">${resetUrl}</a>
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
        This is an automated message from ${platformName}.
      </p>
    </div>
  `;

  // Try Resend first (works on Render free tier since it uses HTTPS, not SMTP)
  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from: `${platformName} <onboarding@resend.dev>`,
        to: [toEmail],
        subject: `Reset Your Password - ${platformName}`,
        html: htmlContent,
      });

      if (error) {
        logger.error('Resend error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      logger.error('Resend send failed:', err);
      return { success: false, error: err.message || 'Failed to send email' };
    }
  }

  // Fallback to SMTP if Resend is not configured
  return sendEmail({
    to: toEmail,
    subject: `Reset Your Password - ${platformName}`,
    html: htmlContent,
  });
}
