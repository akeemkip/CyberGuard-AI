import nodemailer from 'nodemailer';
import prisma from '../config/database';
import { decrypt } from '../utils/encryption';

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
    where: { id: 'singleton' },
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
      return { success: false, error: 'SMTP not configured. Please configure SMTP settings first.' };
    }

    const settings = await prisma.platformSettings.findUnique({
      where: { id: 'singleton' },
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
    console.error('Email send error:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
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
      where: { id: 'singleton' },
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
    console.error('Test email error:', error);

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
