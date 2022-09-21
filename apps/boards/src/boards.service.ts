import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, Observable, of } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class BoardsService {
  constructor(private readonly httpService: HttpService) {}
  getHello(): string {
    return 'Hello World!';
  }

  getBoards(): Promise<AxiosResponse> {
    return lastValueFrom(
      this.httpService.get(`https://jsonplaceholder.typicode.com/todos`),
    );
  }

  getBoard({ board_id }: { board_id?: number }) {
    return lastValueFrom(
      this.httpService.get(
        `https://jsonplaceholder.typicode.com/todos/${board_id}`,
      ),
    );
  }
}
