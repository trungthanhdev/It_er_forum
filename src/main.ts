import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from 'filter/httpException.interceptor';
import { ResponseStandardInterceptor } from 'interceptor/responseStandardization.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('It_er forum API')
    .setDescription('API for Admin only!')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseStandardInterceptor());
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();