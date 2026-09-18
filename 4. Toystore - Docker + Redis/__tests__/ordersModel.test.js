// Мокаем весь модуль db
jest.mock('../db', () => ({
  pool: {
    execute: jest.fn(),
    getConnection: jest.fn(),
  },
}));

// Импортируем модель и мокированный pool
const { pool } = require('../db');
const OrdersModel = require('../src/models/orders.model');



// ТЕСТ getUserOrders !!!
describe('OrdersModel.getUserOrders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('возвращает пустой массив, если заказов нет', async () => {
    // Мокаем первый запрос – возвращаем пустой массив
    pool.execute.mockResolvedValueOnce([[]]);

    const result = await OrdersModel.getUserOrders(1);

    expect(result).toEqual([]);
    expect(pool.execute).toHaveBeenCalledTimes(1);
    // Проверяем, что второй запрос не вызывался
    expect(pool.execute).not.toHaveBeenCalledWith(expect.stringContaining('order_items'), expect.anything());
  });

  test('возвращает заказы с товарами, если они есть', async () => {
    // Мокаем первый запрос (заказы)
    const ordersRows = [
      {
        id: 10,
        order_date: '2026-01-01',
        total_amount: '100.50',
        is_paid: 1,
        delivery_address: 'ул. Тестовая, 1',
        delivery_date: '2026-01-10',
        comment: 'Срочно',
        status_id: 2,
        status_name: 'Доставлен',
        payment_method_id: 1,
        payment_method_name: 'Карта',
        payment_method_description: 'Оплата картой',
      },
    ];
    pool.execute.mockResolvedValueOnce([ordersRows]);

    // Мокаем второй запрос (товары)
    const itemsRows = [
      {
        order_id: 10,
        product_id: 5,
        quantity: 2,
        price: '50.25',
        total: '100.50',
        product_name: 'Телефон',
        image_url: 'phone.jpg',
      },
    ];
    pool.execute.mockResolvedValueOnce([itemsRows]);

    const result = await OrdersModel.getUserOrders(1);

    expect(result).toHaveLength(1);
    const order = result[0];
    expect(order).toEqual({
      id: 10,
      order_date: '2026-01-01',
      total_amount: '100.50',
      is_paid: true, // Boolean(1) -> true
      delivery_address: 'ул. Тестовая, 1',
      delivery_date: '2026-01-10',
      comment: 'Срочно',
      status: { id: 2, name: 'Доставлен' },
      payment_method: { id: 1, name: 'Карта' },
      items: [
        {
          product_id: 5,
          name: 'Телефон',
          quantity: 2,
          price: '50.25',
          total: '100.50',
          image_url: 'phone.jpg',
        },
      ],
    });
    // Проверяем, что запросы были вызваны с правильными параметрами
    expect(pool.execute).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('from orders o'),
      [1]
    );
    expect(pool.execute).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('from order_items oi'),
      [10]
    );
  });
});

// ТЕСТ getOrderById!!!!!
describe('OrdersModel.getOrderById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('возвращает заказ, если он есть', async () => {
    const ordersRows = [
      {
        id: 10,
        order_date: '2026-01-01',
        total_amount: '100.50',
        is_paid: 1,
        delivery_address: 'ул. Тестовая, 1',
        delivery_date: '2026-01-10',
        comment: 'Срочно',
        status_id: 2,
        status_name: 'Доставлен',
        payment_method_id: 1,
        payment_method_name: 'Карта',
        payment_method_description: 'Оплата картой',
      },
    ];
    pool.execute.mockResolvedValueOnce([ordersRows]);
    pool.execute.mockResolvedValueOnce([[]]);
    const result = await OrdersModel.getOrderById(10, 1);
    expect(result).toBeTruthy();
    expect(result.id).toBe(10);
  });
    test('возвращает null, если заказ не найден', async () => {
      pool.execute.mockResolvedValueOnce([[]]); 
      const result = await OrdersModel.getOrderById(999, 1);
      expect(result).toBeNull();
  });
});

