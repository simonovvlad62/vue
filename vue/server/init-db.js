import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.db');

// Создаем таблицы по одной для избежания ошибок
const tablesSQL = [
  `DROP TABLE IF EXISTS заказы`,
  `DROP TABLE IF EXISTS сотрудники`,
  `DROP TABLE IF EXISTS клиенты`,
  `DROP TABLE IF EXISTS компьютер`,
  `DROP TABLE IF EXISTS услуги`,
  `DROP TABLE IF EXISTS товары`,

  `CREATE TABLE клиенты (
    фио TEXT,
    адрес_доставки TEXT,
    id_клиента INTEGER PRIMARY KEY
  )`,

  `CREATE TABLE сотрудники (
    фио TEXT,
    должность TEXT,
    стаж_работы TEXT,
    зп INTEGER,
    паспортные_данные INTEGER PRIMARY KEY
  )`,

  `CREATE TABLE компьютер (
    номер_компьютера INTEGER PRIMARY KEY,
    тип_компьютера TEXT,
    производительность_fps INTEGER,
    цена INTEGER,
    видеокарта TEXT,
    процессор TEXT,
    мат_плата TEXT,
    оперативная_память TEXT,
    ssd_накопитель TEXT,
    бп TEXT,
    корпус TEXT
  )`,

  `CREATE TABLE услуги (
    номер_услуги INTEGER PRIMARY KEY,
    тип_услуги TEXT,
    название_услуги TEXT,
    стоимость_услуги INTEGER
  )`,

  `CREATE TABLE товары (
    номер_товара INTEGER PRIMARY KEY,
    вид_товара TEXT,
    название_товара TEXT,
    стоимость_товара INTEGER
  )`,

  `CREATE TABLE заказы (
    номер_заказа INTEGER PRIMARY KEY,
    id_клиента INTEGER,
    вид_заказа TEXT,
    номер_компьютера INTEGER,
    номер_услуги INTEGER,
    номер_товара INTEGER,
    стоимость_заказа INTEGER,
    тип_оплаты TEXT,
    дата_заказа TEXT,
    FOREIGN KEY (id_клиента) REFERENCES клиенты(id_клиента),
    FOREIGN KEY (номер_компьютера) REFERENCES компьютер(номер_компьютера),
    FOREIGN KEY (номер_услуги) REFERENCES услуги(номер_услуги),
    FOREIGN KEY (номер_товара) REFERENCES товары(номер_товара)
  )`
];

