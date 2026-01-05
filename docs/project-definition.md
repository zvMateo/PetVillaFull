# Contexto del Proyecto: Plataforma de Servicios Veterinarios

## 1. Descripción del Proyecto

Plataforma Full Stack que conecta dueños de mascotas (Usuarios Consumidores) con servicios veterinarios (Clínicas y Particulares). Funciona como una red social vertical con geolocalización.

### Filosofía de Acceso (Guest Mode vs. User)

- **Navegación Pública:** Cualquier usuario (sin loguearse) puede buscar veterinarias, ver perfiles, leer reseñas y consultar precios.
- **Usuarios Registrados:** Necesario para agendar citas, dejar reseñas y acumular puntos.
- **Gamificación (Loyalty):** Los usuarios registrados ganan puntos al concretar servicios a través de la plataforma, canjeables por beneficios futuros.

## 2. Tech Stack (Strict)

### Frontend (GoodApps Standard)

- **Core:** React, TypeScript, Vite.
- **Estilos:** Tailwind CSS.
- **UI Kit:** shadcn/ui.
- **Mapas & Geo:** @vis.gl/react-google-maps (API Oficial).
- **Estado:** Zustand (Global), TanStack React Query (Server State).
- **Routing:** React Router.
- **Http:** Axios.
- **Forms:** React Hook Form + Zod.
- **Utils:** date-fns, Swiper, Sonner.

### Backend & Infraestructura

- **Framework:** NestJS.
- **ORM:** Prisma.
- **Base de Datos:** Supabase (PostgreSQL + PostGIS).

## 3. Reglas de Negocio

### A. Perfiles y Actores

1. **Usuario Consumidor:**
   - Tiene saldo de puntos.
   - Puede buscar, agendar y registrar mascotas.
2. **Veterinaria (Clínica):**
   - Ubicación fija (Marker en mapa).
   - Tiene empleados (otros usuarios veterinarios asociados).
   - Administrada por uno o más CLINIC_ADMIN.
3. **Veterinario Particular:**
   - Zona de cobertura (Radio/Polígono).
   - Servicio a domicilio principalmente.

### B. Sistema de Puntos (Loyalty)

- **Acumulación:** Los puntos se otorgan **solo cuando el servicio cambia a estado "Completado"** (no al reservar).
- **Cálculo:** Definir regla en backend (ej. 10% del valor del servicio = puntos).
- **Canje:** Los puntos se usan para descuentos en futuros servicios o productos del catálogo de beneficios.
- **Ledger:** Todas las transacciones de puntos se registran en `point_transactions` para auditoría.

### C. Geolocalización

- El backend debe filtrar por distancia usando PostGIS (`ST_DWithin`).
- Frontend visualiza: Pines para clínicas, Círculos semitransparentes para áreas de cobertura de particulares.
- Índices espaciales obligatorios en columnas de tipo `Geography`.

### D. Sistema de Citas

- Las citas requieren especificar qué mascota(s) serán atendidas.
- Estados: PENDING → CONFIRMED → COMPLETED o CANCELLED.
- Solo al marcar COMPLETED se otorgan puntos (en transacción atómica).

## 4. Estructura de Base de Datos (Supabase/PostgreSQL + Prisma)

El sistema debe usar las siguientes tablas principales y relaciones. Usar `UUID` para claves primarias.

### Tablas Core

#### `users` - Tabla espejo de Auth0

| Campo       | Tipo                                                     | Descripción             |
| ----------- | -------------------------------------------------------- | ----------------------- |
| `id`        | UUID, PK                                                 | Identificador único     |
| `auth0_sub` | String, Unique                                           | ID de Auth0 (sub claim) |
| `email`     | String                                                   | Email del usuario       |
| `role`      | Enum: CONSUMER, VET_INDIVIDUAL, CLINIC_ADMIN, CLINIC_EMP | Rol del usuario         |
| `createdAt` | DateTime                                                 | Fecha de creación       |
| `updatedAt` | DateTime                                                 | Última actualización    |

### Perfiles (Extensiones de User)

#### `profiles` - Perfil común para todos los usuarios

| Campo       | Tipo             | Descripción           |
| ----------- | ---------------- | --------------------- |
| `id`        | UUID, PK         | Identificador único   |
| `userId`    | FK → users.id    | Relación 1:1 con user |
| `firstName` | String           | Nombre                |
| `lastName`  | String           | Apellido              |
| `phone`     | String, opcional | Teléfono de contacto  |
| `avatarUrl` | String, opcional | URL de foto de perfil |

#### `clinic_profiles` - Perfil de Clínicas Veterinarias

