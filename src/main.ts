import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { RmqService } from 'future-connectors';
import { AppModule } from './app.module';
import { ORDER } from './constants';

interface ICorsOption {
  origin: (string | RegExp)[];
  methods: string;
  preflightContinue: boolean;
  optionsSuccessStatus: number;
  credentials: boolean;
}

const corsOption: ICorsOption = {
  origin: ['http://localhost:3000'],
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOption);
  app.use(helmet());

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(ORDER));
  await app.startAllMicroservices();
  await app.listen(7000);
}
bootstrap();
