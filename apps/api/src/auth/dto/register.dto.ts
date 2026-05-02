import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { RolUsuario } from '@graduate-employment-management/database';

export class RegisterDto {
  @IsEmail()
  @Transform(({ value }) => String(value).toLowerCase().trim())
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EGRESADO)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  nombres?: string;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EGRESADO)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  apellidos?: string;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EGRESADO)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  dni?: string;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EMPRESA)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  nombreComercial?: string;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EMPRESA)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  razonSocial?: string;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EMPRESA)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  ruc?: string;
}
