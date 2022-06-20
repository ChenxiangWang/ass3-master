import { message } from 'antd';
import { API_HOST } from './const';
import { createExprLogger } from './logger';
import { getUser } from './userControl';
import { useNavigate } from 'react-router';

const canSendData = (method = 'get') => ['POST', 'PUT', 'DELETE'].includes(method.toUpperCase());
const logger = createExprLogger('request @ ')
/**
 * @param {string} url
 * @param {object} options
 * @returns
 */
export default function request (url, options = {}) {
  const { method, data, specToken } = options;
  const localToken = getUser()?.sessionToken;
  logger('localToken = ' + localToken);
  const token = specToken || localToken;
  const opts = {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
    body: canSendData(method) ? JSON.stringify(data || {}) : undefined,
  }
  logger('url : ' + url)
  logger('opts : ' + JSON.stringify(opts))
  return fetch(`${API_HOST}${url}`, opts)
    .then(res => res.json())
    .then(data => {
      logger('【res】 : ' + JSON.stringify(data));
      // deal error
      if (data.error) {
      // deal token error
        if (data.error.includes('invalid token')) {
          message.error('token expired, please login');
          const navigate = useNavigate();
          navigate()
        } else {
          message.error(data.error, 'error');
        }
        return;
      }
      return data;
    });
}
