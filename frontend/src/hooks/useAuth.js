import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login as loginApi } from '../api/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const loginWithApi = async (credentials) => {
    const data = await loginApi(credentials);
    context.login(data.token, data.user);
    return data;
  };

  return {
    ...context,
    loginWithApi,
  };
};
