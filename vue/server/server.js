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
  }
});

// Вспомогательная функция для построения SQL запросов
const buildInsertQuery = (table, data) => {
  const columns = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);
  return { query: `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values };
};

const buildUpdateQuery = (table, data, whereField) => {
  const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), data[whereField]];
  return { query: `UPDATE ${table} SET ${setClause} WHERE ${whereField} = ?`, values };
};

// Функция для преобразования названий таблиц
const getTableName = (apiTable) => {
  const tableMap = {
    'orders': 'заказы',
    'clients': 'клиенты', 
    'employees': 'сотрудники',
    'computers': 'компьютер',
    'services': 'услуги',
    'products': 'товары'
  };
  return tableMap[apiTable] || apiTable;
};

// Функция для преобразования имен полей (из snake_case в snake_case - БД использует snake_case!)
const convertFieldNamesToDB = (data, table) => {
  // В базе данных уже используются snake_case имена, так что просто возвращаем данные
  return data;
};

// Функция для обратного преобразования (из БД в snake_case - они уже в snake_case)
const convertFieldNamesFromDB = (data, table) => {
  // Данные уже в правильном формате snake_case
  return data;
};

// CRUD API Routes

// CREATE - Добавление записей
app.post('/api/:table', (req, res) => {
  const { table } = req.params;
  const dbTable = getTableName(table);
  let data = req.body;
  
  console.log('📥 Получены данные для добавления:', data);
  
  // Преобразуем имена полей для БД (они уже в snake_case)
  data = convertFieldNamesToDB(data, table);
  
  console.log('🔄 Данные для БД:', data);
  
  const { query, values } = buildInsertQuery(dbTable, data);
  
  console.log(`📝 INSERT запрос: ${query}`);
  console.log(`📊 Значения:`, values);
  
  db.run(query, values, function(err) {
    if (err) {
      console.error(`❌ Ошибка добавления в ${dbTable}:`, err.message);
      console.error(`❌ Запрос: ${query}`);
      res.status(400).json({ error: err.message });
    } else {
      console.log(`✅ Добавлена запись в ${dbTable}, ID:`, this.lastID);
      res.json({ success: true, id: this.lastID });
    }
  });
});

// READ - Получение записей
app.get('/api/orders', (req, res) => {
  const sql = `SELECT * FROM заказы`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка заказов:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    // Преобразуем имена полей из БД
    const convertedRows = rows.map(row => convertFieldNamesFromDB(row, 'orders'));
    res.json({ data: convertedRows });
  });
});

app.get('/api/clients', (req, res) => {
  const sql = `SELECT * FROM клиенты`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка клиентов:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    const convertedRows = rows.map(row => convertFieldNamesFromDB(row, 'clients'));
    res.json({ data: convertedRows });
  });
});

app.get('/api/computers', (req, res) => {
  const sql = `SELECT * FROM компьютер`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка компьютеров:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    const convertedRows = rows.map(row => convertFieldNamesFromDB(row, 'computers'));
    res.json({ data: convertedRows });
  });
});

app.get('/api/employees', (req, res) => {
  const sql = `SELECT * FROM сотрудники`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка сотрудников:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    const convertedRows = rows.map(row => convertFieldNamesFromDB(row, 'employees'));
    res.json({ data: convertedRows });
  });
});

app.get('/api/services', (req, res) => {
  const sql = `SELECT * FROM услуги`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка услуг:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    const convertedRows = rows.map(row => convertFieldNamesFromDB(row, 'services'));
    res.json({ data: convertedRows });
  });
});

app.get('/api/products', (req, res) => {
  const sql = `SELECT * FROM товары`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка товаров:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    const convertedRows = rows.map(row => convertFieldNamesFromDB(row, 'products'));
    res.json({ data: convertedRows });
  });
});

// UPDATE - Обновление записей
app.put('/api/:table/:id', (req, res) => {
  const { table, id } = req.params;
  const dbTable = getTableName(table);
  let data = req.body;
  
  console.log('📥 Получены данные для обновления:', data);
  
  // Преобразуем имена полей для БД
  data = convertFieldNamesToDB(data, table);
  
  // Определяем поле для WHERE в зависимости от таблицы
  const whereFields = {
    'orders': 'номер_заказа',
    'clients': 'id_клиента', 
    'employees': 'паспортные_данные',
    'computers': 'номер_компьютера',
    'services': 'номер_услуги',
    'products': 'номер_товара'
  };
  
  const whereField = whereFields[table];
  if (!whereField) {
    return res.status(400).json({ error: 'Неизвестная таблица' });
  }
  
  const { query, values } = buildUpdateQuery(dbTable, data, whereField);
  
  console.log(`📝 UPDATE запрос: ${query}`);
  console.log(`📊 Значения:`, values);
  
  db.run(query, values, function(err) {
    if (err) {
      console.error(`❌ Ошибка обновления в ${dbTable}:`, err.message);
      console.error(`❌ Запрос: ${query}`);
      res.status(400).json({ error: err.message });
    } else {
      console.log(`✅ Обновлена запись в ${dbTable}, ID:`, id);
      res.json({ success: true, changes: this.changes });
    }
  });
});

// DELETE - Удаление записей
app.delete('/api/:table/:id', (req, res) => {
  const { table, id } = req.params;
  const dbTable = getTableName(table);
  
  // Определяем поле для WHERE в зависимости от таблицы
  const whereFields = {
    'orders': 'номер_заказа',
    'clients': 'id_клиента',
    'employees': 'паспортные_данные', 
    'computers': 'номер_компьютера',
    'services': 'номер_услуги',
    'products': 'номер_товара'
  };
  
  const whereField = whereFields[table];
  if (!whereField) {
    return res.status(400).json({ error: 'Неизвестная таблица' });
  }
  
  const query = `DELETE FROM ${dbTable} WHERE ${whereField} = ?`;
  
  console.log(`📝 DELETE запрос: ${query}`);
  console.log(`🗑️ Удаляем ID:`, id);
  
  db.run(query, [id], function(err) {
    if (err) {
      console.error(`❌ Ошибка удаления из ${dbTable}:`, err.message);
      res.status(400).json({ error: err.message });
    } else {
      console.log(`✅ Удалена запись из ${dbTable}, ID:`, id);
      res.json({ success: true, changes: this.changes });
    }
  });
});

// Отладочные маршруты
app.get('/api/debug', (req, res) => {
  res.json({ 
    message: 'Сервер работает',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/debug/tables', (req, res) => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    const tableInfo = {};
    let completed = 0;
    
    if (tables.length === 0) {
      return res.json({ tables: tableInfo });
    }
    
    tables.forEach(table => {
      const tableName = table.name;
      db.all(`PRAGMA table_info(${tableName})`, [], (err, columns) => {
        if (err) {
          console.error(`❌ Ошибка получения информации о таблице ${tableName}:`, err);
        } else {
          tableInfo[tableName] = columns.map(col => ({
            name: col.name,
            type: col.type,
            notnull: col.notnull,
            pk: col.pk
          }));
        }
        
        completed++;
        if (completed === tables.length) {
          res.json({ tables: tableInfo });
        }
      });
    });
  });
});

app.get('/api/debug/columns/:table', (req, res) => {
  const { table } = req.params;
  const dbTable = getTableName(table);
  
  db.all(`PRAGMA table_info(${dbTable})`, [], (err, columns) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ 
        table: dbTable,
        columns: columns.map(col => col.name)
      });
    }
  });
});

// Обработка CORS preflight запросов
app.options('/api/:table', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});

app.options('/api/:table/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📊 Доступные маршруты:`);
  console.log(`   GET  /api/orders     - Получить все заказы`);
  console.log(`   GET  /api/clients    - Получить всех клиентов`);
  console.log(`   GET  /api/computers  - Получить все компьютеры`);
  console.log(`   GET  /api/employees  - Получить всех сотрудников`);
  console.log(`   GET  /api/services   - Получить все услуги`);
  console.log(`   GET  /api/products   - Получить все товары`);
  console.log(`   POST /api/:table     - Добавить запись`);
  console.log(`   PUT  /api/:table/:id - Обновить запись`);
  console.log(`   DELETE /api/:table/:id - Удалить запись`);
  console.log(`   GET  /api/debug      - Проверить работу сервера`);
  console.log(`   GET  /api/debug/tables - Показать структуру таблиц`);
});