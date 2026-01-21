import axios from 'axios';
import config from '@/config';

const wahaInstance = axios.create({
  baseURL: 'https://waha.tuut.shop',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': config.wahaApiKey,
  },
});

export default wahaInstance;