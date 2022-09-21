import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { AppService } from './app.service';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('boards_service') private readonly boardsClient: ClientRMQ,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('boards')
  async getboards() {
    const { data } = await lastValueFrom(
      this.boardsClient.send<
        { data: Record<string, unknown> },
        { board_id: number }
      >('boards_get', {
        board_id: 1,
      }),
    );

    return { notice: 'Boards Fetched', data };
  }

  @Get('boards/:id')
  async getboard(@Param('id') board_id: number) {
    const { data } = await lastValueFrom(
      this.boardsClient.send<
        { data: Record<string, unknown> },
        { board_id: number }
      >('board_get_by_id', {
        board_id,
      }),
    );

    return { notice: 'Board Fetched', data };
  }
}
