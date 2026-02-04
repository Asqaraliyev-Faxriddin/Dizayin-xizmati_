import { Global, Module } from '@nestjs/common';
import { MailerModule as NestMalierModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { strict } from 'assert';
import { MailerService } from './mailer.service';
@Global()
@Module({
  imports:[
    NestMalierModule.forRoot({
      transport:{
        service:'gmail',
        auth:{
          user:`${process.env.EMAIL_USER}`,
          pass:`${process.env.EMAIL_PASS}`
        }
      },

      defaults:{
        from:`Dizayin xizmati ("Inomjon Group") <${process.env.EMAIL_USER}>`
      },

      template:{
        dir:join(process.cwd(),'src','templates'),
        adapter:new HandlebarsAdapter(),
        options:{
          strict:true
        }
      }
    })
  ],
providers:[MailerService],
exports:[MailerService]

})
export class MailerModule {}
