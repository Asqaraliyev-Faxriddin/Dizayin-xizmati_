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
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.gurads';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import * as FormData from 'form-data';
import axios from 'axios';


import { createClient } from '@supabase/supabase-js';

interface ImgBBResponse {
  data: {
    url: string;
    display_url: string;
    // boshqa kerakli maydonlar ham bor, hozir bizga faqat url kerak
  };
  success: boolean;
  status: number;
}

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ✅ Get my profile
  @UseGuards(AuthGuard)
  @Get('me')
  myProfile(@Req() req) {
    return this.profileService.myProfile(req.user.id);
  }


  @UseGuards(AuthGuard)
  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update profile data',
    type: UpdateProfileDto,
  })
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req,
  ) {
    let avatarUrl: string | undefined = undefined;
  
    if (avatar) {
      try {
        const imgbbApiKey = 'e656f8efdb2d1fda3d04a92afad14570';
        const formData = new FormData();
  
        // Base64 formatga o‘tkazish
        const base64Image = avatar.buffer.toString('base64');
        formData.append('image', base64Image);
  
        // POST request
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData, {
          headers: formData.getHeaders(),
        });
  
        // Type assertion bilan javobni ImgBBResponse turiga o'tkazish
        const data = response.data as ImgBBResponse;
  
        if (!data.success) {
          throw new Error('ImgBB upload failed');
        }
  
        avatarUrl = data.data.url; // public URL
      } catch (error: any) {
        console.error('ImgBB upload error:', error.response?.data || error.message);
        throw new BadRequestException(
          `Avatar upload failed: ${error.response?.data?.error?.message || error.message}`,
        );
      }
    }
  
    return this.profileService.updateProfile(req.user.id, updateProfileDto, avatarUrl);
  }
  

  // ✅ Delete profile
  @UseGuards(AuthGuard)
  @Delete()
  remove(@Req() req) {
    return this.profileService.DeleteProfile(req.user.id);
  }
}
