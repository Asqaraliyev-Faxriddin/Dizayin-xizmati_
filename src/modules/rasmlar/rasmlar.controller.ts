import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Post,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import * as FormData from 'form-data';
import axios from 'axios';

import { RasmlarService } from './rasmlar.service';
import { CreateRasmlarDto } from './dto/create-rasmlar.dto';
import { UpdateRasmlarDto } from './dto/update-rasmlar.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.gurads';
import { Roles } from 'src/common/decorators/role';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';

interface ImgBBResponse {
  data: {
    url: string;
    display_url: string;
  };
  success: boolean;
  status: number;
}

@ApiTags('Rasmlar')
@ApiBearerAuth()
@Controller('rasmlar')
export class RasmlarController {
  constructor(private readonly rasmlarService: RasmlarService) {}

  // ===============================
  // 1️⃣ Admin: rasm yaratish
  // ===============================
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateRasmlarDto })
  async create(
    @Body() payload: CreateRasmlarDto,
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req,
  ) {
    let avatarUrl: string | undefined;

    if (avatar) {
      try {
        const imgbbApiKey = 'e656f8efdb2d1fda3d04a92afad14570';
        const formData = new FormData();
        formData.append('image', avatar.buffer.toString('base64'));

        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          formData,
          { headers: formData.getHeaders() },
        );

        const data = response.data as ImgBBResponse;

        if (!data.success) throw new Error('ImgBB upload failed');

        avatarUrl = data.data.url;
      } catch (error: any) {
        console.error('ImgBB upload error:', error.response?.data || error.message);
        throw new BadRequestException(
          `Avatar upload failed: ${error.response?.data?.error?.message || error.message}`,
        );
      }
    }

    return this.rasmlarService.create(req.user.id, payload, avatarUrl);
  }

  // ===============================
  // 2️⃣ Rasm ro‘yxati (USER / ADMIN)
  // ===============================
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req) {
    return this.rasmlarService.findAllForUser(req.user.id, req.user.role);
  }

  // ===============================
  // 3️⃣ Admin: rasmni PAID / FREE qilish
  // ===============================
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id/paid')
  async setPaidStatus(
    @Param('id') rasmId: number,
    @Body('isPaid') isPaid: boolean,
    @Req() req,
  ) {
    return this.rasmlarService.setPaidStatus(req.user.id, Number(rasmId), isPaid);
  }

  // ===============================
  // 4️⃣ Admin: userga ruxsat berish
  // ===============================
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id/grant/:userId')
  async grantAccess(
    @Param('id') rasmId: number,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    return this.rasmlarService.grantAccess(req.user.id, userId, Number(rasmId));
  }

  // ===============================
  // 5️⃣ Admin: rasmni o‘chirish
  // ===============================
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') rasmId: number, @Req() req) {
    return this.rasmlarService.delete(req.user.id, Number(rasmId));
  }

  // ===============================
  // 6️⃣ Public (free) rasmlar
  // ===============================
  @Get('public')
  async publicRasmlar() {
    return this.rasmlarService.publicRasmlar();
  }

  // ===============================
  // 7️⃣ Rasmni update qilish (Admin / Rasm egasi)
  // ===============================
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') rasmId: number,
    @Body() payload: UpdateRasmlarDto,
    @Req() req,
  ) {
    return this.rasmlarService.update(req.user.id, Number(rasmId), payload);
  }
}
