import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api'); //le agrega el prefijo api a todas las rutas

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // convierte el objeto recibido a la instancia del DTO
      transformOptions: {
        enableImplicitConversion: true, // infiere el tipo de cada propiedad según su tipo en TypeScript (evita usar @Type())
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`App is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
