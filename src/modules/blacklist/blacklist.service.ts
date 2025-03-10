import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvalidTokenEntity } from './entities/invalidatedToken.entity';
import { Repository } from 'typeorm';
import { BlacklistDto } from 'dto/blacklist.dto';
import { ref } from '@hapi/joi';
import { UserService } from '../user/user.service';

@Injectable()
export class BlacklistService {
    constructor(
        @InjectRepository(InvalidTokenEntity)
        private readonly rfTokenRepo : Repository<InvalidTokenEntity>,
        // private readonly userRepo: UserService
    ){}

    async addToBlacklist(object: BlacklistDto){
        const refreshToken = this.rfTokenRepo.create(object)
        // console.log("object from blacklistService:", object);
        return await this.rfTokenRepo.save(refreshToken)
    }
}
