import API from './axios';

export const login = async (credentials) => {
	try {
		const response = await API.post('/login', credentials);
		return response.data;
	} catch (error) {
		throw error.response ? error.response.data : error;
	}
};
