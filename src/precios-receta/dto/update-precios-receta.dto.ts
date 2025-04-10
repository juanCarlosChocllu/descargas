import { PartialType } from '@nestjs/mapped-types';
import { CreatePreciosRecetaDto } from './create-precios-receta.dto';

export class UpdatePreciosRecetaDto extends PartialType(CreatePreciosRecetaDto) {}
