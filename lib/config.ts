export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXTAUTH_URL || 'https://www.archflow.space';
  }
  
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
};

export const getWebSocketUrl = () => {
  const baseUrl = getBaseUrl();
  return baseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
};