import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './data-source';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Initialize the DataSource and run any pending migrations
  await AppDataSource.initialize();
  console.log('Data Source initialized.');

  await AppDataSource.runMigrations();
  console.log('Migrations executed.');

  // Create the NestJS app
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Coupon API')
    .setDescription('API documentation for the Coupon Service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the application
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
