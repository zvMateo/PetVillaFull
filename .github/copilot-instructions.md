# PetVilla - Instrucciones para Agentes de IA

## Descripción del Proyecto

PetVilla es un marketplace full-stack de servicios veterinarios que conecta dueños de mascotas con clínicas y veterinarios independientes. Incluye geolocalización, reserva de citas, reseñas y sistema de puntos de fidelidad.

**Estructura del Monorepo:**

- `Frontend-PetVilla/` - Frontend React + Vite
- `pet-villa-api/` - API Backend NestJS
- `docs/project-definition.md` - Reglas de negocio y esquema de base de datos

## Stack Tecnológico

| Capa     | Tecnología                                              |
| -------- | ------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 4, shadcn/ui |
| Estado   | Zustand (global), TanStack React Query (servidor)       |
| Mapas    | @vis.gl/react-google-maps                               |
| Backend  | NestJS 11, Prisma 6, PostgreSQL + PostGIS               |
| Auth     | JWT con tokens access/refresh                           |

## Variables de Entorno

### Frontend (`Frontend-PetVilla/.env`)

```env
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_google_maps
VITE_API_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

### Backend (`pet-villa-api/.env`)

```env
# Conexión a Supabase via connection pooling (para queries)
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"

# Conexión directa a la base de datos (para migraciones)
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Shadow database para migraciones de Prisma
SHADOW_DATABASE_URL="postgresql://user:password@host:5432/postgres?schema=shadow_clean"

# Configuración Auth0 (opcional si usas JWT propio)
AUTH0_ISSUER_URL=tu_dominio.auth0.com
AUTH0_AUDIENCE=https://api.petvilla.com
AUTH0_CLIENT_ID=tu_client_id
AUTH0_CLIENT_SECRET=tu_client_secret

# URLs y puertos
FRONTEND_URL=http://localhost:5173
PORT=3000

# JWT (valores son tiempos de expiración: 1h = 1 hora, 7d = 7 días)
JWT_SECRET=1h
JWT_REFRESH_SECRET=7d
```

## Patrones Críticos de Rutas API

**Las llamadas API del frontend están en `Frontend-PetVilla/src/lib/api.ts`**

| Recurso              | Ruta Frontend           | Controlador Backend    |
| -------------------- | ----------------------- | ---------------------- |
| Clínicas             | `/profiles/clinics`     | ProfilesController     |
| Freelancers          | `/profiles/freelancers` | ProfilesController     |
| Citas del usuario    | `/appointments/me`      | AppointmentsController |
| Mascotas del usuario | `/pets/me`              | PetsController         |
| Servicios clínica    | `/services/clinic/:id`  | ServicesController     |
| Reseñas clínica      | `/reviews/clinic/:id`   | ReviewsController      |

**Siempre usar PATCH para actualizaciones, nunca PUT.**

## Patrones del Backend (NestJS)

### Autenticación y Autorización

```typescript
// Los controladores usan estos decoradores de src/auth/decorators/
@UseGuards(JwtAuthGuard)  // Requiere autenticación
@Public()                  // Omitir auth para este endpoint
@CurrentUser()            // Obtener usuario: { sub: string, email: string, role: string }
@CurrentUser('sub')       // Obtener solo el ID del usuario
```

### Estructura de Módulos

Cada feature sigue: `module.ts`, `controller.ts`, `service.ts`, carpeta `dto/`

- Los DTOs usan decoradores de `class-validator`
- El cliente Prisma se inyecta via `PrismaService`

### Notas de Prisma

- Output del cliente: `generated/prisma/` (ubicación no predeterminada)
- PostGIS para geografía: columnas `Geography Point` usan SQL raw via `$queryRaw`
- Ejecutar `pnpm prisma generate` después de cambios en el schema

## Patrones del Frontend

### Gestión de Estado

- **Estado global de auth**: `src/stores/authStore.ts` (Zustand + persist)
- **Estado del servidor**: Usar TanStack Query con keys como `["appointments"]`, `["pets"]`
- **Refresh de tokens**: Manejado automáticamente en interceptor de axios (`src/lib/api.ts`)

### Convenciones de Componentes

- Componentes UI de shadcn en `src/components/ui/`
- Componentes de página en `src/pages/`
- Usar `formatCurrency`, `formatDate`, `formatTime` de `src/lib/format.ts` (locale Argentina)

### Estilos (Tailwind v4)

- Usar `shrink-0` en vez de `flex-shrink-0`
- Usar `bg-linear-to-*` en vez de `bg-gradient-to-*`
- Colores custom: `pet-primary` (verde), `pet-secondary` (azul oscuro)

## Comandos de Desarrollo

```bash
# Frontend (en Frontend-PetVilla/)
pnpm install && pnpm run dev     # Servidor dev en :5173
pnpm run build                    # Build de producción con check de TypeScript

