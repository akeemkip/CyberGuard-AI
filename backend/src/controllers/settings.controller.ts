import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { encrypt, decrypt, isEncrypted } from '../utils/encryption';
import { logSettingsChanges, getSettingsAuditLog as getAuditLog, getAuditedFieldNames, AuditLogEntry } from '../services/audit.service';
import { sendTestEmail } from '../services/email.service';

// Sentinel value to indicate "keep existing password"
const PASSWORD_MASK = '••••••••';

// Default settings for public endpoint
const defaultPublicSettings = {
  platformName: 'CyberGuard AI',
  primaryColor: '#3b82f6',
  secondaryColor: '#10b981',
  accentColor: '#f59e0b',
  fontFamily: 'Inter',
  fontSize: 'normal',
  borderRadius: 'medium',
  darkModeDefault: false,
  logoUrl: '',
  favicon: '',
  customCss: '',
  minPasswordLength: 6,
  allowSelfRegistration: true,
};

// Get public platform settings (no auth required)
export const getPublicSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.platformSettings.findUnique({
      where: { id: 'singleton' },
      select: {
        platformName: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        fontFamily: true,
        fontSize: true,
        borderRadius: true,
        darkModeDefault: true,
        logoUrl: true,
        favicon: true,
        customCss: true,
        minPasswordLength: true,
        allowSelfRegistration: true,
      }
    });

    // Return defaults if no settings exist
    res.json({ settings: settings || defaultPublicSettings });
  } catch (error: any) {
    console.error('Error fetching public platform settings:', error);
    res.status(500).json({ error: 'Failed to fetch platform settings' });
  }
};

// Get platform settings
export const getPlatformSettings = async (req: Request, res: Response) => {
  try {
    // Try to get existing settings
    let settings = await prisma.platformSettings.findUnique({
      where: { id: 'singleton' }
    });

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: { id: 'singleton' }
      });
    }

    // Check if SMTP password is set (non-empty encrypted value)
    const hasSmtpPassword = !!settings.smtpPassword && settings.smtpPassword.length > 0;

    // Return settings with masked password
    res.json({
      settings: {
        ...settings,
        smtpPassword: hasSmtpPassword ? PASSWORD_MASK : '',
        hasSmtpPassword,
      }
    });
  } catch (error: any) {
    console.error('Error fetching platform settings:', error);
    res.status(500).json({ error: 'Failed to fetch platform settings' });
  }
};

// Helper function to get admin email
async function getAdminEmail(userId: string, userEmail?: string): Promise<string> {
  if (userEmail) return userEmail;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true }
  });

  return user?.email || 'unknown';
}

// Helper function to get client IP
function getClientIp(req: Request): string | null {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const forwardedStr = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return forwardedStr.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || null;
}

