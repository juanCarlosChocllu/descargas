import { Module } from '@nestjs/common';
import { PreciosRecetaService } from './precios-receta.service';
import { PreciosRecetaController } from './precios-receta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ColorLente,
  ColorLenteSchema,
  MarcaLente,
  MarcaLenteSchema,
  MaterialLentes,
  MaterialLentesSchema,
  PrecioReceta,
  precioRecetaSchema,
  Rango,
  RangoSchema,
  TipoColorLente,
  TipoColorLenteSchema,
  TipoLente,
  TipoLenteSchema,
  Tratamiento,
  tratamientoSchema,
} from './schema/precios-receta.schema';
import { Precio } from 'src/schema';
import { precioSchema } from 'src/productos/schema/producto.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PrecioReceta.name, schema: precioRecetaSchema },

      { name: MaterialLentes.name, schema: MaterialLentesSchema },
      { name: TipoLente.name, schema: TipoLenteSchema },
      { name: TipoColorLente.name, schema: TipoColorLenteSchema },
      { name: Tratamiento.name, schema: tratamientoSchema },
      { name: Rango.name, schema: RangoSchema },
      { name: MarcaLente.name, schema: MarcaLenteSchema },
      { name: ColorLente.name, schema: ColorLenteSchema },
      { name: Precio.name, schema: precioSchema },
    ]),
  ],
  controllers: [PreciosRecetaController],
  providers: [PreciosRecetaService],
})
export class PreciosRecetaModule {}
