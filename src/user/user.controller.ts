<<<<<<< HEAD
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
=======
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
>>>>>>> 45aef09 (my work before pull)
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

<<<<<<< HEAD
  @Post()
  create(@Body() body: { name: string; email: string; password: string; role?: string }) {
    return this.userService.create(body.name, body.email, body.password, body.role);
  }

=======
>>>>>>> 45aef09 (my work before pull)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

<<<<<<< HEAD
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ name: string; email: string; password: string; role: string }>,
  ) {
    return this.userService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
=======
  @Post()
  create(@Body() body: any) {
    return this.userService.create(body);
  }
>>>>>>> 45aef09 (my work before pull)
}