import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <section className={`rounded-2xl border border-line bg-bg-elev p-6 sm:p-8 ${className}`}>
      {children}
    </section>
  );
}

interface CardHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export function CardHeader({ icon: Icon, title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-bg-tint text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">{title}</h2>
          <p className="text-sm text-ink-mute">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
