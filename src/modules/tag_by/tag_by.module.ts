import { Module } from '@nestjs/common';
import { TagByService } from './tag_by.service';
import { TagByController } from './tag_by.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagedByEntity } from './entities/Taged_by.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagedByEntity])],
  controllers: [TagByController],
  providers: [TagByService],
})
export class TagByModule {}
