import { Injectable } from '@nestjs/common';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { PrismaService } from '../prisma.service';
import axios from 'axios';

@Injectable()
export class TimetableService {
  constructor(private prisma: PrismaService) {}

  async create(createTimetableDto: CreateTimetableDto) {
    return this.prisma.timetableEntry.create({
      data: createTimetableDto as any,
    });
  }

  async findAll() {
    return this.prisma.timetableEntry.findMany({
      include: {
        class: true,
        subject: true,
        teacher: true,
        room: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.timetableEntry.findUnique({
      where: { id },
      include: {
        class: true,
        subject: true,
        teacher: true,
        room: true,
      },
    });
  }

  async update(id: number, updateTimetableDto: UpdateTimetableDto) {
    return this.prisma.timetableEntry.update({
      where: { id },
      data: updateTimetableDto as any,
    });
  }

  async remove(id: number) {
    return this.prisma.timetableEntry.delete({
      where: { id },
    });
  }

  async generateSchedule(payload: Record<string, any>) {
    const schedulerUrl = process.env.SCHEDULER_URL ?? 'http://scheduler:8000/solve';

    try {
      const response = await axios.post(schedulerUrl, payload, {
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `Scheduler request failed: ${error.response.status} ${error.response.statusText}`,
        );
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Scheduler request error: ${errorMessage}`);
    }
  }

  async generateScheduleFromDb() {
    const [teachers, classes, rooms, timetableEntries] = await Promise.all([
      this.prisma.teacher.findMany(),
      this.prisma.class.findMany(),
      this.prisma.room.findMany(),
      this.prisma.timetableEntry.findMany({
        select: {
          teacherId: true,
          classId: true,
          subjectId: true,
        },
      }),
    ]);

    if (teachers.length === 0 || classes.length === 0 || rooms.length === 0) {
      throw new Error(
        'Bitte lege zuerst Lehrkräfte, Klassen und Räume in der Datenbank an.',
      );
    }

    if (timetableEntries.length === 0) {
      throw new Error(
        'Keine Stundenplan-Einträge gefunden. Lege zuerst Einträge an oder nutze den generischen Scheduler-Endpoint mit eigener Payload.',
      );
    }

    const requirementMap = new Map<
      string,
      {
        teacherId: number;
        classId: number;
        subjectId: number;
        hoursPerWeek: number;
      }
    >();

    for (const entry of timetableEntries) {
      if (!entry.teacherId || !entry.classId || !entry.subjectId) {
        continue;
      }
      const key = `${entry.teacherId}:${entry.classId}:${entry.subjectId}`;
      const existing = requirementMap.get(key);
      if (existing) {
        existing.hoursPerWeek += 1;
      } else {
        requirementMap.set(key, {
          teacherId: entry.teacherId,
          classId: entry.classId,
          subjectId: entry.subjectId,
          hoursPerWeek: 1,
        });
      }
    }

    if (requirementMap.size === 0) {
      throw new Error(
        'Die Stundenplan-Einträge enthalten keine vollständigen Lehrer-/Klassen-/Fach-Zuordnungen.',
      );
    }

    const payload = {
      teachers: teachers.map((teacher) => ({ id: teacher.id })),
      classes: classes.map((cls) => ({ id: cls.id })),
      rooms: rooms.map((room) => ({ id: room.id })),
      slots: Array.from({ length: 40 }, (_, index) => ({ id: index + 1 })),
      requirements: Array.from(requirementMap.values()),
    };

    return this.generateSchedule(payload);
  }
}
