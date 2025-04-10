import { Module } from '@nestjs/common';
import { PreciosRecetaService } from './precios-receta.service';
import { PreciosRecetaController } from './precios-receta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PrecioReceta, precioRecetaSchema } from './schema/precios-receta.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name:PrecioReceta.name , schema:precioRecetaSchema
    }])
  ],
  controllers: [PreciosRecetaController],
  providers: [PreciosRecetaService],
})
export class PreciosRecetaModule {}