# Backend (en pet-villa-api/)
pnpm install && pnpm run start:dev  # Servidor dev en :3000
pnpm prisma generate                 # Regenerar cliente Prisma
pnpm prisma migrate dev              # Ejecutar migraciones
```

## Reglas de Negocio

1. **Sistema de Puntos**: Los puntos se otorgan SOLO cuando el estado de la cita → `COMPLETED` (transacción atómica)
2. **Roles de Usuario**: `CONSUMER`, `VET_INDIVIDUAL`, `CLINIC_ADMIN`, `CLINIC_EMPLOYEE`
3. **Flujo de Citas**: `PENDING` → `CONFIRMED` → `COMPLETED` o `CANCELLED`
4. **Acceso Público**: Navegar clínicas/servicios es público; reservar requiere auth

## Flujos de Usuario por Rol

### 🐕 Usuario Consumidor (CONSUMER)

- Al registrarse solo necesita datos básicos (email, contraseña)
- Puede ver en el mapa todas las clínicas y veterinarios cerca de su ubicación
- Usa geolocalización del navegador para centrar el mapa en su posición
- Puede filtrar por distancia, servicios, especialidades y ratings
- Ve los servicios, precios, horarios y reseñas de cada proveedor
- Requiere auth para: agendar citas, registrar mascotas, dejar reseñas

### 👨‍⚕️ Veterinario Independiente (VET_INDIVIDUAL)

- Al registrarse debe completar:
  - Datos personales (nombre, email, teléfono)
  - Número de matrícula profesional
  - Especialidades (array de strings)
  - **Zona de trabajo**: ubicación base + radio de cobertura en km
- Su ubicación se muestra como un **círculo en el mapa** (área de cobertura)
- Puede configurar sus servicios, precios y horarios de disponibilidad
- Los consumidores lo ven si están dentro de su radio de cobertura

### 🏥 Clínica Veterinaria (CLINIC_ADMIN)

- Al registrarse debe completar:
  - Datos de la clínica (nombre, descripción, teléfono, email, website)
  - **Ubicación física obligatoria**: dirección + coordenadas exactas
  - Indicar si atiende 24 horas
- Su ubicación se muestra como un **pin/marker en el mapa**
- Puede agregar empleados (CLINIC_EMPLOYEE) a su clínica
- Configura servicios, precios y horarios a nivel clínica

### 🗺️ Lógica de Geolocalización

```
Consumidor busca → Obtiene su ubicación (lat, lng)
                 → Backend filtra con PostGIS ST_DWithin
                 → Retorna clínicas cercanas (por distancia a su location)
                 → Retorna freelancers cuyo radio de cobertura incluye al usuario
```

## Puntos de Integración Clave

- **URL Base API**: `http://localhost:3000/api` (configurado en `VITE_API_URL`)
- **Tokens de auth**: Guardados en localStorage via middleware persist de Zustand
- **Consultas geo**: Backend filtra por distancia usando PostGIS `ST_DWithin`

## Flujo Completo de Reserva de Citas

```
1. Usuario navega → /clinics o /freelancers (público, sin auth)
2. Ve mapa con proveedores cercanos → geoAPI.getClinics() / geoAPI.getFreelancers()
3. Click en proveedor → /clinic/:id o /freelancer/:id (público)
4. Ve servicios, horarios, reseñas → clinicsAPI.getServices(), reviewsAPI.getByClinic()
5. Click "Agendar" → Requiere autenticación
6. Si no auth → Redirect a /login → authAPI.login()
7. Selecciona servicio, fecha, hora, mascota
8. Confirma → appointmentsAPI.create() → Status: PENDING
9. Proveedor confirma → Status: CONFIRMED
10. Cita completada → Status: COMPLETED → Puntos otorgados automáticamente
```

## Sistema de Puntos (Gamificación)

### Cómo se Ganan Puntos

- Los puntos se otorgan **únicamente** cuando una cita pasa a estado `COMPLETED`
- El cálculo: `service.pointsReward` (configurado por servicio)
- Se registra en `point_transactions` con tipo `EARNED_SERVICE`

### Cómo se Canjean Puntos

- El usuario ve catálogo de `rewards` disponibles
- Canjea usando `pointsAPI.redeem({ rewardId, pointsToRedeem })`
- Se registra en `point_transactions` con tipo `REDEEMED_REWARD` (amount negativo)

### Consulta de Balance

```typescript
// Frontend
const balance = await pointsAPI.getMyBalance(); // GET /points/me/balance
const history = await pointsAPI.getMyHistory(); // GET /points/me/history
```

