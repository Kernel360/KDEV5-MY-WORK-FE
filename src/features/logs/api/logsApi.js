import api from '../../../api/api';

export const getLogs = async (page = 0, size = 10) => {
  try {
    const response = await api.get(`/logs?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};

export const getActivityLogs = async (page = 1, actionType = '', targetType = '') => {
  try {
    let url = `/api/activity-logs?page=${page}`;
    
    if (actionType) {
      url += `&actionType=${actionType}`;
    }
    
    if (targetType) {
      url += `&targetType=${targetType}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    throw error;
  }
}; 