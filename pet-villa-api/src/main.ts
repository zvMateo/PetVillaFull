import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger - Professional API Documentation
  const config = new DocumentBuilder()
    .setTitle('PetVilla API - Servicios Veterinarios')
    .setDescription(
      `
## 🐾 PetVilla API Documentation

### Overview
RESTful API for veterinary services platform connecting pet owners with certified veterinarians.

### Key Features
- **JWT Authentication** with role-based access control
- **User Profiles** for consumers, veterinarians, and clinics
- **Pet Management** with comprehensive health records
- **Appointment System** with status tracking and loyalty points
- **Geolocation Services** with PostGIS integration
- **Review System** with ratings and feedback
- **Points/Loyalty Program** for customer retention

### User Roles
| Role | Description | Permissions |
|------|-------------|------------|
| **CONSUMER** | Pet owner | Search services, book appointments, earn points |
| **VET_INDIVIDUAL** | Independent vet | Manage services, appointments, professional profile |
| **CLINIC_ADMIN** | Clinic administrator | Manage clinic, employees, services |
| **CLINIC_EMPLOYEE** | Clinic staff | Limited clinic functions access |

### Authentication
Include JWT token in Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

### Rate Limiting
- **100 requests** per **15 minutes** per IP
- File uploads limited to **5MB**
- Supported formats: JPEG, PNG, WebP

### Error Handling
All errors follow standardized format:
\`\`\`
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": {}
}
\`\`\`

### Pagination
List endpoints support pagination:
\`\`\`
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "totalPages": 9
  }
}
\`\`\`
      `,
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token (Bearer <token>)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://api.petvilla.com', 'Production Server')
    .setVersion('1.0.0')
    .setContact('PetVilla Team', 'support@petvilla.com', 'https://petvilla.com')
    .setLicense('MIT', 'https://github.com/petvilla/api/LICENSE')
    .addTag('Auth', 'Authentication & Authorization')
    .addTag('Users', 'User Management')
    .addTag('Pets', 'Pet Management')
    .addTag('Clinics', 'Clinic Services')
    .addTag('Veterinarians', 'Veterinarian Services')
    .addTag('Appointments', 'Appointment System')
    .addTag('Services', 'Service Catalog')
    .addTag('Reviews', 'Review System')
    .addTag('Points', 'Loyalty Program')
    .addTag('Geolocation', 'Location Services')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Start server
  const port = process.env.PORT || 3000;
  await app.listen(port).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

  console.log(`🚀 PetVilla API is running on port ${port}`);
  console.log(
    `📚 Swagger documentation available at http://localhost:${port}/docs`,
  );
}

void bootstrap();