// Данные для вставки
const insertSQL = [
  // Клиенты
  `INSERT INTO клиенты (фио, адрес_доставки, id_клиента) VALUES 
  ('Угвей Ч. К.', 'Рай', 105),
  ('Овечкин А. В.', 'Москва, Пушкина, д. Колотушкина', 101),
  ('Путин В. В.', 'Москва, Кремль', 103),
  ('Роналдо К.', 'Футбольное поле #1', 102),
  ('Трамп Д.', 'Вашингтон, Белый дом', 104)`,

  // Сотрудники
  `INSERT INTO сотрудники (фио, должность, стаж_работы, зп, паспортные_данные) VALUES 
  ('Тимофеев А.В.', 'кассир', '3.5 года', 45600, 4545221133),
  ('Усачев В. Ф.', 'сборщик ПК', '6 лет', 52000, 5252112233),
  ('Князев М. И.', 'уборщик', '12 лет', 23500, 2323331122),
  ('Карасев Р. Р.', 'помощник сис-админа', '3 мес', 38760, 3838223311),
  ('Шифу М.', 'сис-админ', '2 года', 89050, 8989113322)`,

  // Компьютеры
  `INSERT INTO компьютер (номер_компьютера, тип_компьютера, производительность_fps, цена, видеокарта, процессор, мат_плата, оперативная_память, ssd_накопитель, бп, корпус) VALUES 
  (57900, 'Custom', 128, 142400, 'GeForce RTX 5060', 'Intel Core i5-14200f', 'ASRock Z770', '32GB G.SKILL', '2TB', '800W', 'HYPERPC XR1'),
  (51090, 'Custom', 250, 528000, 'GeForce RTX 5080', 'Ryzen 9 9910X', 'CROSSHAIR X870E', '64GB G.SKILL', '4TB', '1000W', 'HYPERPC Z 02'),
  (51580, 'DESK', 268, 1539100, 'GeForce RTX 5090', 'Ryzen 9 9950X3D', 'CROSSHAIR X870E', '96GB G.SKILL', '4TB + 1TB', '1300W', 'HYPERPC DESK 2.0'),
  (56220, 'Custom', 168, 264000, 'GeForce RTX 5060 TI', 'Ryzen 6 7060', 'ROG 7', '64GB G.SKILL', '2TB + 1TB', '900W', 'HYPERPC XR3'),
  (55664, 'Custom', 210, 319900, 'GeForce RTX 5070S', 'Ryzen 7 7400x', 'ROG 9', '64GB G.SKILL', '2TB + 2TB', '1000W', 'HYPERPC Z 01')`,

  // Услуги
  `INSERT INTO услуги (номер_услуги, тип_услуги, название_услуги, стоимость_услуги) VALUES 
  (3018, 'Моддинг и кастомизация', 'Сборка и доставка ПК (с установкой windows)', 38900),
  (3125, 'Тех. обслуживание', 'HYPERPC SERVICE PLUS', 11500),
  (3016, 'Апгрейд центр', 'Улучшение характеристик ПК (XH3000-ultra)', 670900),
  (3218, 'Моддинг и кастомизация', 'Кастомизация корпуса под CS2', 28900),
  (3128, 'Тех. Обслуживание', 'HYPERPC SERVICE PREMIUM', 15500)`,

  // Товары
  `INSERT INTO товары (номер_товара, вид_товара, название_товара, стоимость_товара) VALUES
  (1423, 'Водяное охлаждение', 'Водяное охлажение HYPERPC X22G', 38999),
  (1271, 'Монитор', 'ASUS X322Z', 6800),
  (1520, 'Монитор', 'ASUS X218LITE', 37600),
  (12290, 'Видеокарта', 'ASUS GeForce RTX 5090', 580200),
  (17010, 'Процессор', 'Ryzen 9 9950X3D', 88800)`,

  // Заказы
  `INSERT INTO заказы (номер_заказа, id_клиента, вид_заказа, номер_компьютера, номер_услуги, номер_товара, стоимость_заказа, тип_оплаты, дата_заказа) VALUES 
  (11101, 101, 'Товар', NULL, NULL, 1423, 38999, 'При получении', '17.09.2025'),
  (11102, 102, 'Компьютер', 57900, NULL, NULL, 142400, 'Карта', '18.09.2025'),
  (11103, 103, 'Компьютер, товар', 51580, NULL, 1271, 1654700, 'Карта', '15.09.2025'),
  (11104, 104, 'Компьютер, услуги, товар', 56220, 3018, 1520, 354200, 'При получении', '16.09.2025'),
  (11105, 105, 'Услуги', NULL, 3125, NULL, 11500, 'При получении', '18.09.2025')`
];

// Выполняем SQL последовательно
function executeSQL(queries, index = 0) {
  if (index >= queries.length) {
    console.log('✅ Все таблицы созданы успешно!');
    checkData();
    return;
  }

  db.run(queries[index], function(err) {
    if (err) {
      console.error(`❌ Ошибка в запросе ${index + 1}:`, err.message);
      console.log('Запрос:', queries[index]);
    } else {
      console.log(`✓ Выполнен запрос ${index + 1}/${queries.length}`);
      executeSQL(queries, index + 1);
    }
  });
}

// Проверяем данные
function checkData() {
  console.log('\n📊 Проверяем созданные таблицы...');
  
  const tables = ['клиенты', 'сотрудники', 'компьютер', 'услуги', 'товары', 'заказы'];
  let checked = 0;
  
  tables.forEach(table => {
    db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
      if (err) {
        console.log(`❌ ${table}: ошибка - ${err.message}`);
      } else {
        console.log(`✅ ${table}: ${row.count} записей`);
      }
      checked++;
      if (checked === tables.length) {
        console.log('\n🎉 База данных готова к использованию!');
        db.close();
      }
    });
  });
}

// Запускаем процесс
console.log('🚀 Начинаем создание базы данных...');
executeSQL([...tablesSQL, ...insertSQL]);