import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  create(createTeacherDto: CreateTeacherDto) {
    return this.prisma.teacher.create({
      data: createTeacherDto as any,
    });
  }

  findAll() {
    return this.prisma.teacher.findMany({
      include: { user: true },
    });
  }

  findOne(id: number) {
    return this.prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return this.prisma.teacher.update({
      where: { id },
      data: updateTeacherDto as any,
    });
  }

  remove(id: number) {
    return this.prisma.teacher.delete({
      where: { id },
    });
  }
}
