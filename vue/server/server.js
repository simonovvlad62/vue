import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Подключаем базу данных
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Ошибка подключения к БД:', err.message);
  } else {
    console.log('✅ Подключен к SQLite базе данных');
    
    // Проверим таблицы при запуске
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (err) {
        console.error('❌ Ошибка проверки таблиц:', err);
      } else {
        console.log('📊 Таблицы в базе:', tables.map(t => t.name).join(', '));
        
        // Проверим количество записей в каждой таблице
        tables.forEach(table => {
          db.get(`SELECT COUNT(*) as count FROM ${table.name}`, (err, row) => {
            if (!err) {
              console.log(`   ${table.name}: ${row.count} записей`);
            }
          });
        });
      }
    });
  }
});

// API Routes

// Получить все заказы
app.get('/api/orders', (req, res) => {
  const sql = `SELECT * FROM заказы`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка заказов:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('📦 API /orders: возвращено', rows.length, 'записей');
    res.json({ data: rows });
  });
});

// Получить всех клиентов
app.get('/api/clients', (req, res) => {
  const sql = `SELECT * FROM клиенты`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка клиентов:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('👥 API /clients: возвращено', rows.length, 'записей');
    res.json({ data: rows });
  });
});

// Получить все компьютеры
app.get('/api/computers', (req, res) => {
  const sql = `SELECT * FROM компьютер`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка компьютеров:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('💻 API /computers: возвращено', rows.length, 'записей');
    res.json({ data: rows });
  });
});

// Получить всех сотрудников
app.get('/api/employees', (req, res) => {
  const sql = `SELECT * FROM сотрудники`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка сотрудников:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('👨‍💼 API /employees: возвращено', rows.length, 'записей');
    res.json({ data: rows });
  });
});

// Получить все услуги
app.get('/api/services', (req, res) => {
  const sql = `SELECT * FROM услуги`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка услуг:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('🔧 API /services: возвращено', rows.length, 'записей');
    res.json({ data: rows });
  });
});

// Получить все товары
app.get('/api/products', (req, res) => {
  const sql = `SELECT * FROM товары`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка товаров:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('🛒 API /products: возвращено', rows.length, 'записей');
    res.json({ data: rows });
  });
});

// Получить статистику
app.get('/api/stats', (req, res) => {
  const queries = {
    totalOrders: 'SELECT COUNT(*) as count FROM заказы',
    totalRevenue: 'SELECT SUM(стоимость_заказа) as total FROM заказы',
    totalClients: 'SELECT COUNT(*) as count FROM клиенты',
    totalEmployees: 'SELECT COUNT(*) as count FROM сотрудники'
  };

  const results = {};
  let completed = 0;

  Object.keys(queries).forEach(key => {
    db.get(queries[key], [], (err, row) => {
      if (err) {
        console.error(`❌ Ошибка статистики ${key}:`, err.message);
        results[key] = 0;
      } else {
        results[key] = row.count || row.total || 0;
      }
      completed++;
      if (completed === Object.keys(queries).length) {
        console.log('📊 Статистика:', results);
        res.json(results);
      }
    });
  });
});

// Тестовый endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Сервер работает!', 
    timestamp: new Date(),
    endpoints: [
      '/api/orders',
      '/api/clients', 
      '/api/computers',
      '/api/employees',
      '/api/services',
      '/api/products',
      '/api/stats'
    ]
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📡 Доступные endpoints:`);
  console.log(`   http://localhost:${PORT}/api/orders`);
  console.log(`   http://localhost:${PORT}/api/clients`);
  console.log(`   http://localhost:${PORT}/api/computers`);
  console.log(`   http://localhost:${PORT}/api/employees`);
  console.log(`   http://localhost:${PORT}/api/services`);
  console.log(`   http://localhost:${PORT}/api/products`);
  console.log(`   http://localhost:${PORT}/api/stats`);
  console.log(`   http://localhost:${PORT}/api/test`);
});