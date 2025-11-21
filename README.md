# 📋 Kanban Board

Sistema de gestión de tareas tipo Kanban desarrollado con JavaScript vanilla y PHP, utilizando arquitectura MVC y una API RESTful para operaciones CRUD completas.

## 🚀 Características

- **Gestión completa de tareas**: Crear, leer, actualizar y eliminar tareas
- **Tablero Kanban**: Organización visual con 4 columnas (Some day, To do, In progress, Done)
- **Sistema de prioridades**: Tres niveles (low, medium, high)
- **Arquitectura MVC**: Código organizado y escalable
- **API RESTful**: Endpoints completos con validación de datos
- **Drag & Drop**: Funcionalidad de arrastrar y soltar tareas
- **Diseño responsive**: Adaptable a dispositivos móviles
- **Validación robusta**: Tanto en cliente como en servidor

## 📁 Estructura del Proyecto

```
/kanban-board
├── index.html                      # Página principal
├── /css
│   ├── styles.css                 # Estilos principales
│   └── responsive.css             # Estilos responsive para móviles
├── /js
│   ├── app.js                     # Inicialización de la aplicación
│   ├── kanban.js                  # Lógica del tablero Kanban
│   ├── drag-drop.js               # Funcionalidad de arrastrar y soltar
│   └── api.js                     # Clase para consumir la API
├── /php
│   ├── /config
│   │   └── database.php           # Configuración y conexión a BD
│   ├── /models
│   │   └── Task.php               # Modelo de datos de tareas
│   ├── /controllers
│   │   └── TaskController.php     # Lógica de negocio
│   └── /api
│       └── tasks.php              # Endpoints de la API RESTful
└── /sql
    └── database.sql               # Script de creación de base de datos
```

## 🏗️ Arquitectura MVC

### **Model (Modelo)** - `Task.php`
Maneja todas las operaciones de base de datos:
- Consultas SQL con prepared statements
- Validación de datos
- Constantes de estados y prioridades válidas

### **Controller (Controlador)** - `TaskController.php`
Contiene la lógica de negocio:
- Procesa las peticiones
- Coordina entre el modelo y la respuesta
- Maneja errores y validaciones

### **View (Vista)** - Frontend JS
Interfaz de usuario interactiva:
- Renderizado del tablero Kanban
- Drag & Drop
- Comunicación con la API

## 🛠️ Requisitos

- PHP 7.4 o superior
- MySQL 5.7 o superior
- Servidor web (Apache/Nginx)
- Navegador web moderno con soporte ES6+

## ⚙️ Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/kanban-board.git
cd kanban-board
```

### 2. Configurar la Base de Datos

Ejecuta el script SQL para crear la base de datos y las tablas:

```bash
mysql -u root -p < sql/database.sql
```

O importa manualmente el archivo `sql/database.sql` desde phpMyAdmin o tu gestor de BD preferido.

### 3. Configurar Credenciales

Edita el archivo `php/config/database.php` con tus credenciales de MySQL:

```php
private $host = 'localhost';
private $db = 'kanban_board';
private $user = 'tu_usuario';
private $pass = 'tu_contraseña';
```

### 4. Configurar el Servidor

**Opción A: Apache con Virtual Host**

Crea un virtual host apuntando a la carpeta del proyecto:

```apache
<VirtualHost *:80>
    ServerName kanban.local
    DocumentRoot "/ruta/a/kanban-board"
    
    <Directory "/ruta/a/kanban-board">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

**Opción B: Servidor PHP integrado (desarrollo)**

```bash
php -S localhost:8000
```

### 5. Actualizar la URL de la API

En `js/api.js`, actualiza la constante `API_URL` con tu configuración:

```javascript
const API_URL = 'http://localhost/kanban-board/php/api/tasks.php';
// O si usas el servidor integrado:
// const API_URL = 'http://localhost:8000/php/api/tasks.php';
```

### 6. Abrir la Aplicación

Accede a la aplicación en tu navegador:
```
http://localhost/kanban-board
```

## 📡 API Endpoints

### GET - Obtener todas las tareas
```http
GET /php/api/tasks.php
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "description": "Ejemplo de tarea",
    "status": "To do",
    "priority": "high",
    "created_at": "2025-11-17 10:30:00",
    "updated_at": "2025-11-17 10:30:00"
  }
]
```

### POST - Crear nueva tarea
```http
POST /php/api/tasks.php
Content-Type: application/json

{
  "description": "Nueva tarea",
  "status": "To do",
  "priority": "medium"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": 2,
  "description": "Nueva tarea",
  "status": "To do",
  "priority": "medium",
  "created_at": "2025-11-17 11:00:00"
}
```

### PUT - Actualizar tarea completa
```http
PUT /php/api/tasks.php?id=1
Content-Type: application/json

{
  "description": "Tarea actualizada",
  "status": "In progress",
  "priority": "high"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "description": "Tarea actualizada",
  "status": "In progress",
  "priority": "high",
  "created_at": "2025-11-17 10:30:00",
  "updated_at": "2025-11-17 11:15:00"
}
```

### PATCH - Actualizar campos específicos
```http
PATCH /php/api/tasks.php?id=1
Content-Type: application/json

{
  "status": "Done"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "description": "Tarea actualizada",
  "status": "Done",
  "priority": "high",
  "created_at": "2025-11-17 10:30:00",
  "updated_at": "2025-11-17 11:20:00"
}
```

### DELETE - Eliminar tarea
```http
DELETE /php/api/tasks.php?id=1
```

**Respuesta exitosa (200):**
```json
{
  "message": "Tarea eliminada correctamente",
  "id": 1
}
```

### Respuestas de Error

