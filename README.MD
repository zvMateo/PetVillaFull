# 🐾 PetVilla - Plataforma de Servicios Veterinarios

[![React](https://img.shields.io/badge/React-19.2+-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0+-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1+-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7.2+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Plataforma Full Stack que conecta dueños de mascotas con servicios veterinarios certificados. Construida con React 19+, NestJS 11+, TypeScript y arquitectura enterprise.**

## 📋 Tabla de Contenidos

- [🎯 Overview](#-overview)
- [🚀 Características](#-características)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Arquitectura](#-arquitectura)
- [🖼️ Screenshots](#️-screenshots)
- [⚙️ Configuración](#️-configuración)
- [🔧 Instalación](#-instalación)
- [🚀 Ejecución](#-ejecución)
- [📚 Documentación](#-documentación)
- [🔐 Autenticación](#-autenticación)
- [📊 Base de Datos](#-base-de-datos)
- [🧪 Testing](#-testing)
- [🚀 Despliegue](#-despliegue)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

## 🎯 Overview

PetVilla es una plataforma completa de servicios veterinarios que permite a los dueños de mascotas buscar, comparar y agendar servicios con veterinarios certificados. La plataforma incluye un **frontend moderno** con React 19+ y un **backend robusto** con NestJS 11+, siguiendo principios de **Clean Architecture** y **SOLID**.

### 🏆 Puntos Clave

- **🎨 Frontend Moderno** con React 19+, TypeScript y Tailwind CSS
- **🖥️ Backend Enterprise** con NestJS 11+ y PostgreSQL
- **🗺️ Geolocalización** avanzada con PostGIS y Google Maps
- **🔐 JWT Authentication** con role-based access control
- **📱 Responsive Design** optimizado para todos los dispositivos
- **🚀 Performance** optimizada con code splitting y caching
- **🛡️ Seguridad** robusta con validación y rate limiting
- **📚 API RESTful** completamente documentada con Swagger

## 🚀 Características

### 👥 Gestión de Usuarios y Roles

- **🔐 Sistema de Autenticación** con JWT y refresh tokens
- **👤 Múltiples Roles**: CONSUMER, VET_INDIVIDUAL, CLINIC_ADMIN, CLINIC_EMPLOYEE
- **📋 Perfiles Detallados** para cada tipo de usuario
- **🖼️ Gestión de Avatares** y fotos de perfil
- **🔒 Control de Acceso** granular por permisos

### 🐾 Gestión de Mascotas

- **📋 Registro Completo** de mascotas con información médica
- **🏥 Historial Clínico** y vacunas
- **📸 Fotos de Mascotas** con galería
- **📊 Seguimiento de Salud** y recordatorios
- **🔍 Búsqueda Avanzada** por especie, raza, edad

### 📅 Sistema de Citas

- **📆 Calendario Interactivo** con disponibilidad en tiempo real
- **⏰ Recordatorios Automáticos** por email y notificaciones
- **📋 Estados de Cita**: PENDING, CONFIRMED, COMPLETED, CANCELLED
- **💰 Pagos Integrados** y confirmación automática
- **🗺️ Ubicación** y direcciones para servicios a domicilio

### 🏥 Directorio de Servicios

- **🔍 Búsqueda Geográfica** con filtros avanzados
- **⭐ Sistema de Reviews** y calificaciones
- **📊 Comparación de Precios** y servicios
- **🗺️ Mapa Interactivo** con Google Maps
- **📱 Perfiles Detallados** de veterinarios y clínicas

### 🎮 Programa de Lealtad

- **🎯 Sistema de Puntos** por servicios completados
- **🏆 Recompensas** y beneficios exclusivos
- **📊 Ledger Completo** de transacciones
- **🎓 Niveles de Lealtad** con beneficios progresivos
- **📈 Gamificación** para engagement

### 📊 Dashboard y Analytics

- **📈 Estadísticas** de uso y rendimiento
- **📊 Reports** para veterinarios y clínicas
- **📱 Mobile-First** responsive design
- **🎨 UI/UX Moderna** con animaciones fluidas
- **♿ Accesibilidad** WCAG 2.1 compliant

## 🛠️ Tech Stack

### 🎨 Frontend (React + TypeScript)

- **React 19.2+** - UI library con Concurrent Features
- **TypeScript 5.9+** - Tipado estático estricto
- **Vite 7.2+** - Build tool ultra-rápido
- **Tailwind CSS 4.1+** - Utility-first CSS framework
- **shadcn/ui** - Component library con Radix UI
- **React Router** - Client-side routing
- **Zustand** - State management ligero
- **TanStack Query** - Server state y caching
- **React Hook Form** - Forms con Zod validation
- **@vis.gl/react-google-maps** - Google Maps integration
- **Axios** - HTTP client con interceptors
- **Lucide React** - Icon library

### 🖥️ Backend (NestJS + TypeScript)

- **NestJS 11.0+** - Framework Node.js enterprise
- **TypeScript 5.7+** - Tipado estático estricto
- **Prisma 6.19+** - ORM moderno y type-safe
- **PostgreSQL 15+** - Base de datos relacional
- **PostGIS 3.4+** - Extension geográfica
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Swagger/OpenAPI 3.0** - API documentation
- **class-validator** - Input validation
- **Jest** - Testing framework

### 🗄️ Base de Datos

- **PostgreSQL 15+** - Base de datos principal
- **PostGIS 3.4+** - Extension para geolocalización
- **Prisma Migrations** - Schema management
- **Connection Pooling** - Performance optimization
- **Spatial Indexes** - Búsquedas geográficas rápidas

### 🛠️ DevOps & Tools

- **ESLint** - Code quality y linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Unit & integration testing
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline

## 📁 Arquitectura

```
pet-villa/
├── 📂 Frontend-PetVilla/           # React Frontend
│   ├── 📂 public/                 # Static assets
│   ├── 📂 src/
│   │   ├── 📂 components/         # Reusable UI components
│   │   │   ├── 📂 ui/            # shadcn/ui components
│   │   │   ├── 📂 forms/         # Form components
│   │   │   └── 📂 layout/        # Layout components
│   │   ├── 📂 pages/             # Route components
│   │   ├── 📂 hooks/             # Custom React hooks
│   │   ├── 📂 stores/            # Zustand state management
│   │   ├── 📂 services/          # API services
│   │   ├── 📂 utils/             # Utility functions
│   │   ├── 📂 types/             # TypeScript types
│   │   ├── 📂 constants/         # App constants
│   │   ├── 📂 assets/            # Images and assets
│   │   └── 📂 styles/            # Global styles
│   ├── 📄 package.json           # Dependencies
│   ├── 📄 vite.config.ts         # Vite configuration
│   └── 📄 README.md              # Frontend documentation
└── 📂 pet-villa-api/              # NestJS Backend
    ├── 📂 src/
    │   ├── 📂 common/            # Shared utilities
    │   │   ├── 📂 decorators/     # Custom decorators
    │   │   ├── 📂 guards/        # Auth & role guards
    │   │   ├── 📂 interceptors/   # Response transformation
    │   │   ├── 📂 filters/        # Exception handling
    │   │   ├── 📂 dto/            # Data transfer objects
    │   │   ├── 📂 constants/      # App constants
    │   │   └── 📂 pipes/          # Data transformation pipes
    │   ├── 📂 auth/               # Authentication module
    │   ├── 📂 users/              # User management
    │   ├── 📂 pets/               # Pet management
    │   ├── 📂 appointments/        # Appointment system
    │   ├── 📂 services/           # Service catalog
    │   ├── 📂 reviews/            # Review system
    │   ├── 📂 points/             # Loyalty program
    │   ├── 📂 profiles/           # Profile management
    │   ├── 📂 geo/                # Geolocation services
    │   ├── 📂 availability/       # Scheduling system
    │   └── 📂 prisma/             # Prisma client
    ├── 📂 prisma/                 # Database schema
    │   ├── 📄 schema.prisma       # Database schema
    │   ├── 📄 migrations/        # Database migrations
    │   └── 📄 seed.ts             # Seed data
    ├── 📄 package.json           # Dependencies
    ├── 📄 main.ts                # Application bootstrap
    └── 📄 README.md              # Backend documentation
```

### 🏗️ Principios de Diseño

#### **Frontend Architecture**

- **Component-Based** - Componentes reutilizables y tipados
- **State Management** - Zustand para estado global, React Query para server state
- **Code Splitting** - Lazy loading y bundle optimization
- **Type Safety** - TypeScript estricto en todo el frontend
- **Responsive Design** - Mobile-first con Tailwind CSS

#### **Backend Architecture**

- **Clean Architecture** - Separación de responsabilidades clara
- **SOLID Principles** - Código mantenible y escalable
- **Dependency Injection** - Desacoplamiento de componentes
- **Type Safety** - TypeScript estricto en toda la aplicación
- **Error Handling** - Centralizado y estructurado

## 🖼️ Screenshots

### 📱 Mobile Views

_Coming soon - Mobile responsive design optimized for pet owners on the go_

### 🖥️ Desktop Views

_Coming soon - Full-featured dashboard for veterinarians and clinic administrators_

### 🗺️ Map Interface

_Coming soon - Interactive map with geolocation-based search_

## ⚙️ Configuración

### 📋 Environment Variables

#### **Frontend (.env)**

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Application
VITE_APP_NAME=PetVilla
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Plataforma de servicios veterinarios

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=true
```

#### **Backend (.env)**

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
git clone https://github.com/your-username/pet-villa.git
cd pet-villa

# 2. Install dependencies (both frontend and backend)
cd Frontend-PetVilla && pnpm install
cd ../pet-villa-api && pnpm install

# 3. Setup backend environment
cd pet-villa-api
cp .env.example .env
# Edit .env with your configuration

# 4. Setup database
pnpm prisma migrate dev
pnpm prisma generate
pnpm run db:seed

# 5. Start backend server
pnpm run start:dev

# 6. Setup frontend environment (in new terminal)
cd ../Frontend-PetVilla
cp .env.example .env
# Edit .env with your configuration

# 7. Start frontend development server
pnpm run dev
```

### 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/docs

## 🚀 Ejecución

### 🎨 Frontend Scripts

```bash
# Development mode with hot reload
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Type checking
pnpm run type-check

# Linting
pnpm run lint
pnpm run lint:fix

# Formatting
pnpm run format
```

### 🖥️ Backend Scripts

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
# Frontend tests
pnpm run test              # Run tests
pnpm run test:watch        # Watch mode
pnpm run test:coverage     # Coverage report

# Backend tests
pnpm run test              # Run tests
pnpm run test:watch        # Watch mode
pnpm run test:cov          # Coverage report
pnpm run test:e2e          # E2E tests
```

## 📚 Documentación

### 🌐 API Documentation

La API está completamente documentada con **Swagger/OpenAPI 3.0**:

```bash
# Development server
http://localhost:3000/docs

# Production server
https://api.petvilla.com/docs
```

### 📋 API Endpoints Principales

#### **🔐 Authentication**

```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/refresh           # Refresh token
POST   /api/auth/logout            # User logout
```

#### **👥 Users & Profiles**

```
GET    /api/users/profile          # Get current user profile
PUT    /api/users/profile          # Update user profile
GET    /api/users/:id              # Get user by ID
```

#### **🐾 Pets**

```
GET    /api/pets                   # Get user's pets
POST   /api/pets                   # Create new pet
GET    /api/pets/:id               # Get pet by ID
PUT    /api/pets/:id               # Update pet
DELETE /api/pets/:id               # Delete pet
```

#### **📅 Appointments**

```
GET    /api/appointments           # Get user appointments
POST   /api/appointments           # Create appointment
GET    /api/appointments/:id       # Get appointment details
PUT    /api/appointments/:id       # Update appointment
DELETE /api/appointments/:id       # Cancel appointment
```

#### **🏥 Services & Clinics**

```
GET    /api/services               # Get available services
GET    /api/clinics                # Get clinics list
GET    /api/veterinarians          # Get veterinarians list
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

| Role                | Permissions                                     | Frontend Access                           |
| ------------------- | ----------------------------------------------- | ----------------------------------------- |
| **CONSUMER**        | Search services, book appointments, manage pets | Dashboard, pets, appointments, search     |
| **VET_INDIVIDUAL**  | Manage services, appointments, profile          | Professional dashboard, calendar, clients |
| **CLINIC_ADMIN**    | Full clinic management                          | Admin dashboard, staff, analytics         |
| **CLINIC_EMPLOYEE** | Limited clinic functions                        | Staff dashboard, appointments             |

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
- **Google Maps API** para visualización interactiva

## 🧪 Testing

### 📊 Test Structure

```
Frontend-PetVilla/
├── 📂 src/
│   └── 📂 __tests__/           # Component tests
└── 📄 vitest.config.ts        # Test configuration

pet-villa-api/
├── 📂 test/
│   ├── 📂 e2e/                # End-to-end tests
│   └── 📂 unit/               # Unit tests (in src folders)
└── 📄 jest-e2e.json          # E2E test configuration
```

### 🎯 Test Coverage Goals

- **Frontend**: 80%+ component coverage
- **Backend**: 80%+ service coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Complete user journeys

### 📝 Example Tests

#### **Frontend Component Test**

```typescript
// src/components/__tests__/PetCard.test.tsx
import { render, screen } from "@testing-library/react";
import { PetCard } from "../PetCard";

describe("PetCard", () => {
  it("renders pet information correctly", () => {
    const pet = {
      id: "1",
      name: "Buddy",
      species: "DOG",
      breed: "Golden Retriever",
      age: 3,
    };

    render(<PetCard pet={pet} />);

    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.getByText("Golden Retriever")).toBeInTheDocument();
  });
});
```

#### **Backend Service Test**

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
# Frontend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Backend Dockerfile
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
  frontend:
    build: ./Frontend-PetVilla
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./pet-villa-api
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

#### **Vercel (Frontend)**

```bash
# Deploy frontend to Vercel
cd Frontend-PetVilla
npm install -g vercel
vercel --prod
```

#### **AWS (Backend)**

- **ECS/Fargate** para containerized deployment
- **RDS PostgreSQL** con PostGIS
- **Application Load Balancer** para HTTPS
- **CloudFront** para CDN

#### **Heroku (Full Stack)**

```bash
# Deploy to Heroku
heroku create pet-villa
heroku config:set DATABASE_URL=...
git push heroku main
```

### 🔧 Production Checklist

#### **Frontend**

- [ ] **Environment variables** configuradas
- [ ] **Build optimization** activada
- [ ] **SEO optimization** implementada
- [ ] **Analytics** configurado
- [ ] **Error tracking** (Sentry)
- [ ] **Performance monitoring**

#### **Backend**

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
- **Component tests** para UI components
- **E2E tests** para flujos críticos
- **Type safety** en todo el código

### 📋 Pull Request Template

```markdown
## 🎯 Description

Brief description of changes

## 🔄 Changes Made

- [ ] Frontend changes
- [ ] Backend changes
- [ ] Database changes
- [ ] Tests added
- [ ] Documentation updated

## 🧪 Testing

- [ ] Frontend tests pass
- [ ] Backend tests pass
- [ ] Manual testing completed
- [ ] E2E tests pass

## 📝 Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 📄 Licencia

Este proyecto está licenciado bajo la **MIT License** - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **React Team** - Framework increíble y mantenible
- **NestJS Team** - Framework Node.js enterprise
- **Prisma Team** - ORM moderno y type-safe
- **Tailwind CSS Team** - Utility-first CSS framework
- **Vite Team** - Build tool ultra-rápido
- **PostgreSQL Team** - Base de datos robusta y confiable
- **TypeScript Team** - Tipado estático para JavaScript

## 📞 Contacto

- **Author**: [Tu Nombre]
- **Email**: tu-email@example.com
- **Project**: [PetVilla Platform](https://github.com/your-username/pet-villa)
- **Frontend Demo**: [Live Demo](https://pet-villa.vercel.app)
- **API Documentation**: [API Docs](https://api.petvilla.com/docs)

---

<div align="center">

**🐾 Made with ❤️ for pet lovers and veterinarians 🐾**

[![GitHub stars](https://img.shields.io/github/stars/your-username/pet-villa?style=social)](https://github.com/your-username/pet-villa)
[![GitHub forks](https://img.shields.io/github/forks/your-username/pet-villa?style=social)](https://github.com/your-username/pet-villa)
[![Twitter](https://img.shields.io/twitter/follow/your-handle?style=social)](https://twitter.com/your-handle)

</div>

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
