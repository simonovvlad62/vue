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
      <p v-if="serverStatus">🔗 {{ serverStatus }}</p>
    </div>

    <!-- Модальные окна -->
    <!-- Модальное окно для добавления -->
    <div class="modal fade" id="addModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Добавить запись в {{ currentTable }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form>
              <div v-for="field in getTableFields(currentTable)" :key="field" class="mb-3">
                <label :for="field" class="form-label">{{ field }}</label>
                <input 
                  :type="getInputType(field)" 
                  class="form-control" 
                  :id="field"
                  v-model="newRecord[field]"
                  :placeholder="`Введите ${field}`"
                >
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="button" class="btn btn-success" @click="addRecord">Добавить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для редактирования -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Редактировать запись в {{ currentTable }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form>
              <div v-for="field in getTableFields(currentTable)" :key="field" class="mb-3">
                <label :for="'edit_' + field" class="form-label">{{ field }}</label>
                <input 
                  :type="getInputType(field)" 
                  class="form-control" 
                  :id="'edit_' + field"
                  v-model="editRecord[field]"
                  :readonly="isPrimaryKey(field)"
                >
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="button" class="btn btn-primary" @click="updateRecord">Обновить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для удаления -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Удалить запись</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Вы уверены, что хотите удалить эту запись?</p>
            <div v-if="selectedRecord" class="alert alert-warning">
              <strong>ID:</strong> {{ getRecordId(selectedRecord) }}<br>
              <strong>Данные:</strong> {{ JSON.stringify(selectedRecord) }}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="button" class="btn btn-danger" @click="deleteRecord">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Все 6 таблиц из базы данных -->
    <div v-if="showData" class="data-container mt-4">
      
      <!-- 1. ЗАКАЗЫ -->
      <div class="card mb-4">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5>📦 Заказы ({{ orders.length }})</h5>
          <div>
            <button class="btn btn-sm btn-success me-1" @click="openAddModal('orders')">➕ Добавить</button>
            <button class="btn btn-sm btn-warning me-1" @click="openEditModal('orders')">✏️ Обновить</button>
            <button class="btn btn-sm btn-danger" @click="openDeleteModal('orders')">🗑️ Удалить</button>
          </div>
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
              <tr v-for="order in orders" :key="order.номер_заказа" @click="selectRecord('orders', order)" :class="{'table-active': isSelected('orders', order)}">
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
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5>👥 Клиенты ({{ clients.length }})</h5>
          <div>
            <button class="btn btn-sm btn-success me-1" @click="openAddModal('clients')">➕ Добавить</button>
            <button class="btn btn-sm btn-warning me-1" @click="openEditModal('clients')">✏️ Обновить</button>
            <button class="btn btn-sm btn-danger" @click="openDeleteModal('clients')">🗑️ Удалить</button>
          </div>
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
              <tr v-for="client in clients" :key="client.id_клиента" @click="selectRecord('clients', client)" :class="{'table-active': isSelected('clients', client)}">
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
        <div class="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
          <h5>👨‍💼 Сотрудники ({{ employees.length }})</h5>
          <div>
            <button class="btn btn-sm btn-success me-1" @click="openAddModal('employees')">➕ Добавить</button>
            <button class="btn btn-sm btn-warning me-1" @click="openEditModal('employees')">✏️ Обновить</button>
            <button class="btn btn-sm btn-danger" @click="openDeleteModal('employees')">🗑️ Удалить</button>
          </div>
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
              <tr v-for="employee in employees" :key="employee.паспортные_данные" @click="selectRecord('employees', employee)" :class="{'table-active': isSelected('employees', employee)}">
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
        <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h5>💻 Компьютеры ({{ computers.length }})</h5>
          <div>
            <button class="btn btn-sm btn-success me-1" @click="openAddModal('computers')">➕ Добавить</button>
            <button class="btn btn-sm btn-warning me-1" @click="openEditModal('computers')">✏️ Обновить</button>
            <button class="btn btn-sm btn-danger" @click="openDeleteModal('computers')">🗑️ Удалить</button>
          </div>
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
              <tr v-for="computer in computers" :key="computer.номер_компьютера" @click="selectRecord('computers', computer)" :class="{'table-active': isSelected('computers', computer)}">
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
        <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
          <h5>🔧 Услуги ({{ services.length }})</h5>
          <div>
            <button class="btn btn-sm btn-success me-1" @click="openAddModal('services')">➕ Добавить</button>
            <button class="btn btn-sm btn-warning me-1" @click="openEditModal('services')">✏️ Обновить</button>
            <button class="btn btn-sm btn-danger" @click="openDeleteModal('services')">🗑️ Удалить</button>
          </div>
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
              <tr v-for="service in services" :key="service.номер_услуги" @click="selectRecord('services', service)" :class="{'table-active': isSelected('services', service)}">
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
        <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
          <h5>🛒 Товары ({{ products.length }})</h5>
          <div>
            <button class="btn btn-sm btn-success me-1" @click="openAddModal('products')">➕ Добавить</button>
            <button class="btn btn-sm btn-warning me-1" @click="openEditModal('products')">✏️ Обновить</button>
            <button class="btn btn-sm btn-danger" @click="openDeleteModal('products')">🗑️ Удалить</button>
          </div>
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
              <tr v-for="product in products" :key="product.номер_товара" @click="selectRecord('products', product)" :class="{'table-active': isSelected('products', product)}">
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
import { Modal } from 'bootstrap'

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
      stats: null,
      serverStatus: '',
      // CRUD данные
      currentTable: '',
      selectedRecord: null,
      newRecord: {},
      editRecord: {},
      selectedTableData: {
        orders: null,
        clients: null,
        employees: null,
        computers: null,
        services: null,
        products: null
      }
    }
  },
  computed: {
    totalOrdersCost() {
      return this.orders.reduce((sum, order) => sum + (order.стоимость_заказа || 0), 0);
    }
  },
  mounted() {
    this.loadStats();
    // Инициализация модальных окон Bootstrap
    this.addModal = new Modal(document.getElementById('addModal'));
    this.editModal = new Modal(document.getElementById('editModal'));
    this.deleteModal = new Modal(document.getElementById('deleteModal'));
    
    // Проверка подключения к серверу
    this.checkServerConnection();
  },
  watch: {
    showData(newVal) {
      if (newVal) {
        this.loadAllData();
      }
    }
  },
  methods: {
    // CRUD методы
    openAddModal(table) {
      this.currentTable = table;
      this.newRecord = {};
      this.addModal.show();
    },

    openEditModal(table) {
      if (!this.selectedTableData[table]) {
        alert('Сначала выберите запись для редактирования!');
        return;
      }
      this.currentTable = table;
      this.editRecord = { ...this.selectedTableData[table] };
      this.editModal.show();
    },

    openDeleteModal(table) {
      if (!this.selectedTableData[table]) {
        alert('Сначала выберите запись для удаления!');
        return;
      }
      this.currentTable = table;
      this.selectedRecord = this.selectedTableData[table];
      this.deleteModal.show();
    },

    selectRecord(table, record) {
      this.selectedTableData[table] = record;
      this.selectedRecord = record;
    },

    isSelected(table, record) {
      return this.selectedTableData[table] === record;
    },

    getTableFields(table) {
      const fieldsMap = {
        orders: ['номер_заказа', 'id_клиента', 'вид_заказа', 'номер_компьютера', 'номер_услуги', 'номер_товара', 'стоимость_заказа', 'тип_оплаты', 'дата_заказа'],
        clients: ['id_клиента', 'фио', 'адрес_доставки'],
        employees: ['фио', 'должность', 'стаж_работы', 'зп', 'паспортные_данные'],
        computers: ['номер_компьютера', 'тип_компьютера', 'производительность_fps', 'цена', 'видеокарта', 'процессор', 'мат_плата', 'оперативная_память', 'ssd_накопитель', 'бп', 'корпус'],
        services: ['номер_услуги', 'тип_услуги', 'название_услуги', 'стоимость_услуги'],
        products: ['номер_товара', 'вид_товара', 'название_товара', 'стоимость_товара']
      };
      return fieldsMap[table] || [];
    },

    getInputType(field) {
      if (field.includes('стоимость') || field.includes('цена') || field.includes('зп')) return 'number';
      if (field.includes('дата')) return 'date';
      return 'text';
    },

    isPrimaryKey(field) {
      const primaryKeys = {
        orders: ['номер_заказа'],
        clients: ['id_клиента'],
        employees: ['паспортные_данные'],
        computers: ['номер_компьютера'],
        services: ['номер_услуги'],
        products: ['номер_товара']
      };
      return primaryKeys[this.currentTable]?.includes(field) || false;
    },

    getRecordId(record) {
      const idFields = {
        orders: 'номер_заказа',
        clients: 'id_клиента',
        employees: 'паспортные_данные',
        computers: 'номер_компьютера',
        services: 'номер_услуги',
        products: 'номер_товара'
      };
      return record[idFields[this.currentTable]];
    },

    async addRecord() {
      try {
        console.log('📝 Добавляем запись в таблицу:', this.currentTable);
        console.log('📊 Данные для добавления:', this.newRecord);
        
        // Преобразуем пустые строки в null для числовых полей
        const processedData = this.processDataForDB(this.newRecord);
        
        const response = await fetch(`http://localhost:3002/api/${this.currentTable}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(processedData)
        });
        
        const result = await response.json();
        console.log('📨 Ответ сервера:', result);
        
        if (response.ok) {
          this.addModal.hide();
          await this.loadAllData();
          alert('✅ Запись успешно добавлена!');
        } else {
          alert(`❌ Ошибка при добавлении записи: ${result.error}`);
        }
      } catch (error) {
        console.error('💥 Ошибка:', error);
        alert('❌ Ошибка при добавлении записи: ' + error.message);
      }
    },

    async updateRecord() {
      try {
        console.log('✏️ Обновляем запись в таблицу:', this.currentTable);
        console.log('📊 Данные для обновления:', this.editRecord);
        
        const recordId = this.getRecordId(this.editRecord);
        const processedData = this.processDataForDB(this.editRecord);
        
        const response = await fetch(`http://localhost:3002/api/${this.currentTable}/${recordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(processedData)
        });
        
        const result = await response.json();
        console.log('📨 Ответ сервера:', result);
        
        if (response.ok) {
          this.editModal.hide();
          await this.loadAllData();
          alert('✅ Запись успешно обновлена!');
        } else {
          alert(`❌ Ошибка при обновлении записи: ${result.error}`);
        }
      } catch (error) {
        console.error('💥 Ошибка:', error);
        alert('❌ Ошибка при обновлении записи: ' + error.message);
      }
    },

    async deleteRecord() {
      try {
        console.log('🗑️ Удаляем запись из таблицы:', this.currentTable);
        console.log('📊 Запись для удаления:', this.selectedRecord);
        
        const recordId = this.getRecordId(this.selectedRecord);
        
        const response = await fetch(`http://localhost:3002/api/${this.currentTable}/${recordId}`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        console.log('📨 Ответ сервера:', result);
        
        if (response.ok) {
          this.deleteModal.hide();
          await this.loadAllData();
          alert('✅ Запись успешно удалена!');
        } else {
          alert(`❌ Ошибка при удалении записи: ${result.error}`);
        }
      } catch (error) {
        console.error('💥 Ошибка:', error);
        alert('❌ Ошибка при удалении записи: ' + error.message);
      }
    },

    // Вспомогательный метод для обработки данных
    processDataForDB(data) {
      const processed = { ...data };
      
      // Преобразуем пустые строки в null для числовых полей
      Object.keys(processed).forEach(key => {
        if (processed[key] === '' && this.isNumericField(key)) {
          processed[key] = null;
        }
      });
      
      return processed;
    },

    // Проверяем, является ли поле числовым
    isNumericField(field) {
      const numericFields = [
        'номер_заказа', 'id_клиента', 'номер_компьютера', 'номер_услуги', 'номер_товара',
        'стоимость_заказа', 'зп', 'производительность_fps', 'цена', 'стоимость_услуги',
        'стоимость_товара', 'паспортные_данные'
      ];
      return numericFields.includes(field);
    },

    // Новый метод для проверки подключения
    async checkServerConnection() {
      try {
        const response = await fetch('http://localhost:3002/api/clients');
        if (response.ok) {
          this.serverStatus = '✅ Подключение к серверу установлено';
          console.log('✅ Подключение к серверу установлено');
        } else {
          this.serverStatus = '❌ Сервер недоступен';
          console.error('❌ Сервер недоступен');
        }
      } catch (error) {
        this.serverStatus = '❌ Ошибка подключения к серверу';
        console.error('❌ Ошибка подключения к серверу:', error);
      }
    },

    // Остальные методы
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
      } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
      }
    },

    async loadStats() {
      try {
        const response = await fetch('http://localhost:3002/api/clients');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        this.stats = { clientsCount: data.data?.length || 0 };
      } catch (error) {
        console.error('❌ Ошибка загрузки статистики:', error);
      }
    },

    async loadOrders() {
      try {
        const response = await fetch('http://localhost:3002/api/orders');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        this.orders = data.data || [];
        console.log('✅ Заказы загружены:', this.orders.length);
      } catch (error) {
        console.error('❌ Ошибка загрузки заказов:', error);
      }
    },

    async loadClients() {
      try {
        const response = await fetch('http://localhost:3002/api/clients');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        this.clients = data.data || [];
        console.log('✅ Клиенты загружены:', this.clients.length);
      } catch (error) {
        console.error('❌ Ошибка загрузки клиентов:', error);
      }
    },

    async loadComputers() {
      try {
        const response = await fetch('http://localhost:3002/api/computers');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        this.computers = data.data || [];
        console.log('✅ Компьютеры загружены:', this.computers.length);
      } catch (error) {
        console.error('❌ Ошибка загрузки компьютеров:', error);
      }
    },

    async loadEmployees() {
      try {
        const response = await fetch('http://localhost:3002/api/employees');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        this.employees = data.data || [];
        console.log('✅ Сотрудники загружены:', this.employees.length);
      } catch (error) {
        console.error('❌ Ошибка загрузки сотрудников:', error);
      }
    },

    async loadServices() {
      try {
        const response = await fetch('http://localhost:3002/api/services');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        this.services = data.data || [];
        console.log('✅ Услуги загружены:', this.services.length);
      } catch (error) {
        console.error('❌ Ошибка загрузки услуг:', error);
      }
    },

    async loadProducts() {
      try {
        const response = await fetch('http://localhost:3002/api/products');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        this.products = data.data || [];
        console.log('✅ Товары загружены:', this.products.length);
      } catch (error) {
        console.error('❌ Ошибка загрузки товаров:', error);
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
.table-hover tbody tr:hover { background-color: rgba(0,0,0,0.075); cursor: pointer; }

/* Блок кнопки показа данных из бд */
.grbtn2here {margin-top: 70px;} 

.btn-success {width: 185px;}

/* Стили для выбранной строки */
.table-active { background-color: #0d6efd !important; color: white; }
</style>