// Update platform settings
export const updatePlatformSettings = async (req: AuthRequest, res: Response) => {
  try {
    const {
      // General
      platformName,
      platformDescription,
      supportEmail,
      contactEmail,

      // Security
      requireEmailVerification,
      minPasswordLength,
      sessionTimeout,
      enableTwoFactor,
      maxLoginAttempts,

      // Course Settings
      autoEnrollNewUsers,
      defaultCourseVisibility,
      defaultQuizPassingScore,
      enableCertificates,
      allowCourseReviews,

      // User Settings
      defaultUserRole,
      allowSelfRegistration,
      requireProfileCompletion,
      enablePublicProfiles,

      // Email/Notifications
      enableEmailNotifications,
      enableEnrollmentEmails,
      enableCompletionEmails,
      enableWeeklyDigest,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,

      // Appearance
      primaryColor,
      secondaryColor,
      accentColor,
      fontFamily,
      fontSize,
      borderRadius,
      darkModeDefault,
      logoUrl,
      favicon,
      customCss,
    } = req.body;

    // Get current settings for audit logging
    const currentSettings = await prisma.platformSettings.findUnique({
      where: { id: 'singleton' }
    });

    // Determine password update behavior
    let passwordToSave: string | undefined;
    if (smtpPassword !== undefined) {
      if (smtpPassword === PASSWORD_MASK) {
        // Keep existing password (don't update)
        passwordToSave = undefined;
      } else if (smtpPassword === '') {
        // Clear password
        passwordToSave = '';
      } else {
        // Encrypt new password
        passwordToSave = encrypt(smtpPassword);
      }
    }

    // Build update data object
    const updateData: any = {
      // General
      ...(platformName !== undefined && { platformName }),
      ...(platformDescription !== undefined && { platformDescription }),
      ...(supportEmail !== undefined && { supportEmail }),
      ...(contactEmail !== undefined && { contactEmail }),

      // Security
      ...(requireEmailVerification !== undefined && { requireEmailVerification }),
      ...(minPasswordLength !== undefined && { minPasswordLength }),
      ...(sessionTimeout !== undefined && { sessionTimeout }),
      ...(enableTwoFactor !== undefined && { enableTwoFactor }),
      ...(maxLoginAttempts !== undefined && { maxLoginAttempts }),

      // Course Settings
      ...(autoEnrollNewUsers !== undefined && { autoEnrollNewUsers }),
      ...(defaultCourseVisibility !== undefined && { defaultCourseVisibility }),
      ...(defaultQuizPassingScore !== undefined && { defaultQuizPassingScore }),
      ...(enableCertificates !== undefined && { enableCertificates }),
      ...(allowCourseReviews !== undefined && { allowCourseReviews }),

      // User Settings
      ...(defaultUserRole !== undefined && { defaultUserRole }),
      ...(allowSelfRegistration !== undefined && { allowSelfRegistration }),
      ...(requireProfileCompletion !== undefined && { requireProfileCompletion }),
      ...(enablePublicProfiles !== undefined && { enablePublicProfiles }),

      // Email/Notifications
      ...(enableEmailNotifications !== undefined && { enableEmailNotifications }),
      ...(enableEnrollmentEmails !== undefined && { enableEnrollmentEmails }),
      ...(enableCompletionEmails !== undefined && { enableCompletionEmails }),
      ...(enableWeeklyDigest !== undefined && { enableWeeklyDigest }),
      ...(smtpHost !== undefined && { smtpHost }),
      ...(smtpPort !== undefined && { smtpPort }),
      ...(smtpUser !== undefined && { smtpUser }),
      ...(passwordToSave !== undefined && { smtpPassword: passwordToSave }),

      // Appearance
      ...(primaryColor !== undefined && { primaryColor }),
      ...(secondaryColor !== undefined && { secondaryColor }),
      ...(accentColor !== undefined && { accentColor }),
      ...(fontFamily !== undefined && { fontFamily }),
      ...(fontSize !== undefined && { fontSize }),
      ...(borderRadius !== undefined && { borderRadius }),
      ...(darkModeDefault !== undefined && { darkModeDefault }),
      ...(logoUrl !== undefined && { logoUrl }),
      ...(favicon !== undefined && { favicon }),
      ...(customCss !== undefined && { customCss }),
    };

    // Upsert settings (update if exists, create if not)
    const settings = await prisma.platformSettings.upsert({
      where: { id: 'singleton' },
      update: updateData,
      create: {
        id: 'singleton',
        // General
        platformName: platformName || 'CyberGuard AI',
        platformDescription: platformDescription || 'Advanced cybersecurity training platform',
        supportEmail: supportEmail || 'support@cyberguard.com',
        contactEmail: contactEmail || 'contact@cyberguard.com',

        // Security
        requireEmailVerification: requireEmailVerification ?? false,
        minPasswordLength: minPasswordLength ?? 6,
        sessionTimeout: sessionTimeout ?? 7,
        enableTwoFactor: enableTwoFactor ?? false,
        maxLoginAttempts: maxLoginAttempts ?? 5,

        // Course Settings
        autoEnrollNewUsers: autoEnrollNewUsers ?? false,
        defaultCourseVisibility: defaultCourseVisibility || 'public',
        defaultQuizPassingScore: defaultQuizPassingScore ?? 70,
        enableCertificates: enableCertificates ?? true,
        allowCourseReviews: allowCourseReviews ?? true,

        // User Settings
        defaultUserRole: defaultUserRole || 'STUDENT',
        allowSelfRegistration: allowSelfRegistration ?? true,
        requireProfileCompletion: requireProfileCompletion ?? false,
        enablePublicProfiles: enablePublicProfiles ?? false,

        // Email/Notifications
        enableEmailNotifications: enableEmailNotifications ?? false,
        enableEnrollmentEmails: enableEnrollmentEmails ?? true,
        enableCompletionEmails: enableCompletionEmails ?? true,
        enableWeeklyDigest: enableWeeklyDigest ?? false,
        smtpHost: smtpHost || '',
        smtpPort: smtpPort || '587',
        smtpUser: smtpUser || '',
        smtpPassword: passwordToSave || '',

        // Appearance
        primaryColor: primaryColor || '#3b82f6',
        secondaryColor: secondaryColor || '#10b981',
        accentColor: accentColor || '#f59e0b',
        fontFamily: fontFamily || 'Inter',
        fontSize: fontSize || 'normal',
        borderRadius: borderRadius || 'medium',
        darkModeDefault: darkModeDefault ?? false,
        logoUrl: logoUrl || '',
        favicon: favicon || '',
        customCss: customCss || '',
      },
    });

    // Create audit log entries for changed fields
    if (req.userId && currentSettings) {
      const adminEmail = await getAdminEmail(req.userId, req.userEmail);
      const ipAddress = getClientIp(req);
      const auditEntries: AuditLogEntry[] = [];

      // Compare all fields and log changes
      const fieldsToCompare = [
        'platformName', 'platformDescription', 'supportEmail', 'contactEmail',
        'requireEmailVerification', 'minPasswordLength', 'sessionTimeout', 'enableTwoFactor', 'maxLoginAttempts',
        'autoEnrollNewUsers', 'defaultCourseVisibility', 'defaultQuizPassingScore', 'enableCertificates', 'allowCourseReviews',
        'defaultUserRole', 'allowSelfRegistration', 'requireProfileCompletion', 'enablePublicProfiles',
        'enableEmailNotifications', 'enableEnrollmentEmails', 'enableCompletionEmails', 'enableWeeklyDigest',
        'smtpHost', 'smtpPort', 'smtpUser',
        'primaryColor', 'secondaryColor', 'accentColor', 'fontFamily', 'fontSize', 'borderRadius', 'darkModeDefault',
        'logoUrl', 'favicon', 'customCss',
      ];

      for (const field of fieldsToCompare) {
        const oldVal = (currentSettings as any)[field];
        const newVal = (settings as any)[field];
        if (oldVal !== newVal && newVal !== undefined) {
          auditEntries.push({
            adminId: req.userId,
            adminEmail,
            fieldName: field,
            oldValue: String(oldVal ?? ''),
            newValue: String(newVal ?? ''),
            ipAddress,
          });
        }
      }

      // Handle smtpPassword separately (it's sensitive)
      if (passwordToSave !== undefined) {
        const hadPassword = !!currentSettings.smtpPassword;
        const hasPassword = !!passwordToSave;

        if (hadPassword !== hasPassword || (hadPassword && hasPassword)) {
          auditEntries.push({
            adminId: req.userId,
            adminEmail,
            fieldName: 'smtpPassword',
            oldValue: hadPassword ? '[SET]' : '[EMPTY]',
            newValue: hasPassword ? '[SET]' : '[EMPTY]',
            ipAddress,
          });
        }
      }

      // Log all changes
      if (auditEntries.length > 0) {
        await logSettingsChanges(auditEntries);
      }
    }

    // Check if SMTP password is set
    const hasSmtpPassword = !!settings.smtpPassword && settings.smtpPassword.length > 0;

    // Return settings with masked password
    res.json({
      settings: {
        ...settings,
        smtpPassword: hasSmtpPassword ? PASSWORD_MASK : '',
        hasSmtpPassword,
      },
      message: 'Platform settings updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating platform settings:', error);
    res.status(500).json({ error: 'Failed to update platform settings' });
  }
};

// Get settings audit log
export const getSettingsAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const fieldFilter = req.query.field as string | undefined;

    const { entries, total } = await getAuditLog(limit, offset, fieldFilter);
    const fields = await getAuditedFieldNames();

    res.json({
      entries,
      total,
      limit,
      offset,
      fields,
    });
  } catch (error: any) {
    console.error('Error fetching settings audit log:', error);
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
};

