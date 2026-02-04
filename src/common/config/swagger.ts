import { DocumentBuilder } from "@nestjs/swagger";

export const config = new DocumentBuilder()
    .setTitle('Fixoo example')
    .setDescription('The fixoo API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();   