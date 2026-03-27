import { Module } from '@nestjs/common';
import { PreciosRecetaService } from './precios-receta.service';
import { PreciosRecetaController } from './precios-receta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ColorLente,
  ColorLenteSchema,
  LenteSchema,
  MapRecetaNovar,
  MapRecetaNovaraSchema,
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
  Lente,
  LenteCombinacion,
  LenteCombinacionSchema,
  Marca,
  MarcaSchema,
  Empresa,
  EmpresaSchema,
  DetalleRecetaNovarSchema,
  DetalleRecetaNovar,
  CategoriaMarca,
  CategoriaMarcaSchema
} from './schema/precios-receta.schema';
import { Precio } from 'src/schema';
import { precioSchema } from 'src/productos/schema/producto.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
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
      { name: MapRecetaNovar.name, schema: MapRecetaNovaraSchema },
      { name: Lente.name, schema: LenteSchema },
      { name: LenteCombinacion.name, schema: LenteCombinacionSchema },
      { name: Marca.name, schema: MarcaSchema },
      { name: Empresa.name, schema: EmpresaSchema },
      { name: DetalleRecetaNovar.name, schema: DetalleRecetaNovarSchema },
      { name: CategoriaMarca.name, schema: CategoriaMarcaSchema },
    ]),
  ],
  controllers: [PreciosRecetaController],
  providers: [PreciosRecetaService],
})
export class PreciosRecetaModule { }
