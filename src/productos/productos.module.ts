import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { precioSchema, Producto ,productoSchema} from './schema/producto.schema';
import { Precio } from 'src/schema';


@Module({
  imports:[
      MongooseModule.forFeature([{
        name:Producto.name , schema:productoSchema
      },
      {
        name:Precio.name , schema:precioSchema
      }
    
    ])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
