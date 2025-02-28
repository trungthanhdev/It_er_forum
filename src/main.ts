import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
    methods: 'GET,POST,PUT,DELETE,OPTIONS', 
    allowedHeaders: 'Content-Type, Authorization',
  }); 

// 
  const options = new DocumentBuilder()
  .setTitle('API Example')
  .setDescription('Mô tả chi tiết API của ứng dụng')
  .setVersion('1.0')
  .addTag('example')
  .build();
  
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document); // Đường dẫn để truy cập Swagger UI

// 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();




