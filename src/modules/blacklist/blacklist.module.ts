import { Module } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { BlacklistController } from './blacklist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvalidTokenEntity } from './entities/invalidatedToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvalidTokenEntity])],
  controllers: [BlacklistController],
  providers: [BlacklistService],
  exports: [BlacklistService]
})
export class BlacklistModule {}
