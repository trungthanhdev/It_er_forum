import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refreshtoken.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlacklistService {
    constructor(
        @InjectRepository(RefreshTokenEntity)
        private readonly rfTokenRepo : Repository<RefreshTokenEntity>
    ){}

    async addToBlacklist(refreshtoken_id: string){
        let newRefreshToken = new RefreshTokenEntity()
        newRefreshToken.refreshtoken_id = refreshtoken_id
        return await this.rfTokenRepo.save(newRefreshToken)
    }
}
