import { IsNumber } from 'class-validator';

export class PostHelper {
  @IsNumber()
  public pageSize: number;
  @IsNumber()
  public pageNumber: number;
}
