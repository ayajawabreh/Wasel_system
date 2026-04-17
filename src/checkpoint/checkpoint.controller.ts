import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { CheckpointService } from './checkpoint.service';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
@Controller('checkpoints')
export class CheckpointController {
  constructor(private readonly checkpointService: CheckpointService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @Post()
  create(@Body() dto: CreateCheckpointDto) {
    return this.checkpointService.create(dto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.checkpointService.findAll(status, +page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkpointService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCheckpointDto) {
    return this.checkpointService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkpointService.remove(+id);
  }

  @Get(':id/history')
  getStatusHistory(@Param('id') id: string) {
    return this.checkpointService.getStatusHistory(+id);
  }
}