## Esquema de Base de Datos (Resumen)

### Modelos Principales

```
User (id, email, password, role)
├── Profile (firstName, lastName, phone, avatarUrl)
├── FreelancerProfile (bio, licenseNumber, specialties[], serviceRadiusKm, baseLocation)
├── ClinicMember → ClinicProfile
├── Pet[] (name, species, breed, birthDate, weight)
├── Appointment[] (serviceId, petId, dateTime, status, notes)
├── Review[] (targetId, rating, comment)
└── PointTransaction[] (amount, type, referenceId)

ClinicProfile (name, address, location, is24Hours)
├── Service[] (title, category, priceFrom, duration, pointsReward)
├── AvailabilitySlot[] (dayOfWeek, startTime, endTime)
└── ClinicMember[] → User

FreelancerProfile
├── Service[]
└── AvailabilitySlot[]
```

### Enums Importantes

```typescript
Role: CONSUMER | VET_INDIVIDUAL | CLINIC_ADMIN | CLINIC_EMPLOYEE;
Species: DOG | CAT | BIRD | RABBIT | HAMSTER | OTHER;
AppointmentStatus: PENDING | CONFIRMED | COMPLETED | CANCELLED;
PointTransactionType: EARNED_SERVICE | REDEEMED_REWARD | ADJUSTMENT;
```

## Endpoints API Completos

### Autenticación (`/auth`)

| Método | Ruta             | Descripción              | Auth |
| ------ | ---------------- | ------------------------ | ---- |
| POST   | `/auth/register` | Registro de usuario      | No   |
| POST   | `/auth/login`    | Login, retorna tokens    | No   |
| POST   | `/auth/refresh`  | Renovar access token     | No   |
| GET    | `/auth/me`       | Datos del usuario actual | Sí   |

### Perfiles (`/profiles`)

| Método | Ruta                        | Descripción          | Auth |
| ------ | --------------------------- | -------------------- | ---- |
| GET    | `/profiles/me`              | Mi perfil            | Sí   |
| PATCH  | `/profiles/me`              | Actualizar mi perfil | Sí   |
| GET    | `/profiles/clinics`         | Lista clínicas       | No   |
| GET    | `/profiles/clinics/:id`     | Detalle clínica      | No   |
| GET    | `/profiles/freelancers`     | Lista freelancers    | No   |
| GET    | `/profiles/freelancers/:id` | Detalle freelancer   | No   |

### Mascotas (`/pets`)

| Método | Ruta           | Descripción        | Auth |
| ------ | -------------- | ------------------ | ---- |
| GET    | `/pets/me`     | Mis mascotas       | Sí   |
| POST   | `/pets/me`     | Crear mascota      | Sí   |
| PATCH  | `/pets/me/:id` | Actualizar mascota | Sí   |
| DELETE | `/pets/me/:id` | Eliminar mascota   | Sí   |

### Citas (`/appointments`)

| Método | Ruta                          | Descripción             | Auth |
| ------ | ----------------------------- | ----------------------- | ---- |
| GET    | `/appointments/me`            | Mis citas               | Sí   |
| POST   | `/appointments/me`            | Crear cita              | Sí   |
| PATCH  | `/appointments/me/:id/cancel` | Cancelar mi cita        | Sí   |
| GET    | `/appointments`               | Todas las citas (admin) | Sí   |
| PATCH  | `/appointments/:id`           | Actualizar cita         | Sí   |

### Servicios (`/services`)

| Método | Ruta                       | Descripción             | Auth |
| ------ | -------------------------- | ----------------------- | ---- |
| GET    | `/services`                | Lista servicios         | No   |
| GET    | `/services/clinic/:id`     | Servicios de clínica    | No   |
| GET    | `/services/freelancer/:id` | Servicios de freelancer | No   |
| POST   | `/services`                | Crear servicio          | Sí   |
| PATCH  | `/services/:id`            | Actualizar servicio     | Sí   |

### Reseñas (`/reviews`)

| Método | Ruta                      | Descripción           | Auth |
| ------ | ------------------------- | --------------------- | ---- |
| GET    | `/reviews/clinic/:id`     | Reseñas de clínica    | No   |
| GET    | `/reviews/freelancer/:id` | Reseñas de freelancer | No   |
| POST   | `/reviews`                | Crear reseña          | Sí   |
| PATCH  | `/reviews/:id`            | Actualizar reseña     | Sí   |

### Puntos (`/points`)

| Método | Ruta                 | Descripción    | Auth |
| ------ | -------------------- | -------------- | ---- |
| GET    | `/points/me/balance` | Mi balance     | Sí   |
| GET    | `/points/me/history` | Mi historial   | Sí   |
| POST   | `/points/me/redeem`  | Canjear puntos | Sí   |

