// src/components/ui/card.jsx
import React from 'react';

export default function Card({ children, style, ...props }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      padding: 24,
      ...style
    }} {...props}>
      {children}
    </div>
  );
}