// Rollback a settings change from audit log
export const rollbackSettingsChange = async (req: AuthRequest, res: Response) => {
  try {
    const auditLogId = req.params.auditLogId as string;

    // Get the audit log entry
    const auditEntry = await prisma.settingsAuditLog.findUnique({
      where: { id: auditLogId }
    });

    if (!auditEntry) {
      return res.status(404).json({ error: 'Audit log entry not found' });
    }

    // Check if this is a sensitive field that can't be rolled back
    if (auditEntry.fieldName === 'smtpPassword') {
      return res.status(400).json({ error: 'Cannot rollback password changes for security reasons' });
    }

    // Check if oldValue is redacted (can't rollback)
    if (auditEntry.oldValue === '[REDACTED]' || auditEntry.oldValue === null) {
      return res.status(400).json({ error: 'Cannot rollback: original value not available' });
    }

    // Get current settings
    const currentSettings = await prisma.platformSettings.findUnique({
      where: { id: 'singleton' }
    });

    if (!currentSettings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    // Prepare update data with the old value
    const updateData: any = {};
    const fieldName = auditEntry.fieldName;
    const oldValue = auditEntry.oldValue;

    // Parse the value based on field type
    if (typeof (currentSettings as any)[fieldName] === 'boolean') {
      updateData[fieldName] = oldValue === 'true';
    } else if (typeof (currentSettings as any)[fieldName] === 'number') {
      updateData[fieldName] = parseInt(oldValue);
    } else {
      updateData[fieldName] = oldValue;
    }

    // Update settings
    await prisma.platformSettings.update({
      where: { id: 'singleton' },
      data: updateData
    });

    // Create audit log entry for the rollback
    const adminEmail = await getAdminEmail(req.userId!, req.userEmail!);
    const ipAddress = getClientIp(req);

    await logSettingsChanges([{
      adminId: req.userId!,
      adminEmail,
      action: 'ROLLBACK',
      fieldName: auditEntry.fieldName,
      oldValue: auditEntry.newValue,
      newValue: auditEntry.oldValue,
      ipAddress
    }]);

    res.json({
      message: 'Settings rolled back successfully',
      fieldName: auditEntry.fieldName,
      rolledBackTo: auditEntry.oldValue
    });
  } catch (error) {
    console.error('Error rolling back settings:', error);
    res.status(500).json({ error: 'Failed to rollback settings' });
  }
};

// Export audit log to CSV
export const exportAuditLogCSV = async (req: AuthRequest, res: Response) => {
  try {
    // Get filter parameters
    const fieldFilter = req.query.field as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    // Build where clause
    const where: any = {};
    if (fieldFilter) {
      where.fieldName = fieldFilter;
    }
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }

    // Fetch all audit log entries matching filters
    const entries = await prisma.settingsAuditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' }
    });

    // Generate CSV
    const headers = ['Timestamp', 'Admin Email', 'Admin ID', 'Action', 'Field Name', 'Old Value', 'New Value', 'IP Address'];
    const rows = entries.map(entry => [
      new Date(entry.timestamp).toISOString(),
      entry.adminEmail,
      entry.adminId,
      entry.action,
      entry.fieldName,
      entry.oldValue || '',
      entry.newValue || '',
      entry.ipAddress || ''
    ]);

    // Escape CSV values (handle commas and quotes)
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=settings-audit-log-${Date.now()}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting audit log:', error);
    res.status(500).json({ error: 'Failed to export audit log' });
  }
};

// Send test email to verify SMTP configuration
export const testEmailSettings = async (req: AuthRequest, res: Response) => {
  try {
    // Get admin's email to send the test to
    const adminEmail = req.body.email;

    if (!adminEmail) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    const result = await sendTestEmail(adminEmail);

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        details: result.details,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.message,
        details: result.details,
      });
    }
  } catch (error: any) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      details: error.message,
    });
  }
};
