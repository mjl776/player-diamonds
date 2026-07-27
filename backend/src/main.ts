import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  BigInt.prototype['toJSON'] = function () {
    return this.toString();
  };
  app.enableCors({ origin: ['http://localhost:3000'] });
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
