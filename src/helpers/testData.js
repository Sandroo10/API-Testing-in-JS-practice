function uniqueTestName(prefix = 'ApiStudent') {
  return `${prefix}-${Date.now()}`;
}

const validUser = {
  username: 'admin',
  password: 'password123'
};

module.exports = { uniqueTestName, validUser };
