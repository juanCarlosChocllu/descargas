import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'PrecioReceta' })
export class PrecioReceta {
  /*@Prop()
  _id?: Types.ObjectId;*/
  @Prop()
  materiallente: Types.ObjectId;
  @Prop()
  tipolente: Types.ObjectId;
  @Prop()
  rango: Types.ObjectId;
  @Prop()
  tipocolorlente: Types.ObjectId;
  @Prop()
  colorlente: Types.ObjectId;
  @Prop()
  marcalente: Types.ObjectId;
  @Prop()
  tratamiento: Types.ObjectId;
  @Prop()
  precios: Types.ObjectId;
  @Prop()
  precio: Number;
  @Prop()
  flag: string;
}
export const precioRecetaSchema= SchemaFactory.createForClass(PrecioReceta)



@Schema({collection:'MaterialLentes'})
export class MaterialLentes {
    @Prop()
    nombre:string
}
export const MaterialLentesSchema= SchemaFactory.createForClass(MaterialLentes)


@Schema({collection:'TipoLente'})
export class TipoLente {
    @Prop()
    nombre:string
}
export const TipoLenteSchema= SchemaFactory.createForClass(TipoLente)


@Schema({collection:'TipoColorLente'})
export class TipoColorLente {
    @Prop()
    nombre:string
}
export const TipoColorLenteSchema= SchemaFactory.createForClass(TipoColorLente)


@Schema({collection:'Tratamiento'})
export class Tratamiento {
    @Prop()
    nombre:string
}
export const tratamientoSchema= SchemaFactory.createForClass(Tratamiento)



@Schema({collection:'Rango'})
export class Rango {
    @Prop()
    nombre:string
}
export const RangoSchema= SchemaFactory.createForClass(Rango)


@Schema({collection:'MarcaLente'})
export class MarcaLente {
    @Prop()
    nombre:string
}
export const MarcaLenteSchema= SchemaFactory.createForClass(MarcaLente)





@Schema({collection:'ColorLente'})
export class ColorLente {
    @Prop()
    nombre:string
}
export const ColorLenteSchema= SchemaFactory.createForClass(ColorLente)


@Schema({collection:'Precio'})
export class Precio {
    @Prop()
    nombre:string
}
export const PrecioSchema= SchemaFactory.createForClass(Precio)


