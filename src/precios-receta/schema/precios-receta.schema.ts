import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'PrecioReceta' })
export class PrecioReceta {
  @Prop()
  _id: Types.ObjectId;
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