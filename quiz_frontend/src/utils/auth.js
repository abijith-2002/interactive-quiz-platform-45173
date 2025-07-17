import jwt_decode from 'jwt-decode';

export const setToken = (token) => {
  localStorage.setItem('quiz_token', token);
};

export const getToken = () => {
  return localStorage.getItem('quiz_token');
};

export const removeToken = () => {
  localStorage.removeItem('quiz_token');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwt_decode(token);
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwt_decode(token);
    return decoded.role;
  } catch (error) {
    return null;
  }
};
