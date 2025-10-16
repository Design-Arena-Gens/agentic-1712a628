'use client';

import { useEffect } from 'react';

const toneStyles = {
  success: {
    background: 'rgba(57, 217, 138, 0.16)',
    border: '1px solid rgba(57, 217, 138, 0.4)',
    color: 'var(--success)',
  },
  warning: {
    background: 'rgba(250, 204, 21, 0.16)',
    border: '1px solid rgba(250, 204, 21, 0.4)',
    color: 'var(--warning)',
  },
  error: {
    background: 'rgba(248, 113, 113, 0.16)',
    border: '1px solid rgba(248, 113, 113, 0.36)',
    color: 'var(--error)',
  },
  info: {
    background: 'rgba(89, 213, 255, 0.16)',
    border: '1px solid rgba(89, 213, 255, 0.4)',
    color: 'var(--primary)',
  },
};

export default function Toast({ message, tone = 'info', onDismiss, duration = 3800 }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => {
      onDismiss?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        padding: '14px 18px',
        borderRadius: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontWeight: 600,
        letterSpacing: '0.03em',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 18px 40px rgba(8, 12, 26, 0.32)',
        zIndex: 50,
        ...toneStyles[tone],
      }}
    >
      <span>{message}</span>
      <button
        type="button"
        className="button-secondary"
        style={{ padding: '6px 12px' }}
        onClick={onDismiss}
      >
        Close
      </button>
    </div>
  );
}
