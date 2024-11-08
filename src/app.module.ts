import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Cliente, ClienteSchema, Lente, LentesSchema, Precio, PrecioSchema, Producto, ProductoSchema, SalidadLente, SalidadLenteSchema, Stock, StockSchema, Sucursal, sucursalSchema, TotalStock, TotalStockSchema, Users, userSchema, Venta, VentaSchema } from './schema';
import { UserService } from './user.service';
import { ClienteService } from './cliente.service';
import { ProductosService } from './productos.service';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nombre_bd'),
    MongooseModule.forFeature([
      {name:Lente.name, schema:LentesSchema},
      {name:Stock.name, schema:StockSchema},
      {name:TotalStock.name, schema:TotalStockSchema},
      {name:Venta.name, schema:VentaSchema},
      {name:SalidadLente.name, schema:SalidadLenteSchema},
      {name:Users.name, schema:userSchema},
      {name:Cliente.name, schema:ClienteSchema},
      {name:Producto.name, schema:ProductoSchema},
      {name:Precio.name, schema:PrecioSchema},
      {name:Sucursal.name, schema:sucursalSchema}
    ])
  ],
  controllers: [AppController],
  providers: [AppService, UserService, ClienteService, ProductosService],
})
export class AppModule {}
