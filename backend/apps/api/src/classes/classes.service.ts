import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  create(createClassDto: CreateClassDto) {
    return this.prisma.class.create({
      data: createClassDto as any,
    });
  }

  findAll() {
    return this.prisma.class.findMany({
      include: { students: true },
    });
  }

  findOne(id: number) {
    return this.prisma.class.findUnique({
      where: { id },
      include: { students: true },
    });
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return this.prisma.class.update({
      where: { id },
      data: updateClassDto as any,
    });
  }

  remove(id: number) {
    return this.prisma.class.delete({
      where: { id },
    });
  }
}
