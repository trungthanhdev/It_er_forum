import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvalidTokenEntity } from './entities/refreshtoken.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlacklistService {
    constructor(
        @InjectRepository(InvalidTokenEntity)
        private readonly rfTokenRepo : Repository<InvalidTokenEntity>
    ){}

    async addToBlacklist(refreshtoken_id: string){
        return `abc`
    }
}
