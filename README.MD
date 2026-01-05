# 🐾 PetVilla API

[![NestJS](https://img.shields.io/badge/NestJS-11.0+-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19+-0D34E3?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **API RESTful profesional para plataforma de servicios veterinarios con arquitectura enterprise y clean code**

## 📋 Tabla de Contenidos

- [🎯 Overview](#-overview)
- [🚀 Características](#-características)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Arquitectura](#-arquitectura)
- [⚙️ Configuración](#️-configuración)
- [🔧 Instalación](#-instalación)
- [🚀 Ejecución](#-ejecución)
- [📚 Documentación API](#-documentación-api)
- [🔐 Autenticación](#-autenticación)
- [📊 Base de Datos](#-base-de-datos)
- [🧪 Testing](#-testing)
- [🚀 Despliegue](#-despliegue)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

## 🎯 Overview

PetVilla API es el backend robusto y escalable para la plataforma de servicios veterinarios que conecta dueños de mascotas con veterinarios certificados. Construido con **NestJS 11+** y **TypeScript 5.7+**, sigue principios de **Clean Architecture** y **SOLID** para garantizar mantenibilidad y escalabilidad.

### 🏆 Puntos Clave

- **🔐 JWT Authentication** con role-based access control (RBAC)
- **📊 PostgreSQL + PostGIS** para geolocalización avanzada
- **🚀 API RESTful** completamente documentada con Swagger
- **🔧 Type Safety** con TypeScript estricto
- **📈 Performance** optimizada con caching y lazy loading
- **🛡️ Seguridad** con validación robusta y rate limiting

## 🚀 Características

### 🔐 Autenticación & Autorización

- **JWT Tokens** con refresh mechanism
- **Role-Based Access Control** (CONSUMER, VET_INDIVIDUAL, CLINIC_ADMIN, CLINIC_EMPLOYEE)
- **Password hashing** con bcrypt
- **Session management** seguro

### 👥 Gestión de Usuarios

- **Perfiles múltiples** para diferentes roles
- **Validación robusta** con class-validator
- **Profile management** con imágenes
- **Account verification** y recovery

### 🐾 Gestión de Mascotas

- **CRUD completo** para mascotas
- **Medical records** y health history
- **Species support** (DOG, CAT, BIRD, RABBIT, HAMSTER, OTHER)
- **Photo uploads** con validación

### 📅 Sistema de Citas

- **Appointment booking** con estados (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- **Calendar integration** con availability slots
- **Notifications** automáticas
- **Cancellation policies** con time limits

### 🏥 Gestión de Servicios

- **Service catalog** con pricing
- **Specialty filtering** y categorización
- **Availability management** para veterinarios
- **Service scheduling** optimizado

### ⭐ Sistema de Reviews

- **Rating system** (1-5 estrellas)
- **Comment system** con moderación
- **Review aggregation** para perfiles
- **Quality control** automático

### 🎮 Programa de Lealtad

- **Points system** por servicios completados
- **Point transactions** con ledger completo
- **Redemption rewards** y beneficios
- **Gamification** para engagement

### 🗺️ Geolocalización

- **PostGIS integration** para búsquedas geográficas
- **Distance calculations** precisas
- **Coverage areas** para veterinarios
- **Location-based search** optimizado

## 🛠️ Tech Stack

### 🎯 Core Framework

- **NestJS 11.0+** - Framework Node.js enterprise
- **TypeScript 5.7+** - Tipado estático estricto
- **Node.js 18+** - Runtime JavaScript

### 🗄️ Base de Datos & ORM

- **PostgreSQL 15+** - Base de datos relacional
- **PostGIS 3.4+** - Extension geográfica
- **Prisma 6.19+** - ORM moderno y type-safe
- **Database migrations** con Prisma

### 🔐 Seguridad & Auth

- **JWT (jsonwebtoken)** - Authentication tokens
- **bcrypt** - Password hashing
- **passport-jwt** - Strategy para JWT
- **jwks-rsa** - RSA key management

### 📚 Documentation & Validation

- **Swagger/OpenAPI 3.0** - API documentation
- **class-validator** - Input validation
- **class-transformer** - Data transformation
- **@nestjs/swagger** - Swagger integration

### 🧪 Testing & Quality

- **Jest** - Unit & integration testing
- **Supertest** - HTTP testing
- **ESLint** - Code quality
- **Prettier** - Code formatting

### 🚀 Performance & Utils

- **RxJS** - Reactive programming
- **dotenv** - Environment variables
- **date-fns** - Date utilities
- **uuid** - Unique identifiers

## 📁 Arquitectura

```
src/
├── 📂 common/                 # Shared utilities
│   ├── 📂 decorators/         # Custom decorators
│   ├── 📂 guards/            # Auth & role guards
│   ├── 📂 interceptors/      # Response transformation
│   ├── 📂 filters/           # Exception handling
│   ├── 📂 dto/               # Data transfer objects
│   ├── 📂 constants/         # App constants
│   └── 📂 pipes/             # Data transformation pipes
├── 📂 auth/                  # Authentication module
├── 📂 users/                 # User management
├── 📂 pets/                  # Pet management
├── 📂 appointments/          # Appointment system
├── 📂 services/              # Service catalog
├── 📂 reviews/               # Review system
├── 📂 points/                # Loyalty program
├── 📂 profiles/              # Profile management
├── 📂 geo/                   # Geolocation services
├── 📂 availability/          # Scheduling system
├── 📂 prisma/                # Prisma client
├── 📄 app.module.ts          # Root module
└── 📄 main.ts               # Application bootstrap
```

### 🏗️ Principios de Diseño

- **Clean Architecture** - Separación de responsabilidades
- **SOLID Principles** - Código mantenible y escalable
- **Dependency Injection** - Desacoplamiento de componentes
- **Type Safety** - TypeScript estricto en toda la aplicación
- **Error Handling** - Centralizado y estructurado
- **Logging** - Structured logging para debugging

## ⚙️ Configuración

### 📋 Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/petvilla"
DIRECT_URL="postgresql://user:password@localhost:5432/petvilla"
SHADOW_DATABASE_URL="postgresql://user:password@localhost:5432/petvilla_shadow"

# Application
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880  # 5MB

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 🗄️ Database Setup

```bash
# Install PostgreSQL with PostGIS
brew install postgresql postgis  # macOS
sudo apt-get install postgresql postgresql-contrib postgis  # Ubuntu

# Create database
createdb petvilla

# Enable PostGIS extension
psql petvilla -c "CREATE EXTENSION postgis;"
```

## 🔧 Instalación

### 📦 Prerequisites

- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **PostgreSQL 15+** - [Install PostgreSQL](https://www.postgresql.org/download/)
- **pnpm** - Package manager (recommended)

```bash
# Install pnpm
npm install -g pnpm
```

### 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/your-username/pet-villa-api.git
cd pet-villa-api

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Setup database
pnpm prisma migrate dev
pnpm prisma generate

# 5. Seed database (optional)
pnpm run db:seed

# 6. Start development server
pnpm run start:dev
```

## 🚀 Ejecución

### 🛠️ Development Scripts

```bash
# Development mode with hot reload
pnpm run start:dev

# Debug mode
pnpm run start:debug

# Build for production
pnpm run build

# Production mode
pnpm run start:prod
```

### 🧪 Testing Scripts

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:cov

# Run e2e tests
pnpm run test:e2e
```

### 📊 Database Scripts

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Reset database
pnpm prisma migrate reset

# View database in Prisma Studio
pnpm prisma studio

# Seed database with sample data
pnpm run db:seed
```

## 📚 Documentación API

### 🌐 Swagger Documentation

La API está completamente documentada con **Swagger/OpenAPI 3.0**:

```bash
# Development server
http://localhost:3000/docs

# Production server
https://api.petvilla.com/docs
```

### 📋 API Endpoints Overview

#### 🔐 Authentication

```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/refresh           # Refresh token
POST   /api/auth/logout            # User logout
POST   /api/auth/forgot-password   # Password recovery
POST   /api/auth/reset-password    # Password reset
```

#### 👥 Users

```
GET    /api/users/profile          # Get current user profile
PUT    /api/users/profile          # Update user profile
GET    /api/users/:id              # Get user by ID
PUT    /api/users/:id              # Update user (admin)
```

#### 🐾 Pets

```
GET    /api/pets                   # Get user's pets
POST   /api/pets                   # Create new pet
GET    /api/pets/:id               # Get pet by ID
PUT    /api/pets/:id               # Update pet
DELETE /api/pets/:id               # Delete pet
```

#### 📅 Appointments

```
GET    /api/appointments           # Get user appointments
POST   /api/appointments           # Create appointment
GET    /api/appointments/:id       # Get appointment details
PUT    /api/appointments/:id       # Update appointment
DELETE /api/appointments/:id       # Cancel appointment
```

#### 🏥 Services

```
GET    /api/services               # Get available services
GET    /api/services/:id           # Get service details
POST   /api/services               # Create service (vet)
PUT    /api/services/:id           # Update service (vet)
DELETE /api/services/:id           # Delete service (vet)
```

### 📄 Response Format

Todas las respuestas siguen un formato estandarizado:

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {          // For paginated responses
    "total": 100,
    "page": 1,
    "limit": 12,
    "totalPages": 9
  }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": {          // Validation errors
    "field": ["Error message"]
  }
}
```

## 🔐 Autenticación

### 🎫 JWT Token Structure

```typescript
// JWT Payload
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "CONSUMER",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### 🔑 Authorization Headers

```bash
# Include JWT token in requests
Authorization: Bearer <your-jwt-token>

# Example
curl -X GET "http://localhost:3000/api/users/profile" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 🛡️ Role-Based Access Control

| Role                | Permissions                                     | Endpoints                                             |
| ------------------- | ----------------------------------------------- | ----------------------------------------------------- |
| **CONSUMER**        | Search services, book appointments, manage pets | `/api/appointments`, `/api/pets`, `/api/services`     |
| **VET_INDIVIDUAL**  | Manage services, appointments, profile          | `/api/services`, `/api/appointments`, `/api/profiles` |
| **CLINIC_ADMIN**    | Full clinic management                          | All endpoints with clinic scope                       |
| **CLINIC_EMPLOYEE** | Limited clinic functions                        | `/api/appointments`, `/api/services` (clinic scope)   |

## 📊 Base de Datos

### 🗄️ Schema Overview

#### **Users & Authentication**

```sql
users              # Core user data
profiles           # Extended profile information
clinic_profiles    # Clinic-specific data
freelancer_profiles # Veterinarian profiles
clinic_members     # Clinic membership relationships
```

#### **Core Business**

```sql
pets               # Pet information and medical records
services           # Service catalog
appointments       # Booking system
reviews            # Rating and review system
point_transactions # Loyalty program ledger
```

#### **Supporting Data**

```sql
availability_slots # Scheduling and availability
```

### 🗺️ Geolocation Features

- **PostGIS Integration** para búsquedas geográficas
- **ST_DWithin** para búsquedas por distancia
- **ST_Distance** para cálculos precisos
- **Spatial indexes** para performance optimizada

### 📈 Performance Optimizations

- **Database indexes** estratégicos
- **Query optimization** con Prisma
- **Connection pooling** configurado
- **Read replicas** ready (configurable)

## 🧪 Testing

### 📊 Test Structure

```
test/
├── 📂 e2e/                    # End-to-end tests
├── 📂 unit/                   # Unit tests (in src folders)
└── 📄 jest-e2e.json          # E2E test configuration
```

### 🎯 Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Core business logic
- **E2E Tests**: Critical user flows
- **API Tests**: All endpoints

### 📝 Example Test

```typescript
// src/auth/auth.service.spec.ts
describe("AuthService", () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should register a new user", async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    };

    const result = await service.register(userData);
    expect(result.user.email).toBe(userData.email);
    expect(result.user.password).not.toBe(userData.password);
  });
});
```

## 🚀 Despliegue

### 🐳 Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

```yaml
# docker-compose.yml
version: "3.8"
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/petvilla
    depends_on:
      - db

  db:
    image: postgis/postgis:15-3.4
    environment:
      - POSTGRES_DB=petvilla
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### ☁️ Cloud Deployment Options

#### **AWS (Recommended)**

- **ECS/Fargate** para containerized deployment
- **RDS PostgreSQL** con PostGIS
- **Application Load Balancer** para HTTPS
- **CloudFront** para CDN
- **Route 53** para DNS

#### **Heroku**

```bash
# Deploy to Heroku
heroku create pet-villa-api
heroku config:set DATABASE_URL=...
git push heroku main
```

#### **DigitalOcean**

```bash
# Deploy to DigitalOcean App Platform
doctl apps create --spec .do/app.yaml
```

### 🔧 Production Checklist

- [ ] **Environment variables** configuradas
- [ ] **Database migrations** ejecutadas
- [ ] **SSL/TLS** configurado
- [ ] **Rate limiting** activado
- [ ] **Logging** configurado
- [ ] **Monitoring** implementado
- [ ] **Backup strategy** definida
- [ ] **Health checks** configurados

## 🤝 Contribución

### 📋 Development Guidelines

1. **Fork** el repositorio
2. **Create** una feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** tus cambios: `git commit -m 'Add amazing feature'`
4. **Push** al branch: `git push origin feature/amazing-feature`
5. **Open** un Pull Request

### 📝 Code Style

- **TypeScript strict** mode
- **ESLint** configuration
- **Prettier** formatting
- **Conventional Commits** para mensajes
- **Test coverage** mínimo 80%

### 🧪 Testing Requirements

- **Unit tests** para nueva funcionalidad
- **Integration tests** para endpoints
- **E2E tests** para flujos críticos
- **Type safety** en todo el código

### 📋 Pull Request Template

```markdown
## 🎯 Description

Brief description of changes

## 🔄 Changes Made

- [ ] Feature implementation
- [ ] Tests added
- [ ] Documentation updated

## 🧪 Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## 📝 Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 📄 Licencia

Este proyecto está licenciado bajo la **MIT License** - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **NestJS Team** - Framework increíble y bien documentado
- **Prisma Team** - ORM moderno y type-safe
- **PostgreSQL Team** - Base de datos robusta y confiable
- **TypeScript Team** - Tipado estático para JavaScript

## 📞 Contacto

- **Author**: [Tu Nombre]
- **Email**: tu-email@example.com
- **Project**: [PetVilla Platform](https://github.com/your-username/pet-villa)
- **Documentation**: [API Docs](http://localhost:3000/docs)

---

<div align="center">

**🐾 Made with ❤️ for pet lovers and veterinarians 🐾**

[![GitHub stars](https://img.shields.io/github/stars/your-username/pet-villa-api?style=social)](https://github.com/your-username/pet-villa-api)
[![GitHub forks](https://img.shields.io/github/forks/your-username/pet-villa-api?style=social)](https://github.com/your-username/pet-villa-api)

</div>
