import { useState } from 'react';
import { Shield } from 'lucide-react';
import { usePlatformSettings } from '../context/PlatformSettingsContext';

interface PlatformLogoProps {
  className?: string;
  iconClassName?: string;
}

export function PlatformLogo({ className = 'w-10 h-10', iconClassName = 'w-6 h-6' }: PlatformLogoProps) {
  const { settings } = usePlatformSettings();
  const [imageError, setImageError] = useState(false);

  if (settings.logoUrl && !imageError) {
    return (
      <img
        src={settings.logoUrl}
        alt={settings.platformName || 'Logo'}
        className={className}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback to Shield icon
  return (
    <div className={`bg-primary rounded-lg flex items-center justify-center ${className}`}>
      <Shield className={`text-primary-foreground ${iconClassName}`} />
    </div>
  );
}
