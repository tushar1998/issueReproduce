import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from 'apps/api/src/app.module';
import { INestApplication } from '@nestjs/common';
import { ClientRMQ, RmqOptions, Transport } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BoardsModule } from 'apps/boards/src/boards.module';

describe('Test Microservice', () => {
  let app: INestApplication;
  let boardsClient: ClientRMQ;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, BoardsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    app.connectMicroservice<RmqOptions>({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'reproduce_queue',
      },
    });

    boardsClient = moduleFixture.get('boards_service');
    app.startAllMicroservices();

    boardsClient.connect();
  });

  it('Get Boards', async () => {
    const response = await lastValueFrom(
      boardsClient.send('boards_get', {
        board_id: 1,
      }),
    );

    expect(response.notice).toEqual('boards_get event Received');
    expect(response.data.length).toEqual(200);
  });

  it('Get Boards By Id', async () => {
    const response = await lastValueFrom(
      boardsClient.send('board_get_by_id', {
        board_id: 2,
      }),
    );

    expect(response.notice).toEqual('board_get event Received');
    expect(response.data.length).toEqual(200);
  });

  afterAll(async () => {
    boardsClient.close();
    await app.close();
  });
});
