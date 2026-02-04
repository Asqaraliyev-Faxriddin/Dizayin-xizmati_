import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from './common/config/swagger';
import 'dotenv/config';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);




    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, documentFactory);

    console.log("Server is running: http://localhost:" + (process.env.PORT ?? 4000));
    
    app.enableCors()

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
