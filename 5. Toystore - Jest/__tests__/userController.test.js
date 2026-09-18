const userController = require('../src/controllers/user.controller');
const userModel = require('../src/models/user.model');
const refreshToken = require('../src/models/refreshToken.model');
jest.mock('../src/models/user.model');
jest.mock('../src/redis.service');
jest.mock('../src/models/refreshToken.model');
// мок жвт
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
    .mockImplementation((payload, secret) => {
      if (secret === process.env.JWT_ACCESS_SECRET) return 'mocked-access-token';
      if (secret === process.env.JWT_REFRESH_SECRET) return 'mocked-refresh-token';
      return 'mocked-token';
    })
}));


// тестируем логин!
describe('userController.login', () =>{
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('Если неправильный емаил, возращает 401', async () =>{
    userModel.findByEmail.mockResolvedValue(null);
    const req = {
      body: {
        email: 'nonexistent@test.com',
        password: 'password123'
      },
      headers: {
        'x-session-id': 'some-session-id'
      }
    };

    const res = {
        status: jest.fn().mockReturnThis(), // чтобы можно было цепочкой вызывать .json()
        json: jest.fn().mockReturnThis()
        };
        //Вызываем метод
    await userController.login(req, res);
    //Проверки:
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Неверный email или пароль'
    });
    expect(userModel.findByEmail).toHaveBeenCalledWith('nonexistent@test.com');
   });


   test('если пароль не тот, то 401', async() =>{
        const req = {
      body: {
        email: 'nonexistent@test.com',
        password: 'password123'
      },
      headers: {
        'x-session-id': 'some-session-id'
      }
    };
    
    const res = {
        status: jest.fn().mockReturnThis(), // чтобы можно было цепочкой вызывать .json()
        json: jest.fn().mockReturnThis()
        };


    userModel.findByEmail.mockResolvedValue({
        is_active: 1,
    });
    userModel.comparePassword.mockResolvedValue(false);
            //Вызываем метод
    await userController.login(req, res);
    //Проверки:
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Неверный email или пароль'
    });
    expect(userModel.findByEmail).toHaveBeenCalledWith('nonexistent@test.com');
   });
         //Проверка на забаненого
   test('если забанен, то 403', async() =>{
        const req = {
      body: {
        email: 'nonexistent@test.com',
        password: 'password123'
      },
      headers: {
        'x-session-id': 'some-session-id'
      }
    };
    
    const res = {
        status: jest.fn().mockReturnThis(), // чтобы можно было цепочкой вызывать .json()
        json: jest.fn().mockReturnThis()
        };


    userModel.findByEmail.mockResolvedValue({
        is_active: 0
    });
    userModel.comparePassword.mockResolvedValue(true);
            //Вызываем метод
    await userController.login(req, res);
    //Проверки:
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Аккаунт заблокирован'
    });
    expect(userModel.findByEmail).toHaveBeenCalledWith('nonexistent@test.com');
   });

 // тест УСПЕШНОГО ВХОДА

   test('если успешно, то 200', async() =>{
        const req = {
      body: {
  email: 'user@example.com',
  password: '123'
},
      headers: {
        'x-session-id': 'some-session-id'
      }
    };
    
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    const mockUser = {
    id: 1,
    email: 'user@example.com',
    is_admin: 0,
    is_active: 1,
    first_name: 'Иван',
    last_name: 'Иванов',
    phone: '+7 123 456-78-90',
    birth_date: '1990-01-01',
    registration_date: '2026-01-01'
    };
    
    userModel.findByEmail.mockResolvedValue(mockUser);
    userModel.comparePassword.mockResolvedValue(true);
    refreshToken.save.mockResolvedValue(1);
    userModel.transferGuestCart.mockResolvedValue(1);
            //Вызываем метод
    await userController.login(req, res);
    //Проверки:
    expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Успешный вход',
            data: {
                user: {
                    id: 1,
                    email: 'user@example.com',
                },
                tokens: {
                    access_token: 'mocked-access-token',
                    refresh_token: 'mocked-refresh-token',
                    token_type: 'Bearer',
                    expires_in: 900
                }
            }
        });
  expect(userModel.findByEmail).toHaveBeenCalledWith('user@example.com');
  expect(userModel.comparePassword).toHaveBeenCalledWith(mockUser, '123');
  expect(refreshToken.save).toHaveBeenCalledWith(1, 'mocked-refresh-token');
  expect(userModel.transferGuestCart).toHaveBeenCalledWith(1, 'some-session-id');
    });
});


    /// ==== тест регистрации
