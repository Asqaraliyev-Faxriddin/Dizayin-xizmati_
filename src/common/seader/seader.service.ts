import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  async seedUsers() {
    // 🔹 Admin
    const adminPassword = await bcrypt.hash('12345678', 10);
    await this.prisma.user.upsert({
      where: { email: 'inomjontoychiyev@gmail.com' },
      update: {
        FirstName: 'Inomjon',
        LastName: "To'ychiyev",
        role: 'ADMIN',
        password: adminPassword,
      },
      create: {
        FirstName: 'Inomjon',
        LastName: "To'ychiyev",
        role: 'ADMIN',
        email: 'inomjontoychiyev@gmail.com',
        password: adminPassword,
      },
    });
    console.log('🚀 Admin user created/updated');

    // 🔹 Oddiy user
    const userPassword = await bcrypt.hash('user1234', 10);
    await this.prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {
        FirstName: 'John',
        LastName: 'Doe',
        role: 'USER',
        password: userPassword,
      },
      create: {
        FirstName: 'John',
        LastName: 'Doe',
        role: 'USER',
        email: 'user@example.com',
        password: userPassword,
      },
    });
    console.log('👤 ADMIN,USER Yaratildi.✔✔✔😁😁');
  }
}
