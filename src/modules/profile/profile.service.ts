import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}
  
  async myProfile(userId: string) {

    let olduser = await this.prisma.user.findFirst({
      where:{
        id: userId
      },
      select:{
        id:true,
        FirstName:true,
        LastName:true,
        email:true,
        role:true,
        avatar_url:true,
        createdAt:true,
      }
    })

    if(!olduser) throw new NotFoundException("User not found")

      return {
        message:"Profile fetched successfully",
        data: olduser
      }

  }

  async DeleteProfile(userId: string) {
    let olduser = await this.prisma.user.findFirst({
      where:{
        id: userId
      }
    })

    if(!olduser) throw new NotFoundException("User not found")

      await this.prisma.user.delete({
        where:{
          id:userId
        }
      })

    return {
      message:"Profile deleted successfully"
    }
  }
  async updateProfile(userId: string, payload: UpdateProfileDto, avatar_url?: string) {
    // 1. User borligini tekshirish
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // 2. Update qilish uchun faqat kelgan maydonlarni tayyorlash
    const updateData: any = {};
  
    if (payload.email !== undefined) updateData.email = payload.email;
    if (payload.firstName !== undefined) updateData.FirstName = payload.firstName; // <-- Prisma field
    if (payload.lastName !== undefined) updateData.LastName = payload.lastName;   // <-- Prisma field
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
  
    // 3. Password kelgan bo‘lsa, hash qilib qo‘yish
    if (payload.password !== undefined) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(payload.password, salt);
    }
  
    // 4. Bazaga update
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}