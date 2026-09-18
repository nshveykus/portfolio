const OrdersModel = require('../src/models/orders.model');
const ordersController= require('../src/controllers/orders.controller');
jest.mock('../src/models/orders.model');


// тест создания заказа
describe('OrdersController.createOrder', () =>{
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
  console.error.mockRestore();
  });

  test('Если не указан адрес доставки, то 400', async () =>{
    const req = {
      body: {
        payment_method_id: 1
        //Без адреса
      },
      user: {
        id: 1
      }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
        };
await ordersController.createOrder(req, res);
    
        // проверки
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Не указан способ оплаты или адрес доставки'
            }); 
  });
  test('Счастливый 201', async () =>{
    const req = {
      body: {
        payment_method_id: 1,
        delivery_address: 'Тестовый адрес'
      },
      user: {
        id: 1
      }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
        };
    OrdersModel.createOrder.mockResolvedValue({ id: 100, total_amount: 101500, items: [] });
    await ordersController.createOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Заказ успешно создан',
            data: { id: 100, total_amount: 101500, items: [] }
            });       
  });
    test('Если корзина пуста, то 400', async () =>{
    const req = {
      body: {
        payment_method_id: 1,
        delivery_address: 'Тестовый адрес'
      },
      user: {
        id: 1
      }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
        };
     OrdersModel.createOrder.mockRejectedValue(
    new Error('Корзина пуста')
  );
    await ordersController.createOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
    success: false,
    message: 'Корзина пуста'
  });    
  });
  test('Недостаточно товара, то 400', async () =>{
    const req = {
      body: {
        payment_method_id: 1,
        delivery_address: 'Тестовый адрес'
      },
      user: {
        id: 1
      }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
        };
    OrdersModel.createOrder.mockRejectedValue(
      new Error('Недостаточно товара: Телефон. Доступно: 3')
    );
    await ordersController.createOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Недостаточно товара: Телефон. Доступно: 3'
    });    
  });
  test('Неверный способ оплаты 400', async () =>{
    const req = {
      body: {
        payment_method_id: 1,
        delivery_address: 'Тестовый адрес'
      },
      user: {
        id: 1
      }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
        };
    OrdersModel.createOrder.mockRejectedValue(
      new Error('Неверный способ оплаты')
    );
    await ordersController.createOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Неверный способ оплаты'
    });    
  });
  test('Если любая другая ошибка, то 500', async () =>{
    const req = {
      body: {
        payment_method_id: 1,
        delivery_address: 'Тестовый адрес'
      },
      user: {
        id: 1
      }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
        };
    OrdersModel.createOrder.mockRejectedValue(
      new Error('DB connection lost')
    );
    await ordersController.createOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Ошибка создания заказа',
      error: 'DB connection lost'
    });    
  });  
});