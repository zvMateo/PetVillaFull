# 🐾 PetVilla - Frontend

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2+-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1+-38B2AC.svg)](https://tailwindcss.com/)

**Plataforma moderna de servicios veterinarios que conecta dueños de mascotas con profesionales certificados.**

## 🌟 Características Principales

- 🏥 **Búsqueda de Veterinarios** - Encuentra clínicas y veterinarios independientes cerca de ti
- 📅 **Agenda de Citas** - Sistema de reservas con confirmación instantánea
- 🗺️ **Geolocalización** - Mapa interactivo con filtros por distancia y servicios
- ⭐ **Sistema de Reseñas** - Calificaciones y comentarios verificables
- 🎯 **Programa de Lealtad** - Acumula puntos y canjea beneficios
- 📱 **Responsive Design** - Experiencia optimizada para todos los dispositivos
- 🌙 **Dark Mode** - Interfaz adaptable a preferencias del usuario

## 🛠️ Stack Tecnológico

### Core Framework

- **React 19.2+** - Biblioteca principal para UI components
- **TypeScript 5.9+** - Tipado estático y mejor desarrollo
- **Vite 7.2+** - Build tool ultra-rápido y optimizado

### Styling & UI

- **Tailwind CSS 4.1+** - Framework de utilidades CSS
- **shadcn/ui** - Componentes modernos y accesibles
- **Lucide React** - Iconos consistentes y personalizables

### State & Data Management

- **Zustand 5.0+** - Estado global minimalista
- **TanStack React Query 5.90+** - Server state y caching
- **React Hook Form 7.69+** - Forms con performance optimizada
- **Zod 4.2+** - Validación type-safe

### Routing & Navigation

- **React Router 7.1+** - Navegación declarativa y lazy loading

### HTTP & API

- **Axios 1.13+** - Cliente HTTP con interceptors
- **React Query** - Caching, sincronización y reintentos automáticos

### Maps & Geolocation

- **@vis.gl/react-google-maps 1.7+** - Integración con Google Maps
- **Geolocation API** - Ubicación del usuario en tiempo real

### Utilities & Tools

- **date-fns 4.1+** - Manipulación de fechas
- **Sonner 2.0+** - Notificaciones elegantes
- **Swiper/Embla** - Carruseles y sliders
- **clsx + tailwind-merge** - Utilidades de CSS

## 📁 Estructura del Proyecto

```
src/
├── components/          # UI components reutilizables
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── forms/          # Formularios especializados
├── pages/              # Páginas principales
├── hooks/              # Custom hooks React
├── services/           # API clients y configuración
├── stores/             # Estado global (Zustand)
├── types/              # Tipos TypeScript
├── utils/              # Utilidades y helpers
├── constants/          # Constantes de la aplicación
├── lib/                # Configuración de librerías
└── assets/             # Imágenes y recursos estáticos
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+
- npm, yarn, o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd frontend-petvilla

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
```

### Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Iniciar servidor de desarrollo

# Build
pnpm build            # Build para producción
pnpm preview          # Previsualizar build de producción

# Calidad de Código
pnpm lint             # Ejecutar ESLint
pnpm lint:fix         # Auto-corregir ESLint
```

## 🏗️ Arquitectura y Patrones

### Clean Architecture

- **Separación de responsabilidades** clara entre UI, lógica y datos
- **Dependency injection** a través de hooks y servicios
- **Type safety** en toda la aplicación

### Performance Optimizations

- **Code splitting** automático con React.lazy()
- **Tree shaking** de dependencias no utilizadas
- **Image optimization** y lazy loading
- **Bundle analysis** con chunks optimizados

### State Management

- **Zustand** para estado global simple y performante
- **React Query** para server state con caching inteligente
- **Local hooks** para estado local reutilizable

## 🎨 Design System

### Color Palette

- **Primary:** `#13ec5b` (Verde vibrante)
- **Secondary:** `#06b6d4` (Azul cyan)
- **Accent:** `#f59e0b` (Dorado)
- **Background:** `#f8fcf9` (Verde muy claro)

### Component Guidelines

- **Consistent spacing** con escala de 8px
- **Responsive-first** mobile-first approach
- **Accessibility** con ARIA labels y keyboard navigation
- **Dark mode** support con CSS variables

## 🔧 Configuración y Herramientas

### Vite Configuration

- **Path aliases** para imports limpios (`@/components`)
- **Bundle optimization** con manual chunks
- **Development proxy** para API local
- **Source maps** para debugging

### TypeScript Configuration

- **Strict mode** habilitado
- **Path mapping** para imports absolutos
- **Type checking** en tiempo de compilación

### ESLint & Prettier

- **Airbnb config** como base
- **React hooks rules** para seguridad
- **TypeScript rules** para type safety
- **Auto-formatting** con Prettier

## 📱 Características Técnicas

### Lazy Loading

```typescript
// Componentes cargados bajo demanda
const HomePage = lazy(() => import("@/pages/HomePage"));
const ClinicsPage = lazy(() => import("@/pages/ClinicsPage"));
```

### Error Boundaries

- **Graceful degradation** ante errores
- **Error reporting** para debugging
- **Fallback UI** para mejor experiencia

### Caching Strategy

- **React Query** con stale-while-revalidate
- **Local storage** para preferencias de usuario
- **Service Worker** para offline support (próximamente)

## 🧪 Testing (Próximamente)

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

## 📊 Performance

### Métricas Objetivo

- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3.5s

### Optimizaciones Implementadas

- **Bundle size:** < 500KB (gzipped)
- **Image optimization:** WebP + lazy loading
- **Code splitting:** Por ruta y vendor
- **Tree shaking:** Eliminación de código muerto

## 🚀 Deploy

### Build Commands

```bash
# Producción
pnpm build

# Análisis de bundle
pnpm build:analyze

# Preview local
pnpm preview
```

### Variables de Producción

```env
VITE_API_BASE_URL=https://api.petvilla.com
VITE_GOOGLE_MAPS_API_KEY=production_api_key
VITE_SENTRY_DSN=error_tracking_dsn
```

## 🤝 Contribución

### Flujo de Trabajo

1. **Fork** el repositorio
2. **Branch** feature/nombre-feature
3. **Commit** con mensajes convencionales
4. **Push** al fork
5. **Pull Request** con descripción detallada

### Code Style

- **TypeScript strict** para todo código nuevo
- **Component naming** con PascalCase
- **File naming** con kebab-case
- **Imports ordenados** alfabéticamente

### Commit Messages

```
feat: agregar componente de búsqueda
fix: resolver error en formulario de login
docs: actualizar README con nueva configuración
style: aplicar linting a componentes
refactor: optimizar hook de geolocalización
test: agregar tests para utilidades de fecha
```

## 📄 Licencia

MIT License - ver archivo [LICENSE](LICENSE) para detalles

## 🙏 Agradecimientos

- **React Team** - Por el framework increíble
- **Vite Team** - Por la herramienta de desarrollo ultra-rápida
- **Tailwind CSS** - Por el framework de utilidades CSS
- **shadcn/ui** - Por los componentes accesibles y modernos

---

**Desarrollado con ❤️ para la comunidad de amantes de mascotas**