describe('userController.register', () =>{
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('Если нехватает полей, то 400', async () =>{
    const req = {
      body: {
        email: 'user@example.com',
        password: '123'
      },
      headers: {
        'x-session-id': 'some-session-id'
      }
    };
    
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
            //Вызываем метод
    await userController.register(req, res);
    //Проверки:
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email, пароль, имя и фамилия обязательны для заполнения'
    });

  });
  test('Если почта занята, то 409', async () =>{
    const req = {
      body: {
        email: 'existing@mail.com',
        password: '123',
        first_name: 'Тест',
        last_name: 'Тестов'
      },
      headers: {
        'x-session-id': 'some-session-id'
      }
    };
    
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    
    userModel.findByEmail.mockResolvedValue({ anything: 1 });
            //Вызываем метод
    await userController.register(req, res);
             //проврки
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Пользователь с таким email уже существует'
    });
    expect(userModel.findByEmail).toHaveBeenCalledWith('existing@mail.com');
  });


  test('Если все ок, то 201, хэппи', async () =>{
    const req = {
      body: {
        email: 'test@mail.com',
        password: '123',
        first_name: 'Тест',
        last_name: 'Тестов'
      },
      headers: {
        'x-session-id': 'some-session-id'
      }
    };
    
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };

    userModel.findByEmail.mockResolvedValue(null);
    userModel.create.mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        password: '123',
        first_name: 'Тест',
        last_name: 'Тестов'});
    refreshToken.save.mockResolvedValue(1);
    userModel.transferGuestCart.mockResolvedValue(1);
            //Вызываем метод
    await userController.register(req, res);
             //проверки
    expect(res.status).toHaveBeenCalledWith(201);    
    expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Пользователь успешно зарегистрирован',
            data: {
                user: {
                  "email": "test@mail.com",
                  "first_name": "Тест",
                  "id": 1,
                  "last_name": "Тестов",
                  "password": "123",
                },
                tokens: {
                    access_token: 'mocked-access-token',
                    refresh_token: 'mocked-refresh-token',
                    token_type: 'Bearer',
                    expires_in: 900
                }
            }
        });
  expect(userModel.findByEmail).toHaveBeenCalledWith('test@mail.com');
  expect(refreshToken.save).toHaveBeenCalledWith(1, 'mocked-refresh-token');
  expect(userModel.transferGuestCart).toHaveBeenCalledWith(1, 'some-session-id');
  });
});


    /// ==== ТЕСТ Обновление профиля
describe('userController.updateProfile', () =>{
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('Если пустой запрос, то 400', async () =>{
    const req = {
      user: { id: 1 },
      body: {}}; //Пустой
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    await userController.updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);  
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Нет данных для обновления'
    });
  });
    test('Если не передали айди, то 500', async () =>{
    const req = {
      body: {first_name: 'Тест'}}; //без айди
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    await userController.updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(500);  
    expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Ошибка при обновлении профиля',
            error: "Cannot read properties of undefined (reading 'id')"
    });
  });

    test('Если попытаться удалить свое имя, то 400', async () =>{
    const req = {
      user: { id: 1 },
      body: {first_name:''}}; //Пробуем стереть имя
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    await userController.updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);  
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Нет данных для обновления'
    });
  });
  test('Если пользоваательне найден, то 404', async () =>{

    const req = {
      user: { id: 1 },
      body: {first_name: 'Тест'}};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    userModel.update.mockResolvedValue(null);
    await userController.updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);  
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Пользователь не найден'
    });
    expect(userModel.update).toHaveBeenCalledWith(1, {first_name: 'Тест'});
  });

  test('Веселый сценарий обновления, стераем свой телефон', async () =>{
    const req = {
      user: { id: 1 },
      body: {phone: ''}};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    userModel.update.mockResolvedValue({user: 'updated'});
    await userController.updateProfile(req, res);
    expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Профиль успешно обновлен',
            data: {user: 'updated'}
    });
    expect(userModel.update).toHaveBeenCalledWith(1, {phone: ''});


  });
});