import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { BoardsService } from './boards.service';

@Controller()
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  getHello(): string {
    return this.boardsService.getHello();
  }

  @MessagePattern('boards_get', Transport.RMQ)
  async fetchBoards() {
    const { data } = await this.boardsService.getBoards();

    return {
      notice: 'boards_get event Received',
      data: data,
    };
  }

  @MessagePattern('board_get_by_id', Transport.RMQ)
  async fetchBoard(@Payload() payloadData: { board_id: number }) {
    const { data } = await this.boardsService.getBoard(payloadData);

    return {
      notice: 'board_get event Received',
      data: data,
    };
  }
}
