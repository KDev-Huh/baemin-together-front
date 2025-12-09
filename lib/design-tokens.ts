export const tokens = {
  colors: {
    primary: '#2AC1BC', // Baemin Mint
    primaryHover: '#25A6A2',
    background: '#F0F0F0',
    surface: '#FFFFFF',
    text: {
      primary: '#333333',
      secondary: '#666666',
      muted: '#999999',
    },
    border: '#E0E0E0',
    error: '#E53935',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
} as const;
