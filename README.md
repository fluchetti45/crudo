# 🛍️ Crudo E-commerce

CRUDO es un E-commerce desarrollado con Angular 17 y .NET 8, utilizando una base de datos SQL Server y microservicios con Docker. Podes visitar la aplicación en [fluchetti.xyz](https://fluchetti.xyz).

## 📋 Descripción General

Crudo es una plataforma de e-commerce que ofrece una experiencia de compra al usuario y permite al administrador monitorear y modificar todas las caracteristicas de sus productos y ventas.

Podes acceder creandote una cuenta o con los siguientes usuarios:

- Cliente:

  test@test.com - Contrasenia0.

- Admin:

  user@admin.com - Contrasenia0.

### 🎯 Objetivos del Proyecto

- Proporcionar una solución e-commerce completa y lista para producción.
- Demostrar buenas prácticas en el desarrollo full-stack.
- Llevar a produccion dockerizando la aplicacion y levantando los servicios mediante docker compose en un VPS propio.
- Implementar características modernas de comercio electrónico.

## 🚀 Tecnologías Principales

- **Frontend**:
  - Angular 17
  - NgRx para gestión de estado
  - Bootstrap / Bootstrap Icons
- **Backend**:
  - .NET 8
  - Entity Framework Core
  - LINQ
- **Base de datos**: SQL Server 2022
- **Contenedores**: Docker
- **Servicios externos**:
  - Cloudinary (gestión de imágenes)
  - Mailgun (envío de emails)
  - Mailchimp (newsletter)
  - Auth0 (autenticación)

## 💡 Funcionalidades Principales

### Gestión de Productos

- Catálogo de productos con filtros y búsqueda
- Sistema de categorías
- Gestión de inventario en tiempo real
- Carga y optimización de imágenes con Cloudinary

### Carrito de Compras

- Carrito persistente
- Cálculo automático de totales
- Gestión de cantidades
- Proceso de checkout

### Usuarios y Autenticación

- Registro y login con Auth0
- Historial de pedidos

### Sistema de Pedidos

- Seguimiento de estado de pedidos
- Notificaciones por email vía Mailgun

### Marketing y Comunicación

- Newsletter con Mailchimp

### Panel de Administración

- Gestión de productos y categorías
- Control de inventario
- Análisis de ventas
- Gestión de usuarios y pedidos

## 📝 Próximas Funcionalidades

### Optimización y Rendimiento

- Optimización para dispositivos móviles
- Mejoras en el rendimiento y tiempos de carga
- Optimización de consultas a la base de datos

### Pagos y Facturación

- Integración con MercadoPago como pasarela de pagos
- Múltiples métodos de pago
- Gestión de reembolsos

### Experiencia de Usuario

- Sistema de reseñas y calificaciones
- Lista de deseos
- Comparador de productos

### Marketing y Ventas

- Sistema de cupones y descuentos
- Campañas automatizadas de email marketing

### Seguridad y Administración

- Panel de métricas y analytics
- Sistema de roles y permisos más granular
- Logs detallados de operaciones

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Git
- Docker y Docker Compose
- Node.js (para desarrollo local del frontend)
- .NET SDK 8.0 (para desarrollo local del backend)

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/fluchetti45/crudo.git
   cd crudo
   ```

2. **Configurar variables de entorno**

   - Copia el archivo de ejemplo `.env.example` a `.env`

   ```bash
   cp .env.example .env
   ```

   - Edita el archivo `.env` con tus credenciales:
     - `DB_SA_PASSWORD`: Contraseña para SQL Server
     - `DB_CONNECTION_STRING`: Cadena de conexión a la base de datos
     - `MAILGUN_API_KEY` y `MAILGUN_DOMAIN`: Credenciales de Mailgun
     - `CLOUDINARY_*`: Credenciales de Cloudinary
     - `AUTH0_*`: Configuración de Auth0
     - `MAILCHIMP_*`: Credenciales de Mailchimp

3. **Iniciar los contenedores**

   ```bash
   docker-compose up -d
   ```

4. **Verificar el estado de los servicios**
   ```bash
   docker-compose ps
   ```

### Puertos y Accesos

- Frontend: http://localhost:4200
- Backend API: http://localhost:5075
- Swagger UI: http://localhost:5075/swagger/index.html
- SQL Server: localhost,1433

### Desarrollo Local

Para desarrollo local sin Docker:

1. **Frontend**

   ```bash
   cd frontend
   npm install
   ng serve
   ```

2. **Backend**
   ```bash
   cd backend/crudo
   dotnet restore
   dotnet run
   ```