### Geolocalización (`/geo`)

| Método | Ruta                         | Descripción               | Auth |
| ------ | ---------------------------- | ------------------------- | ---- |
| GET    | `/geo/clinics`               | Clínicas con ubicación    | No   |
| GET    | `/geo/freelancers`           | Freelancers con ubicación | No   |
| GET    | `/geo/search/clinics?q=`     | Buscar clínicas           | No   |
| GET    | `/geo/search/freelancers?q=` | Buscar freelancers        | No   |

### Disponibilidad (`/availability`)

| Método | Ruta                           | Descripción                 | Auth |
| ------ | ------------------------------ | --------------------------- | ---- |
| GET    | `/availability/clinic/:id`     | Horarios de clínica         | No   |
| GET    | `/availability/freelancer/:id` | Horarios de freelancer      | No   |
| GET    | `/availability/slots`          | Slots disponibles por fecha | No   |
| POST   | `/availability`                | Crear slot                  | Sí   |

## Convenciones de Código

### Nombres de Archivos

- Componentes: `PascalCase.tsx` (ej: `AppointmentCard.tsx`)
- Hooks: `use-kebab-case.ts` o `useNombreCamelCase.ts`
- Utilidades: `kebab-case.ts` (ej: `format.ts`, `api.ts`)
- Páginas: `PascalCasePage.tsx` (ej: `ClinicsPage.tsx`)

### TypeScript

- Interfaces sobre types cuando es posible
- Evitar `any` - usar tipos específicos o `unknown`
- Exportar tipos junto con sus funciones relacionadas

### Manejo de Errores

```typescript
// Frontend - En api.ts los errores se manejan con interceptor
// Mostrar errores con toast (sonner)
import { toast } from "sonner";
toast.error("Mensaje de error");
toast.success("Operación exitosa");

// Backend - Usar excepciones de NestJS
throw new NotFoundException("Recurso no encontrado");
throw new UnauthorizedException("No autorizado");
throw new BadRequestException("Datos inválidos");
```

### Queries con TanStack Query

```typescript
// Patrón estándar para queries
const { data, isLoading, error } = useQuery({
  queryKey: ["nombre-recurso", id], // Key única
  queryFn: async () => {
    const response = await api.get(`/ruta/${id}`);
    return response.data;
  },
  enabled: !!id, // Solo ejecutar si id existe
});

// Patrón para mutations
const mutation = useMutation({
  mutationFn: (data) => api.post("/ruta", data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["nombre-recurso"] });
    toast.success("Creado exitosamente");
  },
  onError: () => toast.error("Error al crear"),
});
```

## Diagrama de Relaciones

```
users ─────────────────────────────────────────────────────────┐
  │                                                            │
  ├── profiles (1:1) ─ firstName, lastName, phone, avatarUrl   │
  │                                                            │
  ├── freelancer_profiles (1:1) ── VET_INDIVIDUAL              │
  │     ├── services[]                                         │
  │     ├── availability_slots[]                               │
  │     └── baseLocation + serviceRadiusKm (círculo en mapa)   │
  │                                                            │
  ├── clinic_members[] ──────────► clinic_profiles             │
  │                                  ├── services[]            │
  │                                  ├── availability_slots[]  │
  │                                  └── location (pin en mapa)│
  │                                                            │
  ├── pets[] ─ CONSUMER                                        │
  │     └── appointments[]                                     │
  │                                                            │
  ├── appointments[] (como consumer)                           │
  │     ├── service                                            │
  │     ├── pet                                                │
  │     └── status (PENDING→CONFIRMED→COMPLETED)               │
  │                                                            │
  ├── reviews[] (como author)                                  │
  │     └── targetId → clinic o freelancer                     │
  │                                                            │
  └── point_transactions[]                                     │
        ├── EARNED_SERVICE (cita completada)                   │
        └── REDEEMED_REWARD (canje de beneficio)               │
```

## Referencias de Archivos

| Propósito               | Archivo                                     |
| ----------------------- | ------------------------------------------- |
| Cliente API y endpoints | `Frontend-PetVilla/src/lib/api.ts`          |
| Store de auth y tipos   | `Frontend-PetVilla/src/stores/authStore.ts` |
| Schema de base de datos | `pet-villa-api/prisma/schema.prisma`        |
| Módulos del backend     | `pet-villa-api/src/app.module.ts`           |
| Reglas de negocio       | `docs/project-definition.md`                |
| Formatos (moneda/fecha) | `Frontend-PetVilla/src/lib/format.ts`       |
| Decoradores de auth     | `pet-villa-api/src/auth/decorators/`        |
| Guards de auth          | `pet-villa-api/src/auth/guards/`            |
