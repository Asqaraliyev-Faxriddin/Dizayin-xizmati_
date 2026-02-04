import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateRasmlarDto } from './dto/create-rasmlar.dto';
import { UpdateRasmlarDto } from './dto/update-rasmlar.dto';


function parseBoolean(value?: string | boolean): boolean {
  if (typeof value === 'boolean') return value; // agar boolean bo'lsa shu qiymat
  if (typeof value === 'string') return value.toLowerCase() === 'true'; // string bo'lsa
  return false; // undefined yoki boshqa holatlar uchun default false
}

@Injectable()
export class RasmlarService {
  constructor(private prisma: PrismaService) {}

  // ===============================
  // RASM YARATISH
  // ===============================
  async create(userId: string, payload: CreateRasmlarDto, avatarUrl?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const isPaidBoolean = parseBoolean(payload.isPaid);


    const rasm = await this.prisma.rasmlar.create({
      data: {
        title: payload.title,
        imageUrl: avatarUrl ?? '',
        isPaid: isPaidBoolean,
        userId,
      },
    });

    return { message: 'Rasm created successfully', data: rasm };
  }

  // ===============================
  // USER / ADMIN: RASMLARNI OLISH
  // ===============================
  async findAllForUser(userId: string, role: 'ADMIN' | 'USER') {
    if (role === 'ADMIN') {
      const rasmlar = await this.prisma.rasmlar.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return rasmlar.map((r) => ({
        id: r.id,
        title: r.title,
        imageUrl: r.imageUrl,
        isPaid: r.isPaid,
        canDownload: true, // admin hammasini yuklab oladi
      }));
    }

    // USER — free + access bo‘lgan rasmlar
    const rasmlar = await this.prisma.rasmlar.findMany({
      include: {
        accesses: {
          where: { userId },
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rasmlar.map((r) => {
      const hasAccess = r.accesses.length > 0;
      return {
        id: r.id,
        title: r.title,
        imageUrl: r.imageUrl,
        isPaid: r.isPaid,
        canDownload: !r.isPaid || hasAccess,
      };
    });
  }

  // ===============================
  // FAOL RASMLAR (FREE)
  // ===============================
  async publicRasmlar() {
    return this.prisma.rasmlar.findMany({
      where: { isPaid: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ===============================
  // ADMIN: PAID / FREE O‘ZGARTIRISH
  // ===============================
  async setPaidStatus(adminId: string, rasmId: number, isPaid: boolean) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });

    if (!admin || admin.role !== 'ADMIN')
      throw new ForbiddenException('Only admin can do this');

    const rasm = await this.prisma.rasmlar.findUnique({ where: { id: rasmId } });

    if (!rasm) throw new NotFoundException('Rasm not found');

    return this.prisma.rasmlar.update({
      where: { id: Number(rasmId) },
      data: { isPaid },
    });
  }

  // ===============================
  // ADMIN: USERGA RUXSAT BERISH
  // ===============================


  async grantAccess(adminId: string, userId: string, rasmId: number) {
    // 1️⃣ Admin tekshirish
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN')
      throw new ForbiddenException('Only admin can grant access');
  
    // 2️⃣ User tekshirish
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
  
    // 3️⃣ Rasm tekshirish
    const rasm = await this.prisma.rasmlar.findUnique({ where: { id: rasmId } });
    if (!rasm) throw new NotFoundException('Rasm not found');
  
    // 4️⃣ RasmlarAccess yaratish
    return this.prisma.rasmlarAccess.create({
      data: {
        userId,
        rasmId,
        grantedBy: adminId,
      },
    });
  }
  

  // ===============================
  // ADMIN: RASMI O‘CHIRISH
  // ===============================
  async delete(adminId: string, rasmId: number) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });

    if (!admin || admin.role !== 'ADMIN')
      throw new ForbiddenException('Only admin can delete rasmlar');

    // accesslarni o‘chirish
    await this.prisma.rasmlarAccess.deleteMany({ where: { rasmId:Number(rasmId) } });

    // rasmni o‘chirish
    return this.prisma.rasmlar.delete({ where: { id: Number(rasmId) } });
  }

  // ===============================
  // ADMIN / USER: RASM UPDATE
  // ===============================
  async update(userId: string, rasmId: number, payload: UpdateRasmlarDto) {
    const rasm = await this.prisma.rasmlar.findUnique({ where: { id: Number(rasmId) } });

    if (!rasm) throw new NotFoundException('Rasm not found');

    // Faqat ADMIN yoki rasm egasi update qilishi mumkin
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('Not allowed');

    if (user.role !== 'ADMIN' && rasm.userId !== userId)
      throw new ForbiddenException('Not allowed');

    return this.prisma.rasmlar.update({
      where: { id: Number(rasmId) },
      data: {
        title: payload.title ?? rasm.title,
        isPaid: payload.isPaid ?? rasm.isPaid,
      },
    });
  }
}
