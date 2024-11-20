import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { strict } from "assert";
import { Types } from "mongoose";
import { types } from "util";
import { PrecioI } from "./interface";

@Schema({collection:'Lente'})
export class Lente{
  @Prop()
  flag:string
}

export const LentesSchema= SchemaFactory.createForClass(Lente)


@Schema({collection:'Stock'})
export class Stock{
  @Prop()
  cantidad:number
  @Prop()
  cantidad2:number
  @Prop({type:Types.ObjectId})
  lente:Types.ObjectId
  @Prop({type:Types.ObjectId})
  almacen:Types.ObjectId
  @Prop()
  flag:string
}

export const StockSchema= SchemaFactory.createForClass(Stock)

@Schema()
export class TotalStock{
    @Prop()
    almacen:Types.ObjectId
    @Prop()
    cantidad:number
    @Prop()
    lente:Types.ObjectId
    @Prop()
    tipo: string;     
    @Prop()    
    flag: string;
    @Prop({type:Date, default:Date.now()})
    fecha:Date
}

export const TotalStockSchema = SchemaFactory.createForClass(TotalStock)


@Schema({collection:'Venta'})
export class Venta{
  @Prop()
  lente1:Types.ObjectId

  @Prop()
  lente2:Types.ObjectId
}

export const VentaSchema=SchemaFactory.createForClass(Venta)


@Schema({collection:'SalidaLente'})
export class SalidadLente{
  @Prop({type:Types.ObjectId, ref:'Lente'} )
  lente:Types.ObjectId
}

export const SalidadLenteSchema=SchemaFactory.createForClass(SalidadLente)







//----------------------------------------

@Schema({collection:'users'})
export class Users{
  @Prop()
  nombre:string
  @Prop()
  username:string
  @Prop()
  ap_paterno:string
  @Prop()
  ap_materno:string
  @Prop({type:Types.ObjectId, ref:'UbicacionTrabajo'})
  ubicacionTrabajo:Types.ObjectId  
  @Prop()
  isActive:boolean

  
  @Prop()
  tipo:string


  @Prop()
  flag:string  
}


export const userSchema=SchemaFactory.createForClass(Users)




@Schema({ collection: 'Cliente' })
export class Cliente  {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  ci: string;

  @Prop({ required: true })
  ap_paterno: string;

  @Prop({ required: true })
  ap_materno: string;

  @Prop({ required: true })
  celular: string;

  @Prop()
  nit?: string;

  @Prop()
  email?: string;

  @Prop()
  telefono?: string;

  @Prop({ required: true })
  fecha_nacimiento: Date;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  flag: string;

  @Prop({ required: true })
  codPais: string;

  @Prop({ required: true })
  celularCompleto: string;

  @Prop({ required: true })
  sexo: string;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);

export interface Precio {
  genero: string;
  categoria: string;
  codigoQR: string;
  correlativo: number;
}


@Schema({ collection: 'Producto' })
export class Producto {
  @Prop({ required: true })
  tipoProducto: string; 

  @Prop({ required: true })
  marca: string; 

  @Prop({ required: true })
  color: string; 

  @Prop({ required: true })
  serie: string; // "A666"

  @Prop({ required: true })
  tipoMontura: string; 

  @Prop({ required: true })
  flag: string; 

  @Prop({ required: true })
  estuchePropio: boolean; 

  @Prop({ required: true })
  correlativo: number; 

  @Prop({ required: true })
  
    codigoQR: string; 


  @Prop()
  precios: PrecioI[];
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);



@Schema({ collection: 'Precio' })
export class Precio {

  
  @Prop({ required: true })
  tipo: string; 

  @Prop({ required: true })
  abreviatura: string; 

  @Prop({ required: true })
  factura: string; 

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  orden: string; 

  @Prop({ required: true })
  flag: string; 

}

export const PrecioSchema = SchemaFactory.createForClass(Precio);



@Schema({ collection: 'Sucursal' })
export class Sucursal {

  
  @Prop({ required: true })
  nombre: string; 

  @Prop({ required: true })
  precios: string[]; 

  @Prop({ required: true })
  empresa: Types.ObjectId; 

  @Prop({ required: true })
  flag: string; 

}

export const sucursalSchema = SchemaFactory.createForClass(Sucursal);

@Schema({ collection: 'UbicacionTrabajo' })
export class UbicacionTrabajo {  
  @Prop({ required: true })
  nombre: string; 

  @Prop({ required: true })
  flag: string; 

}

export const UbicacionTrabajoSchema = SchemaFactory.createForClass(UbicacionTrabajo);