// ====== ТЕСТ createOrder !!! ====
describe('create order', ()=>{
  beforeEach(() => {
    jest.clearAllMocks();
    pool.getConnection.mockResolvedValue({
      beginTransaction: jest.fn().mockResolvedValue(),
      execute: jest.fn(),
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue(),
      release: jest.fn(),
    });
  });
test('создаёт заказ, очищает корзину, обновляет остатки', async () => {
  const cartItems = [ //Мок первого запроса - получаем корзину
    { product_id: 1, quantity: 2, name: 'Ноутбук', price: 50000 },
    { product_id: 2, quantity: 1, name: 'Мышь', price: 1500 },
  ];
  pool.execute.mockResolvedValueOnce([cartItems]);
  pool.execute.mockResolvedValueOnce([123123])
  const connection = await pool.getConnection();
connection.execute
      .mockResolvedValueOnce([[{ quantity: 10 }]]) // для проверки остатков товара 1
      .mockResolvedValueOnce([[{ quantity: 5 }]])  // для товара 2
      // Для INSERT в orders
      .mockResolvedValueOnce([{ insertId: 100 }])
      // Для INSERT в order_items (два вызова)
      .mockResolvedValueOnce()
      .mockResolvedValueOnce()
      // Для UPDATE products уменьшить остатки (два вызова)
      .mockResolvedValueOnce()
      .mockResolvedValueOnce()
      // Для DELETE из carts удалить корзину
      .mockResolvedValueOnce();
      
      // мокаем обращение к гетордерсбай айди
    const getOrderByIdSpy = jest.spyOn(OrdersModel, 'getOrderById')
      .mockResolvedValue({ id: 100, total_amount: 101500, items: [] });
 // Все замокали, наконецтаки выполняем метод     
    const orderData = {
      payment_method_id: 1,
      delivery_address: 'ул. Ленина, 5',
      delivery_date: '2026-01-20',
      comment: 'Позвонить перед доставкой',
    };
    const result = await OrdersModel.createOrder(1, orderData);



   // а теперь тестируем результат
   expect(result).toEqual({ id: 100, total_amount: 101500, items: [] });
   //Начата ли транзакция
   expect(connection.beginTransaction).toHaveBeenCalled();
     // Проверяем, что были запросы на проверку остатков
    expect(connection.execute).toHaveBeenCalledWith(
      expect.stringContaining('SELECT quantity FROM products WHERE id = ? FOR UPDATE'),
      [1]
    );
    expect(connection.execute).toHaveBeenCalledWith(
      expect.stringContaining('SELECT quantity FROM products WHERE id = ? FOR UPDATE'),
      [2]
    );
    // Проверяем вставку заказа
    expect(connection.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO orders'),
      expect.arrayContaining([1, 1, 1, 'ул. Ленина, 5', '2026-01-20', 'Позвонить перед доставкой', 101500])
    );
    // Проверяем обновление остатков
    expect(connection.execute).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE products SET quantity = quantity - ? WHERE id = ?'),
      [2, 1]
    );
    expect(connection.execute).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE products SET quantity = quantity - ? WHERE id = ?'),
      [1, 2]
    );
    // Проверяем очистку корзины
    expect(connection.execute).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM carts WHERE user_id = ?'),
      [1]
    );
    // Проверяем коммит
    expect(connection.commit).toHaveBeenCalled();
    // Проверяем, что getOrderById был вызван
    expect(getOrderByIdSpy).toHaveBeenCalledWith(100, 1);
    // Проверяем освобождение соединения
    expect(connection.release).toHaveBeenCalled();

    // Восстанавливаем шпиона
    getOrderByIdSpy.mockRestore();
  })
  // тест на пустую корзину
  test('выбрасывает ошибку, если корзина пуста', async () => {
      // Мокаем запрос корзины, возвращая пустой массив
    pool.execute.mockResolvedValueOnce([[]]);
    await expect(OrdersModel.createOrder(1, {})).rejects.toThrow('Корзина пуста');
      // Проверяем, что транзакция не начиналась
    expect(pool.getConnection).not.toHaveBeenCalled();
  });
  test('выбрасывает ошибку, если пеймент метод не валидный', async () => {
    const cartItems = [ //Мок первого запроса - получаем корзину
    { product_id: 1, quantity: 2, name: 'Ноутбук', price: 50000 }];
    pool.execute.mockResolvedValueOnce([cartItems]);
    pool.execute.mockResolvedValueOnce([[]]);
    await expect(OrdersModel.createOrder(1, {})).rejects.toThrow('Неверный способ оплаты');
      // Проверяем, что транзакция не начиналась
    expect(pool.getConnection).not.toHaveBeenCalled();
  });
  test('выбрасывает ошибку и откатывает транзакцию, если товара недостаточно', async () => {
    const cartItems = [ //Мок первого запроса - получаем корзину
    { product_id: 1, quantity: 2, name: 'Ноутбук', price: 50000 }];
    pool.execute.mockResolvedValueOnce([cartItems]);
    pool.execute.mockResolvedValueOnce([123]);
    const connection = await pool.getConnection();
    connection.execute.mockResolvedValueOnce([[{ quantity: 1 }]])
  await expect(OrdersModel.createOrder(1, {})).rejects.toThrow('Недостаточно товара: Ноутбук. Доступно: 1');
  // Проверяем, что rollback был вызван
  expect(connection.rollback).toHaveBeenCalled();
  expect(connection.commit).not.toHaveBeenCalled();
  expect(connection.release).toHaveBeenCalled();

  });
});