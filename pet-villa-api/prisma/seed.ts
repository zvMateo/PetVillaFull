import { PrismaClient, Role, ClinicMemberRole, Species } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Villa del Rosario, Córdoba coordinates
const VILLA_DEL_ROSARIO_CENTER = { lat: -31.5606, lng: -63.5356 };

async function main() {
  console.log('🌱 Starting seed...');

  // Clean up existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.pointTransaction.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.service.deleteMany();
  await prisma.clinicMember.deleteMany();
  await prisma.freelancerProfile.deleteMany();
  await prisma.clinicProfile.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.reward.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // ============================================
  // CREATE CONSUMERS (Pet Owners)
  // ============================================
  console.log('👤 Creating consumers...');

  const consumer1 = await prisma.user.create({
    data: {
      email: 'maria.perez@email.com',
      password: hashedPassword,
      role: Role.CONSUMER,
      profile: {
        create: {
          firstName: 'María',
          lastName: 'Pérez',
          phone: '+5493546421234',
          avatarUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        },
      },
    },
  });

  const consumer2 = await prisma.user.create({
    data: {
      email: 'juan.rodriguez@email.com',
      password: hashedPassword,
      role: Role.CONSUMER,
      profile: {
        create: {
          firstName: 'Juan',
          lastName: 'Rodríguez',
          phone: '+5493546425678',
          avatarUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        },
      },
    },
  });

  const consumer3 = await prisma.user.create({
    data: {
      email: 'ana.martinez@email.com',
      password: hashedPassword,
      role: Role.CONSUMER,
      profile: {
        create: {
          firstName: 'Ana',
          lastName: 'Martínez',
          phone: '+5493546429012',
        },
      },
    },
  });

  // ============================================
  // CREATE PETS
  // ============================================
  console.log('🐾 Creating pets...');

  const pet1 = await prisma.pet.create({
    data: {
      ownerId: consumer1.id,
      name: 'Luna',
      species: Species.DOG,
      breed: 'Golden Retriever',
      birthDate: new Date('2021-03-15'),
      weight: 28.5,
      imageUrl:
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
      notes: 'Muy juguetona, le gustan los paseos',
    },
  });

  const pet2 = await prisma.pet.create({
    data: {
      ownerId: consumer1.id,
      name: 'Simba',
      species: Species.CAT,
      breed: 'Persa',
      birthDate: new Date('2020-08-20'),
      weight: 5.2,
      imageUrl:
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop',
    },
  });

  const pet3 = await prisma.pet.create({
    data: {
      ownerId: consumer2.id,
      name: 'Max',
      species: Species.DOG,
      breed: 'Labrador',
      birthDate: new Date('2019-11-10'),
      weight: 32.0,
      imageUrl:
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop',
    },
  });

  const pet4 = await prisma.pet.create({
    data: {
      ownerId: consumer3.id,
      name: 'Michi',
      species: Species.CAT,
      breed: 'Siamés',
      birthDate: new Date('2022-01-05'),
      weight: 4.1,
    },
  });

  // ============================================
  // CREATE CLINIC ADMINS AND CLINICS
  // ============================================
  console.log('🏥 Creating clinics...');

  // Clinic 1 - Veterinaria Patitas Felices
  const clinicAdmin1 = await prisma.user.create({
    data: {
      email: 'admin@patitasfelices.com',
      password: hashedPassword,
      role: Role.CLINIC_ADMIN,
      profile: {
        create: {
          firstName: 'Roberto',
          lastName: 'Gómez',
          phone: '+5493546420001',
        },
      },
    },
  });

  const clinic1 = await prisma.clinicProfile.create({
    data: {
      name: 'Veterinaria Patitas Felices',
      description:
        'Centro veterinario integral con más de 15 años de experiencia en Villa del Rosario. Atendemos todo tipo de mascotas con amor y profesionalismo.',
      address: 'Av. San Martín 456, Villa del Rosario, Córdoba',
      phone: '+5493546420100',
      email: 'contacto@patitasfelices.com',
      website: 'https://patitasfelices.com.ar',
      is24Hours: false,
      imageUrl:
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
    },
  });

  // Set location with PostGIS
  await prisma.$executeRaw`
    UPDATE "ClinicProfile" 
    SET location = ST_SetSRID(ST_MakePoint(${-63.5356}, ${-31.5606}), 4326)
    WHERE id = ${clinic1.id}::uuid
  `;

  await prisma.clinicMember.create({
    data: {
      userId: clinicAdmin1.id,
      clinicId: clinic1.id,
      role: ClinicMemberRole.ADMIN,
    },
  });

  // Clinic 2 - Hospital Veterinario Villa del Rosario (24hs)
  const clinicAdmin2 = await prisma.user.create({
    data: {
      email: 'admin@hospitalvet.com',
      password: hashedPassword,
      role: Role.CLINIC_ADMIN,
      profile: {
        create: {
          firstName: 'Laura',
          lastName: 'Fernández',
          phone: '+5493546420002',
        },
      },
    },
  });

  const clinic2 = await prisma.clinicProfile.create({
    data: {
      name: 'Hospital Veterinario Villa del Rosario',
      description:
        'Hospital veterinario de emergencias 24 horas. Contamos con quirófano equipado, internación y guardia permanente.',
      address: 'Ruta 9 Km 685, Villa del Rosario, Córdoba',
      phone: '+5493546420200',
      email: 'emergencias@hospitalvet.com',
      is24Hours: true,
      imageUrl:
        'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop',
    },
  });

  await prisma.$executeRaw`
    UPDATE "ClinicProfile" 
    SET location = ST_SetSRID(ST_MakePoint(${-63.528}, ${-31.565}), 4326)
    WHERE id = ${clinic2.id}::uuid
  `;

  await prisma.clinicMember.create({
    data: {
      userId: clinicAdmin2.id,
      clinicId: clinic2.id,
      role: ClinicMemberRole.ADMIN,
    },
  });

  // Clinic 3 - Clínica Felina Córdoba
  const clinicAdmin3 = await prisma.user.create({
    data: {
      email: 'admin@clinicafelina.com',
      password: hashedPassword,
      role: Role.CLINIC_ADMIN,
      profile: {
        create: {
          firstName: 'Cecilia',
          lastName: 'López',
          phone: '+5493546420003',
        },
      },
    },
  });

  const clinic3 = await prisma.clinicProfile.create({
    data: {
      name: 'Clínica Felina Córdoba',
      description:
        'Especialistas exclusivos en medicina felina. Ambiente diseñado para reducir el estrés de tu gato.',
      address: 'Calle Belgrano 123, Villa del Rosario, Córdoba',
      phone: '+5493546420300',
      email: 'info@clinicafelina.com',
      is24Hours: false,
      imageUrl:
        'https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=600&h=400&fit=crop',
    },
  });

  await prisma.$executeRaw`
    UPDATE "ClinicProfile" 
    SET location = ST_SetSRID(ST_MakePoint(${-63.532}, ${-31.562}), 4326)
    WHERE id = ${clinic3.id}::uuid
  `;

  await prisma.clinicMember.create({
    data: {
      userId: clinicAdmin3.id,
      clinicId: clinic3.id,
      role: ClinicMemberRole.ADMIN,
    },
  });

  // Clinic 4 - Centro Veterinario El Campo
  const clinicAdmin4 = await prisma.user.create({
    data: {
      email: 'admin@vetelcampo.com',
      password: hashedPassword,
      role: Role.CLINIC_ADMIN,
      profile: {
        create: {
          firstName: 'Martín',
          lastName: 'Sánchez',
          phone: '+5493546420004',
        },
      },
    },
  });

  const clinic4 = await prisma.clinicProfile.create({
    data: {
      name: 'Centro Veterinario El Campo',
      description:
        'Especialistas en grandes y pequeños animales. Atención rural y domiciliaria disponible.',
      address: 'Av. Libertad 789, Villa del Rosario, Córdoba',
      phone: '+5493546420400',
      email: 'contacto@vetelcampo.com',
      is24Hours: false,
      imageUrl:
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop',
    },
  });

  await prisma.$executeRaw`
    UPDATE "ClinicProfile" 
    SET location = ST_SetSRID(ST_MakePoint(${-63.542}, ${-31.555}), 4326)
    WHERE id = ${clinic4.id}::uuid
  `;

  await prisma.clinicMember.create({
    data: {
      userId: clinicAdmin4.id,
      clinicId: clinic4.id,
      role: ClinicMemberRole.ADMIN,
    },
  });

  // ============================================
  // CREATE FREELANCER VETERINARIANS
  // ============================================
  console.log('👨‍⚕️ Creating freelancer veterinarians...');

  // Freelancer 1 - Dr. Carlos Fernández
  const freelancer1User = await prisma.user.create({
    data: {
      email: 'dr.carlos@email.com',
      password: hashedPassword,
      role: Role.VET_INDIVIDUAL,
      profile: {
        create: {
          firstName: 'Carlos',
          lastName: 'Fernández',
          phone: '+5493546421001',
          avatarUrl:
            'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop',
        },
      },
    },
  });

  const freelancer1 = await prisma.freelancerProfile.create({
    data: {
      userId: freelancer1User.id,
      bio: 'Veterinario con 10 años de experiencia. Especializado en medicina general y preventiva. Atención a domicilio en toda Villa del Rosario y alrededores.',
      licenseNumber: 'MP-12345',
      specialties: ['Medicina General', 'Vacunación', 'Desparasitación'],
      serviceRadiusKm: 15,
      imageUrl:
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop',
    },
  });

  await prisma.$executeRaw`
    UPDATE "FreelancerProfile" 
    SET "baseLocation" = ST_SetSRID(ST_MakePoint(${-63.54}, ${-31.558}), 4326)
    WHERE id = ${freelancer1.id}::uuid
  `;

  // Freelancer 2 - Dra. María González
  const freelancer2User = await prisma.user.create({
    data: {
      email: 'dra.maria@email.com',
      password: hashedPassword,
      role: Role.VET_INDIVIDUAL,
      profile: {
        create: {
          firstName: 'María',
          lastName: 'González',
          phone: '+5493546421002',
          avatarUrl:
            'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop',
        },
      },
    },
  });

  const freelancer2 = await prisma.freelancerProfile.create({
    data: {
      userId: freelancer2User.id,
      bio: 'Especialista en medicina felina y comportamiento animal. Más de 8 años de experiencia. Consultas a domicilio con ambiente tranquilo para tu mascota.',
      licenseNumber: 'MP-23456',
      specialties: ['Medicina Felina', 'Comportamiento', 'Nutrición'],
      serviceRadiusKm: 10,
      imageUrl:
        'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop',
    },
  });

  await prisma.$executeRaw`
    UPDATE "FreelancerProfile" 
    SET "baseLocation" = ST_SetSRID(ST_MakePoint(${-63.538}, ${-31.559}), 4326)
    WHERE id = ${freelancer2.id}::uuid
  `;

  // Freelancer 3 - Dr. Pablo Ruiz
  const freelancer3User = await prisma.user.create({
    data: {
      email: 'dr.pablo@email.com',
      password: hashedPassword,
      role: Role.VET_INDIVIDUAL,
      profile: {
        create: {
          firstName: 'Pablo',
          lastName: 'Ruiz',
          phone: '+5493546421003',
          avatarUrl:
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop',
        },
      },
    },
  });

  const freelancer3 = await prisma.freelancerProfile.create({
    data: {
      userId: freelancer3User.id,
      bio: 'Veterinario especializado en dermatología y alergias. Atención personalizada a domicilio.',
      licenseNumber: 'MP-34567',
      specialties: ['Dermatología', 'Alergias', 'Medicina General'],
      serviceRadiusKm: 12,
      imageUrl:
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop',
    },
  });

  await prisma.$executeRaw`
    UPDATE "FreelancerProfile" 
    SET "baseLocation" = ST_SetSRID(ST_MakePoint(${-63.53}, ${-31.563}), 4326)
    WHERE id = ${freelancer3.id}::uuid
  `;

  // ============================================
  // CREATE SERVICES FOR CLINICS
  // ============================================
  console.log('🔧 Creating services...');

  // Services for Clinic 1 - Patitas Felices
  const service1_1 = await prisma.service.create({
    data: {
      clinicId: clinic1.id,
      title: 'Consulta General',
      description: 'Examen clínico completo de tu mascota',
      category: 'Consulta',
      priceFrom: 8500,
      duration: 30,
      pointsReward: 100,
    },
  });

  await prisma.service.create({
    data: {
      clinicId: clinic1.id,
      title: 'Vacunación',
      description: 'Aplicación de vacunas con certificado',
      category: 'Prevención',
      priceFrom: 12000,
      duration: 20,
      pointsReward: 150,
    },
  });

  await prisma.service.create({
    data: {
      clinicId: clinic1.id,
      title: 'Desparasitación',
      description: 'Tratamiento antiparasitario interno y externo',
      category: 'Prevención',
      priceFrom: 6500,
      duration: 15,
      pointsReward: 80,
    },
  });

  await prisma.service.create({
    data: {
      clinicId: clinic1.id,
      title: 'Peluquería Canina',
      description: 'Baño, corte y cepillado profesional',
      category: 'Estética',
      priceFrom: 15000,
      duration: 90,
      pointsReward: 200,
    },
  });

  // Services for Clinic 2 - Hospital 24hs
  await prisma.service.create({
    data: {
      clinicId: clinic2.id,
      title: 'Emergencia 24hs',
      description: 'Atención de urgencias las 24 horas',
      category: 'Emergencia',
      priceFrom: 15000,
      duration: 60,
      pointsReward: 250,
    },
  });

  await prisma.service.create({
    data: {
      clinicId: clinic2.id,
      title: 'Cirugía General',
      description: 'Procedimientos quirúrgicos con anestesia monitoreada',
      category: 'Cirugía',
      priceFrom: 45000,
      duration: 120,
      pointsReward: 500,
    },
  });

  await prisma.service.create({
    data: {
      clinicId: clinic2.id,
      title: 'Radiografía',
      description: 'Estudios radiográficos digitales',
      category: 'Diagnóstico',
      priceFrom: 8000,
      duration: 30,
      pointsReward: 100,
    },
  });

  await prisma.service.create({
    data: {
      clinicId: clinic2.id,
      title: 'Internación',
      description: 'Hospitalización con monitoreo constante',
      category: 'Internación',
      priceFrom: 20000,
      duration: 1440,
      pointsReward: 300,
    },
  });

  // Services for Clinic 3 - Clínica Felina
  await prisma.service.create({
    data: {
      clinicId: clinic3.id,
      title: 'Consulta Felina Especializada',
      description: 'Examen completo específico para gatos',
      category: 'Consulta',
      priceFrom: 10000,
      duration: 40,
      pointsReward: 120,
    },
  });

  await prisma.service.create({
    data: {
      clinicId: clinic3.id,
      title: 'Odontología Felina',
      description: 'Limpieza dental y tratamientos bucales',
      category: 'Odontología',
      priceFrom: 25000,
      duration: 60,
      pointsReward: 300,
    },
  });

  await prisma.service.create({
    data: {
      clinicId: clinic3.id,
      title: 'Peluquería Felina',
      description: 'Baño y corte especial para gatos',
      category: 'Estética',
      priceFrom: 12000,
      duration: 60,
      pointsReward: 150,
    },
  });

  // Services for Clinic 4 - El Campo
  await prisma.service.create({
    data: {
      clinicId: clinic4.id,
      title: 'Consulta Grandes Animales',
      description: 'Atención para equinos, bovinos y otros',
      category: 'Consulta',
      priceFrom: 18000,
      duration: 60,
      pointsReward: 200,
    },
  });

  await prisma.service.create({
    data: {
      clinicId: clinic4.id,
      title: 'Visita Rural',
      description: 'Atención veterinaria en campo',
      category: 'Rural',
      priceFrom: 25000,
      duration: 120,
      pointsReward: 350,
    },
  });

  // ============================================
  // CREATE SERVICES FOR FREELANCERS
  // ============================================

  // Services for Freelancer 1 - Dr. Carlos
  const freelancerService1 = await prisma.service.create({
    data: {
      freelancerId: freelancer1.id,
      title: 'Consulta a Domicilio',
      description: 'Atención veterinaria en la comodidad de tu hogar',
      category: 'Consulta',
      priceFrom: 12000,
      duration: 45,
      pointsReward: 150,
    },
  });

  await prisma.service.create({
    data: {
      freelancerId: freelancer1.id,
      title: 'Vacunación a Domicilio',
      description: 'Aplicación de vacunas sin estrés de traslado',
      category: 'Prevención',
      priceFrom: 15000,
      duration: 30,
      pointsReward: 180,
    },
  });

  // Services for Freelancer 2 - Dra. María
  await prisma.service.create({
    data: {
      freelancerId: freelancer2.id,
      title: 'Consulta Felina a Domicilio',
      description: 'Especialista en gatos, atención sin estrés',
      category: 'Consulta',
      priceFrom: 14000,
      duration: 50,
      pointsReward: 170,
    },
  });

  await prisma.service.create({
    data: {
      freelancerId: freelancer2.id,
      title: 'Evaluación de Comportamiento',
      description: 'Diagnóstico y plan de modificación conductual',
      category: 'Comportamiento',
      priceFrom: 18000,
      duration: 60,
      pointsReward: 200,
    },
  });

  // Services for Freelancer 3 - Dr. Pablo
  await prisma.service.create({
    data: {
      freelancerId: freelancer3.id,
      title: 'Consulta Dermatológica',
      description: 'Diagnóstico y tratamiento de problemas de piel',
      category: 'Dermatología',
      priceFrom: 16000,
      duration: 45,
      pointsReward: 180,
    },
  });

  await prisma.service.create({
    data: {
      freelancerId: freelancer3.id,
      title: 'Test de Alergias',
      description: 'Evaluación completa de alergias alimentarias y ambientales',
      category: 'Diagnóstico',
      priceFrom: 22000,
      duration: 60,
      pointsReward: 250,
    },
  });

  // ============================================
  // CREATE AVAILABILITY SLOTS
  // ============================================
  console.log('📅 Creating availability slots...');

  // Availability for Clinic 1 (Mon-Fri 9-18, Sat 9-13)
  for (let day = 1; day <= 5; day++) {
    await prisma.availabilitySlot.create({
      data: {
        clinicId: clinic1.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
      },
    });
  }
  await prisma.availabilitySlot.create({
    data: {
      clinicId: clinic1.id,
      dayOfWeek: 6,
      startTime: '09:00',
      endTime: '13:00',
    },
  });

  // Availability for Clinic 2 - 24hs (all days)
  for (let day = 0; day <= 6; day++) {
    await prisma.availabilitySlot.create({
      data: {
        clinicId: clinic2.id,
        dayOfWeek: day,
        startTime: '00:00',
        endTime: '23:59',
      },
    });
  }

  // Availability for Clinic 3 (Mon-Fri 10-19)
  for (let day = 1; day <= 5; day++) {
    await prisma.availabilitySlot.create({
      data: {
        clinicId: clinic3.id,
        dayOfWeek: day,
        startTime: '10:00',
        endTime: '19:00',
      },
    });
  }

  // Availability for Freelancers
  for (let day = 1; day <= 6; day++) {
    await prisma.availabilitySlot.create({
      data: {
        freelancerId: freelancer1.id,
        dayOfWeek: day,
        startTime: '08:00',
        endTime: '20:00',
      },
    });
    await prisma.availabilitySlot.create({
      data: {
        freelancerId: freelancer2.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
      },
    });
  }

  // ============================================
  // CREATE REVIEWS
  // ============================================
  console.log('⭐ Creating reviews...');

  // Reviews for Clinic 1
  await prisma.review.create({
    data: {
      authorId: consumer1.id,
      targetId: clinic1.id,
      rating: 5,
      comment:
        'Excelente atención! La Dra. fue muy amable con Luna y nos explicó todo con paciencia.',
    },
  });

  await prisma.review.create({
    data: {
      authorId: consumer2.id,
      targetId: clinic1.id,
      rating: 5,
      comment: 'Muy profesionales. Las instalaciones están impecables.',
    },
  });

  await prisma.review.create({
    data: {
      authorId: consumer3.id,
      targetId: clinic1.id,
      rating: 4,
      comment: 'Buena atención, solo que a veces hay que esperar un poco.',
    },
  });

  // Reviews for Clinic 2
  await prisma.review.create({
    data: {
      authorId: consumer1.id,
      targetId: clinic2.id,
      rating: 5,
      comment:
        'Salvaron a mi perro en una emergencia a las 3am. Eternamente agradecida!',
    },
  });

  await prisma.review.create({
    data: {
      authorId: consumer2.id,
      targetId: clinic2.id,
      rating: 4,
      comment: 'Muy bien equipados. El personal de guardia es muy profesional.',
    },
  });

  // Reviews for Clinic 3
  await prisma.review.create({
    data: {
      authorId: consumer1.id,
      targetId: clinic3.id,
      rating: 5,
      comment: 'Increíble cómo manejan a los gatos. Simba no se estresó nada!',
    },
  });

  await prisma.review.create({
    data: {
      authorId: consumer3.id,
      targetId: clinic3.id,
      rating: 5,
      comment:
        'Especialistas de verdad. Detectaron un problema que otros no vieron.',
    },
  });

  // Reviews for Freelancer 1
  await prisma.review.create({
    data: {
      authorId: consumer1.id,
      targetId: freelancer1.id,
      rating: 5,
      comment:
        'Dr. Carlos es muy atento. Vino a casa y Luna estuvo súper tranquila.',
    },
  });

  await prisma.review.create({
    data: {
      authorId: consumer2.id,
      targetId: freelancer1.id,
      rating: 5,
      comment: 'Puntual, profesional y muy claro en sus explicaciones.',
    },
  });

  // Reviews for Freelancer 2
  await prisma.review.create({
    data: {
      authorId: consumer1.id,
      targetId: freelancer2.id,
      rating: 5,
      comment: 'La mejor veterinaria de gatos de la zona. Simba la adora!',
    },
  });

  await prisma.review.create({
    data: {
      authorId: consumer3.id,
      targetId: freelancer2.id,
      rating: 5,
      comment:
        'Resolvió el problema de comportamiento de Michi en pocas sesiones.',
    },
  });

  // ============================================
  // CREATE SAMPLE APPOINTMENTS
  // ============================================
  console.log('📋 Creating appointments...');

  // Past completed appointment
  await prisma.appointment.create({
    data: {
      consumerId: consumer1.id,
      serviceId: service1_1.id,
      petId: pet1.id,
      dateTime: new Date('2025-12-28T10:00:00'),
      status: 'COMPLETED',
      notes: 'Control anual realizado. Todo en orden.',
    },
  });

  // Upcoming confirmed appointment
  await prisma.appointment.create({
    data: {
      consumerId: consumer1.id,
      serviceId: freelancerService1.id,
      petId: pet2.id,
      dateTime: new Date('2025-12-31T14:00:00'),
      status: 'CONFIRMED',
      notes: 'Vacunación anual de Simba',
    },
  });

  // Pending appointment
  await prisma.appointment.create({
    data: {
      consumerId: consumer2.id,
      serviceId: service1_1.id,
      petId: pet3.id,
      dateTime: new Date('2026-01-02T11:00:00'),
      status: 'PENDING',
    },
  });

  // ============================================
  // CREATE REWARDS
  // ============================================
  console.log('🎁 Creating rewards...');

  await prisma.reward.create({
    data: {
      name: 'Baño Gratis',
      description: 'Un baño completo gratis para tu mascota',
      costPoints: 500,
    },
  });

  await prisma.reward.create({
    data: {
      name: '20% Descuento en Consulta',
      description: 'Descuento del 20% en tu próxima consulta',
      costPoints: 300,
    },
  });

  await prisma.reward.create({
    data: {
      name: 'Bolsa de Alimento Premium',
      description: 'Bolsa de 3kg de alimento premium',
      costPoints: 800,
    },
  });

  await prisma.reward.create({
    data: {
      name: 'Vacuna Gratis',
      description: 'Una vacuna a elección sin cargo',
      costPoints: 600,
    },
  });

  // ============================================
  // CREATE POINT TRANSACTIONS
  // ============================================
  console.log('💰 Creating point transactions...');

  await prisma.pointTransaction.create({
    data: {
      consumerId: consumer1.id,
      amount: 100,
      type: 'EARNED_SERVICE',
      description: 'Puntos por consulta general',
    },
  });

  await prisma.pointTransaction.create({
    data: {
      consumerId: consumer1.id,
      amount: 150,
      type: 'EARNED_SERVICE',
      description: 'Puntos por vacunación',
    },
  });

  await prisma.pointTransaction.create({
    data: {
      consumerId: consumer2.id,
      amount: 200,
      type: 'EARNED_SERVICE',
      description: 'Puntos por peluquería canina',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('📧 Test accounts created:');
  console.log('   Consumer: maria.perez@email.com / password123');
  console.log('   Consumer: juan.rodriguez@email.com / password123');
  console.log('   Clinic Admin: admin@patitasfelices.com / password123');
  console.log('   Clinic Admin: admin@hospitalvet.com / password123');
  console.log('   Freelancer: dr.carlos@email.com / password123');
  console.log('   Freelancer: dra.maria@email.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
