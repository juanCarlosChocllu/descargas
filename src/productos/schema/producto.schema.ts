import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';



@Schema({collection:'Precio'})
export class Precio {
  
tipo:string
abreviatura:string
factura:boolean
flag:string
nombre:string

tipoPrecio:string[]
orden:number
mandatorio:boolean
}
export const precioSchema = SchemaFactory.createForClass(Precio)

@Schema({collection:'Producto'})
export class Producto {
  @Prop()
  _id: Types.ObjectId;
  @Prop()
  tipoProducto: string;
  @Prop()
  marca: Types.ObjectId;
  @Prop()
  color: Types.ObjectId;
  @Prop()
  serie: string;
  @Prop()
  tipoMontura: Types.ObjectId;
  @Prop()
  flag: string;
  @Prop()
  estuchePropio: boolean;
  @Prop()
  precios: [
    {
      tipoPrecio: Types.ObjectId;
      precio: number;
      tipoProducto: string;
      flag: string;
    },
  ];
  @Prop()
  tamano: string;
  @Prop()
  descripcion: string;
  @Prop()
  genero: string;
  @Prop()
  categoria: string;
  @Prop()
  codigoQR: string;
}
export const productoSchema = SchemaFactory.createForClass(Producto)