import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Cliente, ClienteSchema, Precio, PrecioSchema, Producto, ProductoSchema, SalidadLente, SalidadLenteSchema, Stock, StockSchema, Sucursal, sucursalSchema, TotalStock, TotalStockSchema, UbicacionTrabajo, UbicacionTrabajoSchema, Users, userSchema, Venta, VentaSchema } from './schema';
import { UserService } from './user.service';
import { ClienteService } from './cliente.service';
import { ProductosService } from './productos.service';
import { PreciosRecetaModule } from './precios-receta/precios-receta.module';
import { ProductosModule } from './productos/productos.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://kanna:kanna@localhost:27017/oc09022026?authSource=admin'),
    MongooseModule.forFeature([
     /* {name:Lente.name, schema:LentesSchema}*/,
      {name:Stock.name, schema:StockSchema},
      {name:TotalStock.name, schema:TotalStockSchema},
      {name:Venta.name, schema:VentaSchema},
      {name:SalidadLente.name, schema:SalidadLenteSchema},
      {name:Users.name, schema:userSchema},
      {name:Cliente.name, schema:ClienteSchema},
      {name:Producto.name, schema:ProductoSchema},
      {name:Precio.name, schema:PrecioSchema},
      {name:Sucursal.name, schema:sucursalSchema},
      {name:UbicacionTrabajo.name, schema:UbicacionTrabajoSchema}
    ]),
    PreciosRecetaModule,
    ProductosModule
  ],
  controllers: [AppController],
  providers: [AppService, UserService, ClienteService, ProductosService],
})
export class AppModule {}
