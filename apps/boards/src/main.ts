import { NestFactory } from '@nestjs/core';
import { BoardsModule } from './boards.module';
import { RmqOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(BoardsModule);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'reproduce_queue',
    },
  });

  await app.startAllMicroservices();

  await app.listen(3001, () => {
    console.log(`Listening on 3001`);
  });
}
bootstrap();
