'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const demoLinks = [
  { label: '🌐 Restaurant Site', href: '/', desc: 'What your customers see' },
  { label: '📅 Book a Table', href: '/book', desc: 'The booking experience' },
  { label: '🎯 Admin Demo', href: '/demo', desc: 'Back-of-house management' },
];

export default function DemoBanner() {
  const pathname = usePathname();

  // Don't show on the real admin page
  if (pathname === '/admin') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(212, 175, 55, 0.3)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    }}>
      <span style={{
        color: '#D4AF37',
        fontSize: '13px',
        fontWeight: 600,
        marginRight: '12px',
        letterSpacing: '0.05em',
      }}>
        DEMO
      </span>
      {demoLinks.map((link) => {
        const isActive = pathname === link.href || (link.href === '/' && pathname === '/');
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: isActive ? '#D4AF37' : '#94a3b8',
              background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              border: isActive ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(30, 41, 59, 0.8)',
              textDecoration: 'none',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '0',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                e.currentTarget.style.color = '#e2e8f0';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'rgba(30, 41, 59, 0.8)';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
          >
            <span>{link.label}</span>
            <span style={{ fontSize: '10px', opacity: 0.6 }}>{link.desc}</span>
          </Link>
        );
      })}
      <span style={{
        color: '#64748b',
        fontSize: '11px',
        marginLeft: '12px',
      }}>
        Powered by <span style={{ color: '#D4AF37' }}>Tavola</span>
      </span>
    </div>
  );
}
