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
    console.error('Ошибка подключения к БД:', err.message);
  } else {
    console.log('✅ Подключен к SQLite базе данных');
  }
});

// API Routes - простые версии для теста
app.get('/api/orders', (req, res) => {
  const sql = `SELECT * FROM заказы`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Ошибка заказов:', err);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('Заказы найдено:', rows.length);
    res.json({ data: rows });
  });
});

app.get('/api/clients', (req, res) => {
  const sql = `SELECT * FROM клиенты`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Ошибка клиентов:', err);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('Клиентов найдено:', rows.length);
    res.json({ data: rows });
  });
});

app.get('/api/computers', (req, res) => {
  const sql = `SELECT * FROM компьютер`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Ошибка компьютеров:', err);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('Компьютеров найдено:', rows.length);
    res.json({ data: rows });
  });
});

// Тестовый endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер работает!', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});

// Получить всех сотрудников
app.get('/api/employees', (req, res) => {
  const sql = `SELECT * FROM сотрудники`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Ошибка сотрудников:', err);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('Сотрудников найдено:', rows.length);
    res.json({ data: rows });
  });
});

// Получить все услуги
app.get('/api/services', (req, res) => {
  const sql = `SELECT * FROM услуги`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Ошибка услуг:', err);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('Услуг найдено:', rows.length);
    res.json({ data: rows });
  });
});

// Получить все товары
app.get('/api/products', (req, res) => {
  const sql = `SELECT * FROM товары`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Ошибка товаров:', err);
      res.status(400).json({ error: err.message });
      return;
    }
    console.log('Товаров найдено:', rows.length);
    res.json({ data: rows });
  });
});