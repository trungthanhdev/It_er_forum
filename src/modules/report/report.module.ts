import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { BlacklistModule } from '../blacklist/blacklist.module';

@Module({
  imports : [TypeOrmModule.forFeature([Report]),
            PostModule,
            UserModule,
            BlacklistModule
            ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
