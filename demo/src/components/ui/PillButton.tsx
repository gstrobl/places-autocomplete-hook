import { ButtonHTMLAttributes } from 'react';

type PillButtonVariant = 'primary' | 'danger' | 'ghost';

const VARIANT_CLASSES: Record<PillButtonVariant, string> = {
  primary:
    'bg-cta-bg text-cta-fg hover:bg-cta-bg-hover disabled:opacity-40 disabled:hover:bg-cta-bg',
  danger: 'border border-accent text-accent hover:bg-accent hover:text-cream',
  ghost: 'border border-line text-ink-soft hover:bg-bg-tint hover:text-ink',
};

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PillButtonVariant;
}

export function PillButton({ variant = 'primary', className = '', ...props }: PillButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
