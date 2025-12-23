// Generate a unique anonymous ID
export const generateAnonId = () => {
  return 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get or create anonymous ID
export const getOrCreateAnonId = () => {
  let anonId = localStorage.getItem('anonId');
  if (!anonId) {
    anonId = generateAnonId();
    localStorage.setItem('anonId', anonId);
  }
  return anonId;
};