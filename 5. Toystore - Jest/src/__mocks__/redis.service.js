module.exports = {
  get: jest.fn().mockResolvedValue(null),
 set: jest.fn().mockResolvedValue('OK'),
delete: jest.fn().mockResolvedValue(1),
deletePattern: jest.fn().mockResolvedValue(1),
exists: jest.fn().mockResolvedValue(1),
setToken: jest.fn().mockResolvedValue(true),
getToken: jest.fn().mockResolvedValue(null)
};