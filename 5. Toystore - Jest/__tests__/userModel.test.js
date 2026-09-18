jest.mock('../db', () => ({
  pool: {
    execute: jest.fn(),
    getConnection: jest.fn(),
  },
}));


const { pool } = require('../db');
const bcrypt = require('bcryptjs');
const UserModel = require('../src/models/user.model')
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('saltedHash'),
  compare: jest.fn().mockResolvedValue(true),
}));
// ТЕСТ регистации!
describe('UserModel.create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
  jest.restoreAllMocks(); 
});

  test('Хэппи без необязательных полей', async () => {
    const newUser = {email: 'test@mail', password:'123', first_name:'Тест',
       last_name:'Тестов'};
    pool.execute.mockResolvedValueOnce([{insertId: 42,  affectedRows: 1 }]);
    const getOrderByIdSpy = jest.spyOn(UserModel, 'findById').mockResolvedValue([{ id: 42, email: 'test@mail', first_name:'Тест',
       last_name:'Тестов'}]);
    const result = await UserModel.create(newUser);
    expect(result).toEqual([{ id: 42, email: 'test@mail', first_name:'Тест',
       last_name:'Тестов'}]);
    expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
    expect(pool.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      ['test@mail', 'saltedHash', 'Тест', 'Тестов', null, null]
    );
  });
    test('Хэппи все поля', async () => {
    const newUser = {email: 'test@mail', password:'123', first_name:'Тест',
       last_name:'Тестов', phone:'8800553535', birth_date: '1990-05-15'};
    pool.execute.mockResolvedValueOnce([{insertId: 42,  affectedRows: 1 }]);
    const getOrderByIdSpy = jest.spyOn(UserModel, 'findById').mockResolvedValue([{ id: 42, email: 'test@mail', first_name:'Тест',
       last_name:'Тестов', phone:'8800553535', birth_date: '1990-05-15'}]);
    const result = await UserModel.create(newUser);
    expect(result).toEqual([{ id: 42, email: 'test@mail', first_name:'Тест',
       last_name:'Тестов', phone:'8800553535', birth_date: '1990-05-15'}]);
    expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
    expect(pool.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      ['test@mail', 'saltedHash', 'Тест', 'Тестов', '8800553535', '1990-05-15']
    );
  });
});

// тест проверки пароля
describe('OrdersModel.comparePassword', () => {
  jest.clearAllMocks();
  test('проверка пароля', async () => {
    const result = await UserModel.comparePassword({id:1, email:'test@test.com', password_hash:'saltedHash', first_name:'Тест', last_name:'Тестов', phone:'8-800-555-35-35', birth_date: null, last_login:'', is_active:1, is_admin: 0}, 'password')
    expect(result).toEqual(true);
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'saltedHash');
  });
});
//тест ОБНОВЛЕНИЯ ПРОФИЛЯ
describe('UserModel.update', () => {
  beforeEach(() => {
    jest.spyOn(UserModel, 'findById').mockResolvedValue({ id: 1, name: 'Updated' });
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks(); 
  });
  test.each([
    {
      description: 'обновление только базовых полей (first_name, phone)',
      id: 1,
      userData: { first_name: 'Тест', phone: '8-800-555-35-35' },
      expectedQuery: 'UPDATE users SET first_name = ?, phone = ? WHERE id = ?',
      expectedValues: ['Тест', '8-800-555-35-35', 1],
      shouldHash: false
    },
    {
      description: 'обновление только базовых полей (last_name, birth_date)',
      id: 1,
      userData: { last_name: 'Тестов', birth_date: '1990-05-15' },
      expectedQuery: 'UPDATE users SET last_name = ?, birth_date = ? WHERE id = ?',
      expectedValues: ['Тестов', '1990-05-15', 1],
      shouldHash: false
    },
    {
      description: 'обновление только ПАРОЛЯ',
      id: 1,
      userData: { password: 'password' },
      expectedQuery: 'UPDATE users SET password_hash = ? WHERE id = ?',
      expectedValues: ['saltedHash', 1],
      shouldHash: true
    },
    {
      description: 'обновление всех полей разом',
      id: 1,
      userData: { password: 'password', first_name: 'Тест', phone: '8-800-555-35-35', last_name: 'Тестов', birth_date: '1990-05-15' },
      expectedQuery: 'UPDATE users SET first_name = ?, last_name = ?, phone = ?, birth_date = ?, password_hash = ? WHERE id = ?',
      expectedValues: ['Тест', 'Тестов', '8-800-555-35-35', '1990-05-15', 'saltedHash', 1],
      shouldHash: true
    }
  ])('$description', async ({ id, userData, expectedQuery, expectedValues, shouldHash }) => {
    const result = await UserModel.update(id, userData);
    if (shouldHash) {
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    } else {
      expect(bcrypt.hash).not.toHaveBeenCalled();
    }
    expect(pool.execute).toHaveBeenCalledWith(
      expectedQuery,
      expectedValues
    );
    expect(result).toEqual({ id: 1, name: 'Updated' });
  });

  test('возвращает null, если переданы пустые или неразрешенные поля', async () => {
    const result = await UserModel.update(1, { invalid_field: 'test' });
    
    expect(result).toBeNull();
    expect(pool.execute).not.toHaveBeenCalled();
  });
});

// Перенос корзины
describe('UserModel.transferGuestCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('Ежели не передали sessionId', async () => {
    const result = await UserModel.transferGuestCart(1, null);
    expect(result).toBeNull();
    expect(pool.execute).not.toHaveBeenCalled();
  });
  test('Ежели у пользователя есть авторизованая корзина', async () => {
    pool.execute.mockResolvedValueOnce([[{id: 11, user_id: 1, session_id: null, product_id: 2, quantity:2}]]);
    const result = await UserModel.transferGuestCart(1, 'someSessionId');
    expect(result).toBeNull();
    expect(pool.execute).toHaveBeenCalledTimes(1);
  });
  test('Ежели у пользователя нет никакой корзины', async () => {
    pool.execute.mockResolvedValueOnce([[]]);
    pool.execute.mockResolvedValueOnce([[]]);
    const result = await UserModel.transferGuestCart(1, 'someSessionId');
    expect(result).toBeNull();
    expect(pool.execute).toHaveBeenCalledTimes(2);
  });
  test('перенос корзины', async () => {
    pool.execute.mockResolvedValueOnce([[]]);
    pool.execute.mockResolvedValueOnce([[{id: 11, user_id: null, session_id: 'someSessionId', product_id: 2, quantity:2}]]);
    pool.execute.mockResolvedValueOnce([{ affectedRows:1, changedRows:1 }])
    const result = await UserModel.transferGuestCart(1, 'someSessionId');
    expect(result).toEqual({ affectedRows:1, changedRows:1 });
    expect(pool.execute).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('UPDATE carts SET user_id = ?'),
    [1, 'someSessionId']
  );  
  });
});