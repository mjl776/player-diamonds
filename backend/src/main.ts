import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  BigInt.prototype['toJSON'] = function () {
    return this.toString();
  };
  app.enableCors({ origin: ['http://localhost:3000', 'https://playerdiamonds.com', 'https://www.playerdiamonds.com'] });
  await app.listen(port, "0.0.0.0");
}
bootstrap();
