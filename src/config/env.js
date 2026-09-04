const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DEFAULT_BASE_URL = 'https://restful-booker.herokuapp.com';
const baseUrl = process.env.BASE_URL || DEFAULT_BASE_URL;

try {
  new URL(baseUrl);
} catch {
  throw new Error('BASE_URL must be a valid absolute URL. See .env.example.');
}

module.exports = { baseUrl: baseUrl.replace(/\/$/, '') };
