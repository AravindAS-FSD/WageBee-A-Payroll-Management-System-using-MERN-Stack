export const getToken = () => {
    return localStorage.getItem('token');
};
 
export const isManager = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      return userData?.role === 'manager';
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return false;
    }
};
  
export const isAuthenticated = () => {
    return !!getToken();
};
  
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};