| Campo         | Tipo             | Descripción           |
| ------------- | ---------------- | --------------------- |
| `id`          | UUID, PK         | Identificador único   |
| `name`        | String           | Nombre de la clínica  |
| `description` | String, opcional | Descripción/Bio       |
| `address`     | String           | Dirección física      |
| `phone`       | String, opcional | Teléfono de contacto  |
| `email`       | String, opcional | Email de contacto     |
| `website`     | String, opcional | Sitio web             |
| `location`    | Geography Point  | Coordenadas (PostGIS) |
| `is24Hours`   | Boolean          | ¿Atiende 24 horas?    |
| `imageUrl`    | String, opcional | Foto de la clínica    |
| `createdAt`   | DateTime         | Fecha de creación     |

#### `clinic_members` - Relación usuarios ↔ clínicas

| Campo      | Tipo                  | Descripción                |
| ---------- | --------------------- | -------------------------- |
| `id`       | UUID, PK              | Identificador único        |
| `userId`   | FK → users.id         | Usuario miembro            |
| `clinicId` | FK → clinic_profiles  | Clínica a la que pertenece |
| `role`     | Enum: ADMIN, EMPLOYEE | Rol dentro de la clínica   |
| `joinedAt` | DateTime              | Fecha de incorporación     |

#### `freelancer_profiles` - Perfil de Veterinarios Independientes

| Campo             | Tipo             | Descripción                 |
| ----------------- | ---------------- | --------------------------- |
| `id`              | UUID, PK         | Identificador único         |
| `userId`          | FK → users.id    | Relación 1:1 con user       |
| `bio`             | String, opcional | Biografía profesional       |
| `licenseNumber`   | String           | Número de matrícula         |
| `specialties`     | String[]         | Especialidades              |
| `serviceRadiusKm` | Integer          | Radio de cobertura en km    |
| `baseLocation`    | Geography Point  | Centro de zona de cobertura |
| `createdAt`       | DateTime         | Fecha de creación           |

### Mascotas

#### `pets` - Mascotas de los consumidores

| Campo       | Tipo                        | Descripción              |
| ----------- | --------------------------- | ------------------------ |
| `id`        | UUID, PK                    | Identificador único      |
| `ownerId`   | FK → users.id               | Dueño de la mascota      |
| `name`      | String                      | Nombre de la mascota     |
| `species`   | Enum: DOG, CAT, BIRD, OTHER | Especie                  |
| `breed`     | String, opcional            | Raza                     |
| `birthDate` | Date, opcional              | Fecha de nacimiento      |
| `weight`    | Decimal, opcional           | Peso en kg               |
| `imageUrl`  | String, opcional            | Foto de la mascota       |
| `notes`     | String, opcional            | Notas médicas/especiales |
| `createdAt` | DateTime                    | Fecha de registro        |

### Servicios

#### `services` - Catálogo de servicios

| Campo          | Tipo              | Descripción                        |
| -------------- | ----------------- | ---------------------------------- |
| `id`           | UUID, PK          | Identificador único                |
| `clinicId`     | FK, nullable      | Clínica que ofrece (si aplica)     |
| `freelancerId` | FK, nullable      | Freelancer que ofrece (si aplica)  |
| `title`        | String            | Nombre del servicio                |
| `description`  | String, opcional  | Descripción detallada              |
| `category`     | String            | Categoría (Consulta, Vacuna, etc.) |
| `priceFrom`    | Decimal           | Precio base                        |
| `duration`     | Integer, opcional | Duración en minutos                |
| `pointsReward` | Integer           | Puntos que otorga al completar     |
| `isActive`     | Boolean           | ¿Servicio disponible?              |
| `createdAt`    | DateTime          | Fecha de creación                  |

> **Nota:** Usar CHECK constraint: `(clinicId IS NOT NULL) OR (freelancerId IS NOT NULL)` para garantizar que siempre haya un proveedor.

### Disponibilidad

#### `availability_slots` - Horarios disponibles

| Campo          | Tipo          | Descripción                  |
| -------------- | ------------- | ---------------------------- |
| `id`           | UUID, PK      | Identificador único          |
| `clinicId`     | FK, nullable  | Clínica (si aplica)          |
| `freelancerId` | FK, nullable  | Freelancer (si aplica)       |
| `dayOfWeek`    | Integer (0-6) | Día de la semana (0=Domingo) |
| `startTime`    | Time          | Hora de inicio               |
| `endTime`      | Time          | Hora de fin                  |
| `isActive`     | Boolean       | ¿Slot activo?                |

### Citas

#### `appointments` - Reservas/Citas

