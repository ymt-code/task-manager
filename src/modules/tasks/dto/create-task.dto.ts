import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Learning NestJS' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({ example: 'CRUD and Auth testing' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'false' })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