**400 - Bad Request:**
```json
{
  "error": "La descripción es obligatoria y debe ser un texto válido"
}
```

**404 - Not Found:**
```json
{
  "error": "Tarea no encontrada"
}
```

**500 - Internal Server Error:**
```json
{
  "error": "Error en la base de datos",
  "message": "Detalle del error"
}
```

## 💻 Uso del Cliente JavaScript

### Inicializar y obtener tareas
```javascript
// Obtener todas las tareas
try {
  const tasks = await TaskAPI.getTasks();
  console.log(tasks);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Crear una tarea
```javascript
try {
  const newTask = await TaskAPI.createTask(
    'Implementar nueva funcionalidad',
    'To do',
    'high'
  );
  console.log('Tarea creada:', newTask);
} catch (error) {
  console.error('Error al crear:', error.message);
}
```

### Actualizar una tarea
```javascript
// Actualización completa (PUT)
try {
  await TaskAPI.updateTask(
    1,
    'Tarea modificada',
    'In progress',
    'medium'
  );
} catch (error) {
  console.error('Error al actualizar:', error.message);
}

// Actualización parcial (PATCH)
try {
  await TaskAPI.patchTask(1, { status: 'Done' });
} catch (error) {
  console.error('Error al actualizar:', error.message);
}
```

### Eliminar una tarea
```javascript
try {
  await TaskAPI.deleteTask(1);
  console.log('Tarea eliminada');
} catch (error) {
  console.error('Error al eliminar:', error.message);
}
```

## 🎨 Validaciones

### Estados válidos
- `Some day` - Algún día
- `To do` - Por hacer
- `In progress` - En progreso
- `Done` - Completada

### Prioridades válidas
- `low` - Baja
- `medium` - Media
- `high` - Alta

### Restricciones
- **Descripción**: 
  - Obligatoria
  - Debe ser una cadena de texto
  - Máximo 500 caracteres
- **Estado**: 
  - Obligatorio
  - Debe ser uno de los valores válidos
- **Prioridad**: 
  - Obligatoria
  - Debe ser uno de los valores válidos

## 🔒 Seguridad

- ✅ **Prepared Statements**: Prevención de SQL injection
- ✅ **Validación de datos**: En cliente y servidor
- ✅ **Headers CORS**: Configurados para desarrollo
- ✅ **Sanitización de inputs**: Validación estricta de tipos
- ✅ **Manejo de errores**: Robusto y centralizado
- ✅ **PDO Exception Mode**: Captura automática de errores SQL

## 📱 Responsive Design

El diseño se adapta automáticamente a diferentes dispositivos:

**Móviles (< 768px):**
- Tablero Kanban en una sola columna
- Formularios en disposición vertical
- Campos de entrada a ancho completo
- Botones optimizados para touch

**Tablets y Desktop (≥ 768px):**
- Tablero Kanban en múltiples columnas
- Vista completa de todas las columnas simultáneamente
- Drag & Drop optimizado para ratón

## 🐛 Manejo de Errores

### En el Cliente (JavaScript)

```javascript
try {
  const task = await TaskAPI.createTask('Nueva tarea');
  console.log('Éxito:', task);
} catch (error) {
  // Error capturado automáticamente
  console.error('Error:', error.message);
  // Mostrar mensaje al usuario
  alert('Error: ' + error.message);
}
```

### En el Servidor (PHP)

Todos los errores son capturados y registrados:

```php
try {
    // Operación de base de datos
} catch (PDOException $e) {
    error_log('Error de BD: ' . $e->getMessage());
    // Respuesta JSON con error
} catch (Exception $e) {
    error_log('Error general: ' . $e->getMessage());
    // Respuesta JSON con error
}
```

## 🎯 Características Avanzadas

### Drag & Drop
- Arrastra tareas entre columnas
- Actualización automática del estado
- Feedback visual durante el arrastre
- Compatible con touch en móviles

### Validación en Tiempo Real
- Validación instantánea de formularios
- Mensajes de error descriptivos
- Prevención de envíos inválidos

### Timestamps Automáticos
- `created_at`: Fecha de creación
- `updated_at`: Actualización automática en cada cambio

## 🧪 Testing

### Probar la API con cURL

**GET - Obtener tareas:**
```bash
curl http://localhost/kanban-board/php/api/tasks.php
```

**POST - Crear tarea:**
```bash
curl -X POST http://localhost/kanban-board/php/api/tasks.php \
  -H "Content-Type: application/json" \
  -d '{"description":"Test task","status":"To do","priority":"medium"}'
```

**PUT - Actualizar tarea:**
```bash
curl -X PUT http://localhost/kanban-board/php/api/tasks.php?id=1 \
  -H "Content-Type: application/json" \
  -d '{"description":"Updated","status":"Done","priority":"high"}'
```

**DELETE - Eliminar tarea:**
```bash
curl -X DELETE http://localhost/kanban-board/php/api/tasks.php?id=1
```

## 📝 Notas de Desarrollo

### Base de Datos
- Motor: InnoDB (soporte de transacciones)
- Charset: UTF-8 (utf8mb4)
- Índices en: status, priority, created_at
- Timestamps automáticos

### API
- Respuestas siempre en JSON
- Códigos HTTP estándar (200, 201, 400, 404, 500)
- CORS habilitado para desarrollo
- Soporte para OPTIONS (preflight requests)

### Frontend
- JavaScript ES6+
- Sin dependencias externas
- Fetch API para peticiones
- Async/Await para operaciones asíncronas

### Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: PHP 8.3+, MySQL
- **Arquitectura**: MVC, RESTful API
- **Herramientas**: PDO, Fetch API


---

**⭐ Si este proyecto te fue útil, no olvides darle una estrella en GitHub!**