| Campo        | Tipo                                        | Descripción                |
| ------------ | ------------------------------------------- | -------------------------- |
| `id`         | UUID, PK                                    | Identificador único        |
| `consumerId` | FK → users.id                               | Usuario que reserva        |
| `serviceId`  | FK → services.id                            | Servicio solicitado        |
| `petId`      | FK → pets.id                                | Mascota a atender          |
| `dateTime`   | DateTime                                    | Fecha y hora de la cita    |
| `status`     | Enum: PENDING, CONFIRMED, COMPLETED, CANCEL | Estado de la cita          |
| `notes`      | String, opcional                            | Notas adicionales          |
| `location`   | Geography Point, opcional                   | Ubicación (para domicilio) |
| `createdAt`  | DateTime                                    | Fecha de creación          |
| `updatedAt`  | DateTime                                    | Última actualización       |

### Reviews

#### `reviews` - Reseñas y calificaciones

| Campo       | Tipo             | Descripción                   |
| ----------- | ---------------- | ----------------------------- |
| `id`        | UUID, PK         | Identificador único           |
| `authorId`  | FK → users.id    | Usuario que escribe la reseña |
| `targetId`  | UUID             | ID del perfil reseñado        |
| `rating`    | Integer (1-5)    | Calificación                  |
| `comment`   | String, opcional | Comentario                    |
| `createdAt` | DateTime         | Fecha de la reseña            |

> **Nota:** El `rating_avg` debe calcularse dinámicamente con query o actualizarse via trigger, no almacenarse estáticamente.

### Gamificación

#### `point_transactions` - Historial de puntos (Ledger)

| Campo         | Tipo                                          | Descripción                  |
| ------------- | --------------------------------------------- | ---------------------------- |
| `id`          | UUID, PK                                      | Identificador único          |
| `consumerId`  | FK → users.id                                 | Usuario beneficiario         |
| `amount`      | Integer                                       | Cantidad (+ganancia, -gasto) |
| `type`        | Enum: EARNED_SERVICE, REDEEMED_REWARD, ADJUST | Tipo de transacción          |
| `referenceId` | UUID, opcional                                | ID de cita o reward          |
| `description` | String, opcional                              | Descripción                  |
| `createdAt`   | DateTime                                      | Fecha de transacción         |

#### `rewards` - Catálogo de canje

| Campo         | Tipo             | Descripción               |
| ------------- | ---------------- | ------------------------- |
| `id`          | UUID, PK         | Identificador único       |
| `name`        | String           | Nombre del beneficio      |
| `description` | String, opcional | Descripción               |
| `costPoints`  | Integer          | Puntos requeridos         |
| `isActive`    | Boolean          | ¿Disponible para canjear? |
| `createdAt`   | DateTime         | Fecha de creación         |

## 5. Guías de Codificación

### Frontend

- **Mapas:** Usar `@vis.gl/react-google-maps`. Implementar lazy loading del mapa.
- **Accesibilidad:** Rutas públicas (`/search`, `/vet/:id`) vs Rutas protegidas (`/profile`, `/appointments`).
- **Zustand Stores:**
  - `useAuthStore` - Estado del usuario autenticado y sus puntos.
  - `useSearchStore` - Filtros de búsqueda y mapa.
  - `usePetsStore` - Mascotas del usuario actual.

### Backend (NestJS)

- **Endpoints Públicos:** Usar decorador `@Public()` para endpoints de búsqueda y perfiles (bypass AuthGuard).
- **Transacciones:** El otorgamiento de puntos debe ocurrir dentro de una transacción de base de datos al momento de marcar una cita como `COMPLETED`.
- **PostGIS:** Índices espaciales obligatorios en columnas `location`.
- **Validación:** Usar class-validator en todos los DTOs.
- **Relaciones polimórficas:** Evitar `provider_id` + `provider_type`. Usar FKs nullable con CHECK constraint.

### Seguridad

- **Auth0:** Todos los endpoints protegidos validan JWT de Auth0.
- **Roles:** Usar `@Roles()` decorator para control de acceso por rol.
- **Ownership:** Validar que el usuario solo pueda modificar sus propios recursos (mascotas, citas, etc.).

## 6. Diagrama de Relaciones (Resumen)

```text
users
  ├── profiles (1:1)
  ├── pets (1:N) - solo CONSUMER
  ├── freelancer_profiles (1:1) - solo VET_INDIVIDUAL
  ├── clinic_members (N:M con clinic_profiles)
  ├── appointments (1:N como consumer)
  ├── reviews (1:N como author)
  └── point_transactions (1:N)

clinic_profiles
  ├── clinic_members (1:N)
  ├── services (1:N)
  ├── availability_slots (1:N)
  └── reviews (como target)

freelancer_profiles
  ├── services (1:N)
  ├── availability_slots (1:N)
  └── reviews (como target)

services
  └── appointments (1:N)

pets
  └── appointments (1:N)
```
