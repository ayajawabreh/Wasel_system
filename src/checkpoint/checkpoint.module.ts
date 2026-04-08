import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckpointService } from './checkpoint.service';
import { CheckpointController } from './checkpoint.controller';
import { Checkpoint } from './entities/checkpoint.entity';
import { CheckpointStatusHistory } from './entities/checkpoint-status-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checkpoint, CheckpointStatusHistory])],
  controllers: [CheckpointController],
  providers: [CheckpointService],
  exports: [CheckpointService],
})
export class CheckpointModule {}