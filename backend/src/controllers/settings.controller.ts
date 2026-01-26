import { Request, Response } from 'express';
import prisma from '../config/database';

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

    res.json({ settings });
  } catch (error: any) {
    console.error('Error fetching platform settings:', error);
    res.status(500).json({ error: 'Failed to fetch platform settings' });
  }
};

// Update platform settings
export const updatePlatformSettings = async (req: Request, res: Response) => {
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
      logoUrl,
      favicon,
      customCss,
    } = req.body;

    // Upsert settings (update if exists, create if not)
    const settings = await prisma.platformSettings.upsert({
      where: { id: 'singleton' },
      update: {
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
        ...(smtpPassword !== undefined && { smtpPassword }),

        // Appearance
        ...(primaryColor !== undefined && { primaryColor }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(favicon !== undefined && { favicon }),
        ...(customCss !== undefined && { customCss }),
      },
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
        smtpPassword: smtpPassword || '',

        // Appearance
        primaryColor: primaryColor || '#3b82f6',
        logoUrl: logoUrl || '',
        favicon: favicon || '',
        customCss: customCss || '',
      },
    });

    res.json({ settings, message: 'Platform settings updated successfully' });
  } catch (error: any) {
    console.error('Error updating platform settings:', error);
    res.status(500).json({ error: 'Failed to update platform settings' });
  }
};
