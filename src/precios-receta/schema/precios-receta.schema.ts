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
  @Prop({ type: Date, default: () => Date.now() })
  fechains: Date;
  @Prop()
  estado: string;
}
export const precioRecetaSchema = SchemaFactory.createForClass(PrecioReceta);

@Schema({ collection: 'MaterialLentes' })
export class MaterialLentes {
  @Prop()
  nombre: string;
  @Prop()
  flag: string;

  @Prop()
  logistica: boolean
}
export const MaterialLentesSchema =
  SchemaFactory.createForClass(MaterialLentes);

@Schema({ collection: 'TipoLente' })
export class TipoLente {
  @Prop()
  nombre: string;
  @Prop()
  flag: string;

  @Prop()
  logistica: boolean
}
export const TipoLenteSchema = SchemaFactory.createForClass(TipoLente);

@Schema({ collection: 'TipoColorLente' })
export class TipoColorLente {
  @Prop()
  nombre: string;
  @Prop()
  flag: string;

  @Prop()
  logistica: boolean
}
export const TipoColorLenteSchema =
  SchemaFactory.createForClass(TipoColorLente);

@Schema({ collection: 'Tratamiento' })
export class Tratamiento {
  @Prop()
  nombre: string;
  @Prop()
  flag: string;
}
export const tratamientoSchema = SchemaFactory.createForClass(Tratamiento);

@Schema({ collection: 'Rango' })
export class Rango {
  @Prop()
  nombre: string;
  @Prop()
  flag: string;
}
export const RangoSchema = SchemaFactory.createForClass(Rango);

@Schema({ collection: 'MarcaLente' })
export class MarcaLente {
  @Prop()
  nombre: string;
  @Prop()
  flag: string;
}
export const MarcaLenteSchema = SchemaFactory.createForClass(MarcaLente);

@Schema({ collection: 'ColorLente' })
export class ColorLente {
  @Prop()
  nombre: string;
  @Prop()
  flag: string;

  @Prop()
  logistica: boolean
}
export const ColorLenteSchema = SchemaFactory.createForClass(ColorLente);

@Schema({ collection: 'Precio' })
export class Precio {
  @Prop()
  nombre: string;
}
export const PrecioSchema = SchemaFactory.createForClass(Precio);

@Schema({ collection: 'MapRecetaNovar' })
export class MapRecetaNovar {
  /*@Prop()
  _id?: Types.ObjectId;*/
  @Prop()
  materialLentes: Types.ObjectId;
  @Prop()
  tipoLente: Types.ObjectId;
  @Prop()
  rango: Types.ObjectId;
  @Prop()
  tipoColorLente: Types.ObjectId;
  @Prop()
  colorLente: Types.ObjectId;
  @Prop()
  marcaLente: Types.ObjectId;
  @Prop()
  tratamiento: Types.ObjectId;
  @Prop()
  codigoNovar: string;

  @Prop()
  novar: boolean;


  @Prop()
  responseNovar: string
}
export const MapRecetaNovaraSchema =
  SchemaFactory.createForClass(MapRecetaNovar);


@Schema({ collection: 'Lente' })
export class Lente {

  @Prop()
  codigo: string;
  @Prop()
  tipo: string;

  @Prop({ type: Types.ObjectId, ref: 'MaterialLente' })
  materialLentes: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'TipoLente' })
  tipoLente: Types.ObjectId;


  @Prop({ type: Types.ObjectId, ref: 'TipoColorLente' })
  tipoColorLente: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ColorLente' })
  colorLente: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MarcaLente' })
  marcaLente: Types.ObjectId;


}
export const LenteSchema =
  SchemaFactory.createForClass(Lente);




@Schema({ collection: 'CombinacionLente' })
export class LenteCombinacion {

  @Prop()
  tipo: string;
  @Prop({ type: Types.ObjectId, ref: 'MaterialLente' })
  material: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'TipoLente' })
  tipoLente: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'TipoColorLente' })
  tipoColorLente: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'ColorLente' })
  color: Types.ObjectId;


  @Prop()
  flag: string

}
export const LenteCombinacionSchema =
  SchemaFactory.createForClass(LenteCombinacion);

