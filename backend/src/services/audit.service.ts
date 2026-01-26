import prisma from '../config/database';

// Sensitive fields that should be redacted in audit logs
const SENSITIVE_FIELDS = ['smtpPassword'];

// Mask sensitive values for audit logging
function maskSensitiveValue(fieldName: string, value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  if (SENSITIVE_FIELDS.includes(fieldName)) {
    return '[REDACTED]';
  }
  return String(value);
}

export interface AuditLogEntry {
  adminId: string;
  adminEmail: string;
  action?: string;
  fieldName: string;
  oldValue?: string | null;
  newValue?: string | null;
  ipAddress?: string | null;
}

export interface SettingsAuditLogEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  ipAddress: string | null;
  timestamp: Date;
}

/**
 * Log multiple settings changes to the audit log
 */
export async function logSettingsChanges(entries: AuditLogEntry[]): Promise<void> {
  if (entries.length === 0) return;

  const auditEntries = entries.map(entry => ({
    adminId: entry.adminId,
    adminEmail: entry.adminEmail,
    action: entry.action || 'UPDATE',
    fieldName: entry.fieldName,
    oldValue: maskSensitiveValue(entry.fieldName, entry.oldValue),
    newValue: maskSensitiveValue(entry.fieldName, entry.newValue),
    ipAddress: entry.ipAddress || null,
  }));

  await prisma.settingsAuditLog.createMany({
    data: auditEntries,
  });
}

/**
 * Get settings audit log entries with pagination and optional field filter
 */
export async function getSettingsAuditLog(
  limit: number = 50,
  offset: number = 0,
  fieldFilter?: string
): Promise<{ entries: SettingsAuditLogEntry[]; total: number }> {
  const where = fieldFilter ? { fieldName: fieldFilter } : {};

  const [entries, total] = await Promise.all([
    prisma.settingsAuditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.settingsAuditLog.count({ where }),
  ]);

  return { entries, total };
}

/**
 * Get list of unique field names that have audit entries
 */
export async function getAuditedFieldNames(): Promise<string[]> {
  const fields = await prisma.settingsAuditLog.findMany({
    select: { fieldName: true },
    distinct: ['fieldName'],
    orderBy: { fieldName: 'asc' },
  });

  return fields.map(f => f.fieldName);
}
