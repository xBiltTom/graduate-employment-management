import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MinLength,
  Min,
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

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EGRESADO)
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  telefono?: string;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EGRESADO)
  @IsOptional()
  @IsUUID()
  carreraId?: string;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EGRESADO)
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === '' || value === null || value === undefined ? undefined : Number(value),
  )
  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear() + 10)
  anioEgreso?: number;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EGRESADO)
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  habilidadIds?: string[];

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

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EMPRESA)
  @IsOptional()
  @IsUUID()
  sectorId?: string;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EMPRESA)
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  telefono?: string;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EMPRESA)
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  sitioWeb?: string;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EMPRESA)
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  ciudad?: string;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EMPRESA)
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  region?: string;

  @ValidateIf((object: RegisterDto) => object.rol === RolUsuario.EMPRESA)
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  descripcion?: string;
}
