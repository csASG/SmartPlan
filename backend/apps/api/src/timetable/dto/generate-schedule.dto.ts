import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

class TeacherDto {
  @IsInt()
  id!: number;
}

class ClassDto {
  @IsInt()
  id!: number;
}

class RoomDto {
  @IsInt()
  id!: number;
}

class SlotDto {
  @IsInt()
  id!: number;
}

class RequirementDto {
  @IsInt()
  teacherId!: number;

  @IsInt()
  classId!: number;

  @IsInt()
  subjectId!: number;

  @IsInt()
  @Min(1)
  hoursPerWeek!: number;
}

export class GenerateScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeacherDto)
  teachers!: TeacherDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClassDto)
  classes!: ClassDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  rooms!: RoomDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlotDto)
  slots!: SlotDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequirementDto)
  requirements!: RequirementDto[];
}
