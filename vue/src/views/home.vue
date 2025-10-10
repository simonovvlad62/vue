<template>
  <div>

<center><div><p><h1><b>Данные HyperPC</b></h1></p></div></center>

    <div class="nav2">
      <button type="button" class="btn btn-primary">
        <router-link to="/contacts">Наши контакты</router-link>
      </button>
      <button type="button" class="btn btn-success" @click="showData = !showData">
        {{ showData ? 'Скрыть данные' : 'Показать все данные' }}
      </button>
      <button type="button" class="btn btn-danger">
        <router-link to="/login">Войти в систему</router-link>
      </button>

    </div>

    <!-- Отладочная информация -->
    <div v-if="debugInfo" class="alert alert-info mt-3">
      <h6>📊 Статус загрузки:</h6>
      <p>Заказы: {{ orders.length }} | Клиенты: {{ clients.length }} | Компьютеры: {{ computers.length }}</p>
      <p>Сотрудники: {{ employees.length }} | Услуги: {{ services.length }} | Товары: {{ products.length }}</p>
    </div>

    <!-- Все 6 таблиц из базы данных -->
    <div v-if="showData" class="data-container mt-4">
      
      <!-- 1. ЗАКАЗЫ -->
      <div class="card mb-4">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5>📦 Заказы ({{ orders.length }})</h5>
          <span class="badge bg-light text-dark">Общая стоимость: {{ totalOrdersCost }} ₽</span>
        </div>
        <div class="card-body">
          <table class="table table-striped table-bordered table-hover">
            <thead class="table-dark">
              <tr>
                <th>№ заказа</th>
                <th>ID клиента</th>
                <th>Вид заказа</th>
                <th>№ компьютера</th>
                <th>№ услуги</th>
                <th>№ товара</th>
                <th>Стоимость</th>
                <th>Тип оплаты</th>
                <th>Дата заказа</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.номер_заказа">
                <td><strong>{{ order.номер_заказа }}</strong></td>
                <td>{{ order.id_клиента }}</td>
                <td>{{ order.вид_заказа }}</td>
                <td>{{ order.номер_компьютера || '-' }}</td>
                <td>{{ order.номер_услуги || '-' }}</td>
                <td>{{ order.номер_товара || '-' }}</td>
                <td><strong class="text-success">{{ order.стоимость_заказа }} ₽</strong></td>
                <td><span class="badge" :class="order.тип_оплаты === 'Карта' ? 'bg-primary' : 'bg-warning'">{{ order.тип_оплаты }}</span></td>
                <td>{{ order.дата_заказа }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2. КЛИЕНТЫ -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5>👥 Клиенты ({{ clients.length }})</h5>
        </div>
        <div class="card-body">
          <table class="table table-striped table-hover">
            <thead class="table-primary">
              <tr>
                <th>ID клиента</th>
                <th>ФИО</th>
                <th>Адрес доставки</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in clients" :key="client.id_клиента">
                <td><strong class="text-primary">{{ client.id_клиента }}</strong></td>
                <td><strong>{{ client.фио }}</strong></td>
                <td>{{ client.адрес_доставки }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. СОТРУДНИКИ -->
      <div class="card mb-4">
        <div class="card-header bg-warning text-dark">
          <h5>👨‍💼 Сотрудники ({{ employees.length }})</h5>
        </div>
        <div class="card-body">
          <table class="table table-striped table-hover">
            <thead class="table-warning">
              <tr>
                <th>ФИО</th>
                <th>Должность</th>
                <th>Стаж работы</th>
                <th>Зарплата</th>
                <th>Паспортные данные</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in employees" :key="employee.паспортные_данные">
                <td><strong>{{ employee.фио }}</strong></td>
                <td>{{ employee.должность }}</td>
                <td><span class="badge bg-info">{{ employee.стаж_работы }}</span></td>
                <td><strong class="text-success">{{ employee.зп }} ₽</strong></td>
                <td><code>{{ employee.паспортные_данные }}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4. КОМПЬЮТЕРЫ -->
      <div class="card mb-4">
        <div class="card-header bg-success text-white">
          <h5>💻 Компьютеры ({{ computers.length }})</h5>
        </div>
        <div class="card-body">
          <table class="table table-striped table-hover">
            <thead class="table-success">
              <tr>
                <th>№ компьютера</th>
                <th>Тип</th>
                <th>Производительность</th>
                <th>Цена</th>
                <th>Видеокарта</th>
                <th>Процессор</th>
                <th>Материнская плата</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="computer in computers" :key="computer.номер_компьютера">
                <td><strong class="text-success">{{ computer.номер_компьютера }}</strong></td>
                <td><span class="badge" :class="computer.тип_компьютера === 'DESK' ? 'bg-danger' : 'bg-secondary'">{{ computer.тип_компьютера }}</span></td>
                <td>
                  <div class="progress" style="height: 20px;">
                    <div class="progress-bar" :style="{ width: getPerformancePercent(computer.производительность_fps) + '%' }">
                      {{ computer.производительность_fps }} FPS
                    </div>
                  </div>
                </td>
                <td><strong class="text-success">{{ computer.цена }} ₽</strong></td>
                <td><small>{{ computer.видеокарта }}</small></td>
                <td><small>{{ computer.процессор }}</small></td>
                <td><small>{{ computer.мат_плата }}</small></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5. УСЛУГИ -->
      <div class="card mb-4">
        <div class="card-header bg-info text-white">
          <h5>🔧 Услуги ({{ services.length }})</h5>
        </div>
        <div class="card-body">
          <table class="table table-striped table-hover">
            <thead class="table-info">
              <tr>
                <th>№ услуги</th>
                <th>Тип услуги</th>
                <th>Название услуги</th>
                <th>Стоимость</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in services" :key="service.номер_услуги">
                <td><strong class="text-info">{{ service.номер_услуги }}</strong></td>
                <td>
                  <span class="badge" :class="getServiceBadgeClass(service.тип_услуги)">
                    {{ service.тип_услуги }}
                  </span>
                </td>
                <td>{{ service.название_услуги }}</td>
                <td><strong class="text-success">{{ service.стоимость_услуги }} ₽</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 6. ТОВАРЫ -->
      <div class="card mb-4">
        <div class="card-header bg-secondary text-white">
          <h5>🛒 Товары ({{ products.length }})</h5>
        </div>
        <div class="card-body">
          <table class="table table-striped table-hover">
            <thead class="table-secondary">
              <tr>
                <th>№ товара</th>
                <th>Вид товара</th>
                <th>Название товара</th>
                <th>Стоимость</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.номер_товара">
                <td><strong class="text-secondary">{{ product.номер_товара }}</strong></td>
                <td>
                  <span class="badge" :class="getProductBadgeClass(product.вид_товара)">
                    {{ product.вид_товара }}
                  </span>
                </td>
                <td>{{ product.название_товара }}</td>
                <td><strong class="text-success">{{ product.стоимость_товара }} ₽</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

export default {
  name: 'HomePage',
  data() {
    return {
      showData: false,
      debugInfo: true,
      orders: [],
      clients: [],
      computers: [],
      employees: [],
      services: [],
      products: [],
      stats: null
    }
  },
  computed: {
    totalOrdersCost() {
      return this.orders.reduce((sum, order) => sum + (order.стоимость_заказа || 0), 0);
    }
  },
  mounted() {
    this.loadStats();
  },
  watch: {
    showData(newVal) {
      if (newVal) {
        this.loadAllData();
      }
    }
  },
  methods: {
    getPerformancePercent(fps) {
      const maxFps = 300;
      return Math.min((fps / maxFps) * 100, 100);
    },
    
    getServiceBadgeClass(serviceType) {
      const classes = {
        'Моддинг и кастомизация': 'bg-purple',
        'Тех. обслуживание': 'bg-success',
        'Апгрейд центр': 'bg-danger',
        'Тех. Обслуживание': 'bg-success'
      };
      return classes[serviceType] || 'bg-secondary';
    },
    
    getProductBadgeClass(productType) {
      const classes = {
        'Водяное охлаждение': 'bg-info',
        'Монитор': 'bg-primary',
        'Видеокарта': 'bg-warning',
        'Процессор': 'bg-danger'
      };
      return classes[productType] || 'bg-secondary';
    },

    async loadAllData() {
      try {
        console.log('🚀 Загружаем все данные...');
        await Promise.all([
          this.loadOrders(),
          this.loadClients(),
          this.loadComputers(),
          this.loadEmployees(),
          this.loadServices(),
          this.loadProducts()
        ]);
        console.log('✅ Все таблицы загружены!');
        console.log('📊 Итоги:', {
          orders: this.orders.length,
          clients: this.clients.length,
          computers: this.computers.length,
          employees: this.employees.length,
          services: this.services.length,
          products: this.products.length
        });
      } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
      }
    },

    async loadStats() {
      try {
        console.log('📊 Загружаем статистику...');
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        this.stats = await response.json();
        console.log('📊 Статистика загружена:', this.stats);
      } catch (error) {
        console.error('❌ Ошибка загрузки статистики:', error);
      }
    },

    async loadOrders() {
      try {
        console.log('📦 Загружаем заказы...');
        const response = await fetch('/api/orders');
        console.log('📦 Orders Response:', response.status, response.ok);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        console.log('📦 Orders Data:', data);
        this.orders = data.data || [];
        console.log('📦 Заказы загружены:', this.orders.length);
        
        if (this.orders.length > 0) {
          console.log('📦 Первый заказ:', this.orders[0]);
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки заказов:', error);
        this.orders = [];
      }
    },

    async loadClients() {
      try {
        console.log('👥 Загружаем клиентов...');
        const response = await fetch('/api/clients');
        console.log('👥 Clients Response:', response.status, response.ok);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        console.log('👥 Clients Data:', data);
        this.clients = data.data || [];
        console.log('👥 Клиенты загружены:', this.clients.length);
        
        if (this.clients.length > 0) {
          console.log('👥 Первый клиент:', this.clients[0]);
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки клиентов:', error);
        this.clients = [];
      }
    },

    async loadComputers() {
      try {
        console.log('💻 Загружаем компьютеры...');
        const response = await fetch('/api/computers');
        console.log('💻 Computers Response:', response.status, response.ok);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        console.log('💻 Computers Data:', data);
        this.computers = data.data || [];
        console.log('💻 Компьютеры загружены:', this.computers.length);
        
        if (this.computers.length > 0) {
          console.log('💻 Первый компьютер:', this.computers[0]);
        } else {
          console.warn('⚠️ Таблица компьютеров пустая!');
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки компьютеров:', error);
        this.computers = [];
      }
    },

    async loadEmployees() {
      try {
        console.log('👨‍💼 Загружаем сотрудников...');
        const response = await fetch('/api/employees');
        console.log('👨‍💼 Employees Response:', response.status, response.ok);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        console.log('👨‍💼 Employees Data:', data);
        this.employees = data.data || [];
        console.log('👨‍💼 Сотрудники загружены:', this.employees.length);
        
        if (this.employees.length > 0) {
          console.log('👨‍💼 Первый сотрудник:', this.employees[0]);
        } else {
          console.warn('⚠️ Таблица сотрудников пустая!');
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки сотрудников:', error);
        this.employees = [];
      }
    },

    async loadServices() {
      try {
        console.log('🔧 Загружаем услуги...');
        const response = await fetch('/api/services');
        console.log('🔧 Services Response:', response.status, response.ok);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        console.log('🔧 Services Data:', data);
        this.services = data.data || [];
        console.log('🔧 Услуги загружены:', this.services.length);
        
        if (this.services.length > 0) {
          console.log('🔧 Первая услуга:', this.services[0]);
        } else {
          console.warn('⚠️ Таблица услуг пустая!');
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки услуг:', error);
        this.services = [];
      }
    },

    async loadProducts() {
      try {
        console.log('🛒 Загружаем товары...');
        const response = await fetch('/api/products');
        console.log('🛒 Products Response:', response.status, response.ok);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        console.log('🛒 Products Data:', data);
        this.products = data.data || [];
        console.log('🛒 Товары загружены:', this.products.length);
        
        if (this.products.length > 0) {
          console.log('🛒 Первый товар:', this.products[0]);
        } else {
          console.warn('⚠️ Таблица товаров пустая!');
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки товаров:', error);
        this.products = [];
      }
    }
  }
}
</script>

<style>
.nav2 { text-align: center;}
.btn { margin: 15px; color: white; }
a { text-decoration: none; color: #ffffff; }
.stats-container { padding: 0 20px; }
.data-container { padding: 0 20px; }
.card { margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.table { margin-bottom: 0; font-size: 0.9rem; }
.card-header h5 { margin: 0; }
.bg-purple { background-color: #6f42c1 !important; }

/* Адаптивность таблиц */
.table-responsive { overflow-x: auto; }

/* Стили для прогресс-бара производительности */
.progress { background-color: #e9ecef; border-radius: 10px; }
.progress-bar { background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f); border-radius: 10px; }

/* Ховер эффекты */
.table-hover tbody tr:hover { background-color: rgba(0,0,0,0.075); }

/* Блок кнопки показа данных из бд */
.grbtn2here {margin-top: 70px;} 

</style>