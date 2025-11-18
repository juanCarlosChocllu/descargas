import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePreciosRecetaDto } from './dto/create-precios-receta.dto';
import { UpdatePreciosRecetaDto } from './dto/update-precios-receta.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ColorLente,
  MarcaLente,
  MaterialLentes,
  PrecioReceta,
  Rango,
  TipoColorLente,
  TipoLente,
  Tratamiento,
} from './schema/precios-receta.schema';
import { Model, Types } from 'mongoose';
import * as xlsx from 'xlsx-populate';

import * as Exceljs from 'exceljs';
import * as path from 'path';
import { Precio } from 'src/schema';
import { flag } from 'src/enum';

export interface DatosLente {
  materiallente: Types.ObjectId;
  tipolente: Types.ObjectId;
  rango: Types.ObjectId;
  tipocolorlente: Types.ObjectId;
  colorlente: Types.ObjectId;
  marcalente: Types.ObjectId;
  tratamiento: Types.ObjectId;
  precios?: Types.ObjectId;
  precio: number;
}

@Injectable()
export class PreciosRecetaService {
  constructor(
    @InjectModel(PrecioReceta.name)
    private readonly precioReceta: Model<PrecioReceta>,

    @InjectModel(MaterialLentes.name)
    private readonly materialLentesModel: Model<MaterialLentes>,
    @InjectModel(TipoLente.name)
    private readonly tipoLenteModel: Model<TipoLente>,
    @InjectModel(TipoColorLente.name)
    private readonly tipoColorLenteModel: Model<TipoColorLente>,
    @InjectModel(Tratamiento.name)
    private readonly tratamientoModel: Model<Tratamiento>,
    @InjectModel(Rango.name) private readonly rangoModel: Model<Rango>,
    @InjectModel(MarcaLente.name)
    private readonly marcaLenteModel: Model<MarcaLente>,
    @InjectModel(ColorLente.name)
    private readonly colorLenteModel: Model<ColorLente>,
    @InjectModel(Precio.name)
    private readonly precioModel: Model<Precio>,
  ) {}

  async create(createPreciosRecetaDto: CreatePreciosRecetaDto) {
    const filePath = path.join(__dirname, '../../recetas_actualizar.xlsx');
    const workbook = new Exceljs.stream.xlsx.WorkbookReader(filePath, {
      entries: 'emit',
    });

    let contador = 0;
    for await (const hojas of workbook) {
      for await (const hoja of hojas) {
        contador++;
        const codigoMia = hoja.getCell(1).value;
        const material = hoja.getCell(2).value;
        const tipoLente = hoja.getCell(3).value;
        const tipoColor = hoja.getCell(4).value;
        const tratamiento = hoja.getCell(5).value;
        const rangos = hoja.getCell(6).value;
        const marca = hoja.getCell(7).value;
        const colorLente = hoja.getCell(8).value;
        const precio = hoja.getCell(9).value;
        const monto = hoja.getCell(10).value;

        if (contador == 1) {
          continue;
        }

        const receta = await this.precioReceta.findOne({
          _id: new Types.ObjectId(String(codigoMia)),
        });
        if (receta) {
          const [
            materiales,
            tiposLenter,
            tipoColorLente,
            tratamientos,
            rangosRes,
            marcasr,
            colorL,
          ] = await Promise.all([
            this.materialLentesModel.findOne({ nombre: material }),
            this.tipoLenteModel.findOne({ nombre: tipoLente }),
            this.tipoColorLenteModel.findOne({ nombre: tipoColor }),
            this.tratamientoModel.findOne({ nombre: tratamiento }),
            this.rangoModel.findOne({ nombre: rangos }),
            this.marcaLenteModel.findOne({ nombre: marca }),
            this.colorLenteModel.findOne({ nombre: colorLente }),
          ]);

          /* console.log('material', materiales.nombre, 
        'tipoLente', tiposLente.nombre,
        'tipo color', tipoColorLente.nombre,
        'tratamientos', tratamientos.nombre,
        'rango', rangosRes.nombre,
        'marca',marcas.nombre,
        'color', colorL.nombre
       );*/

          if (
            materiales &&
            tiposLenter &&
            tipoColorLente &&
            tratamientos &&
            rangosRes &&
            marcasr &&
            colorL
          ) {
            const data: DatosLente = {
              materiallente: materiales._id,
              tipolente: tiposLenter._id,
              tipocolorlente: tipoColorLente._id,
              tratamiento: tratamientos._id,
              rango: rangosRes._id,
              marcalente: marcasr._id,
              colorlente: colorL._id,
              precio: Number(monto),
            };

            const update = await this.precioReceta.updateOne(
              { _id: new Types.ObjectId(String(codigoMia)) },
              data,
            );
          } else {
            console.log(
              'material',
              material,
              'tipoLente',
              tipoLente,
              'tipo color',
              tipoColor,
              'tratamientos',
              tratamiento,
              'rango',
              rangos,
              'marca',
              marca,
              'color',
              colorLente,
            );
          }
        }
      }
    }

    return { status: HttpStatus.OK };
  }

  async crearCombiancion() {
    const filePath = path.join(__dirname, '../../VisionSencillaEcoParaguay.xlsx');
    const workbook = new Exceljs.stream.xlsx.WorkbookReader(filePath, {
      entries: 'emit',
    });

    let contador = 0;
    for await (const hojas of workbook) {
      for await (const hoja of hojas) {
        contador++;
        const codigoMia = hoja.getCell(1).value;
        const material = hoja.getCell(2).value;
        const tipoLente = hoja.getCell(3).value;
        const tipoColor = hoja.getCell(4).value;
        const tratamiento = hoja.getCell(5).value;
        const rangos = hoja.getCell(6).value;
        const marca = hoja.getCell(7).value;
        const colorLente = hoja.getCell(8).value;
        const precio = hoja.getCell(9).value;
        const monto = hoja.getCell(10).value;

        if (contador == 1) {
          continue;
        }
        const [
          materiales,
          tiposLente,
          tipoColorLente,
          tratamientos,
          rangosRes,
          marcas,
          colorL,
          precios,
        ] = await Promise.all([
          this.materialLentesModel.findOne({ nombre: material }),
          this.tipoLenteModel.findOne({ nombre: tipoLente }),
          this.tipoColorLenteModel.findOne({ nombre: tipoColor }),
          this.tratamientoModel.findOne({ nombre: tratamiento }),
          this.rangoModel.findOne({ nombre: rangos }),
          this.marcaLenteModel.findOne({ nombre: marca }),
          this.colorLenteModel.findOne({ nombre: colorLente }),
          this.precioModel.findOne({ nombre: precio }),
        ]);

        /* console.log('material', materiales.nombre, 
        'tipoLente', tiposLente.nombre,
        'tipo color', tipoColorLente.nombre,
        'tratamientos', tratamientos.nombre,
        'rango', rangosRes.nombre,
        'marca',marcas.nombre,
        'color', colorL.nombre
      );*/

        if (
          materiales &&
          tiposLente &&
          tipoColorLente &&
          tratamientos &&
          rangosRes &&
          marcas &&
          colorL &&
          precios
        ) {
          const data: DatosLente = {
            materiallente: materiales._id,
            tipolente: tiposLente._id,
            tipocolorlente: tipoColorLente._id,
            tratamiento: tratamientos._id,
            rango: rangosRes._id,
            marcalente: marcas._id,
            colorlente: colorL._id,
            precio: Number(monto),
            precios: precios._id,
          };
          const receta = await this.precioReceta.findOne({...data, flag:flag.nuevo});
          if (!receta) {
            console.log(data);
            await this.precioReceta.create({...data, flag:flag.nuevo}); 
          }
        }else {
        console.table({'material':material, 
        'tipoLente':tipoLente,
        'tipo color':tipoColor,
        'tratamientos': tratamiento,
        'rango': rangos,
        'marca':marca,
        'color':colorLente})
        }
      }
    }

    return { status: HttpStatus.OK };
  }

  async findAll() {
    const precio = await this.precioReceta.aggregate([
      {
        $match: {
          flag: 'nuevo',
        },
      },
      {
        $lookup: {
          from: 'MaterialLentes',
          foreignField: '_id',
          localField: 'materiallente',
          as: 'materiallente',
        },
      },
      { $unwind: '$materiallente' },
      {
        $lookup: {
          from: 'TipoLente',
          foreignField: '_id',
          localField: 'tipolente',
          as: 'tipolente',
        },
      },
      { $unwind: '$tipolente' },
      {
        $lookup: {
          from: 'Rango',
          foreignField: '_id',
          localField: 'rango',
          as: 'rango',
        },
      },
      { $unwind: '$rango' },
      {
        $lookup: {
          from: 'TipoColorLente',
          foreignField: '_id',
          localField: 'tipocolorlente',
          as: 'tipocolorlente',
        },
      },
      { $unwind: '$tipocolorlente' },

      {
        $lookup: {
          from: 'ColorLente',
          foreignField: '_id',
          localField: 'colorlente',
          as: 'colorlente',
        },
      },
      { $unwind: '$colorlente' },
      {
        $lookup: {
          from: 'MarcaLente',
          foreignField: '_id',
          localField: 'marcalente',
          as: 'marcalente',
        },
      },
      { $unwind: '$marcalente' },
      {
        $lookup: {
          from: 'Tratamiento',
          foreignField: '_id',
          localField: 'tratamiento',
          as: 'tratamiento',
        },
      },
      { $unwind: '$tratamiento' },
      {
        $lookup: {
          from: 'Precio',
          foreignField: '_id',
          localField: 'precios',
          as: 'precios',
        },
      },
      { $unwind: '$precios' },
      {
        $match: {
          'precios.nombre': { $in: ['ECO 1', 'ECO 2'] },
        },
      },
      /* {
        $group:{
          _id:{
            material:'$materiallente.nombre',
            tipoLente:'$tipolente.nombre',
            tipoColor:'$tipocolorlente.nombre',
            tratamiento:'$tratamiento.nombre',
            rangos:'$rango.nombre',
            marca:'$marcalente.nombre',
            color:'$colorlente.nombre',
          },
          
          precios: { $push: {tipoPrecio: '$precios.abreviatura', precio:'$precio'} }

        },
        
      },*/

      {
        $limit: 2,
      },

      {
        $project: {
          material: '$materiallente.nombre',
          tipoLente: '$tipolente.nombre',
          tipoColor: '$tipocolorlente.nombre',
          tratamiento: '$tratamiento.nombre',
          rangos: '$rango.nombre',
          marca: '$marcalente.nombre',
          color: '$colorlente.nombre',
          tipoPrecio: '$precios.nombre',
          precio: 1,
        },
      },
    ]);

    const x = await xlsx.fromBlankAsync();
    x.sheet(0).cell(`A1`).value('id');
    x.sheet(0).cell(`B1`).value('material');
    x.sheet(0).cell(`C1`).value('tipo lente');
    x.sheet(0).cell(`D1`).value('tipo color');
    x.sheet(0).cell(`E1`).value('tratamiento');
    x.sheet(0).cell(`F1`).value('rangos');
    x.sheet(0).cell(`G1`).value('marca');
    x.sheet(0).cell(`H1`).value('color');
    x.sheet(0).cell(`I1`).value('tipo Precio');
    x.sheet(0).cell(`J1`).value('monto');

    for (let index = 0; index < precio.length; index++) {
      x.sheet(0)
        .cell(`A${index + 2}`)
        .value(String(precio[index]._id));
      x.sheet(0)
        .cell(`B${index + 2}`)
        .value(precio[index].material);
      x.sheet(0)
        .cell(`C${index + 2}`)
        .value(precio[index].tipoLente);
      x.sheet(0)
        .cell(`D${index + 2}`)
        .value(precio[index].tipoColor);
      x.sheet(0)
        .cell(`E${index + 2}`)
        .value(precio[index].tratamiento);
      x.sheet(0)
        .cell(`F${index + 2}`)
        .value(precio[index].rangos);
      x.sheet(0)
        .cell(`G${index + 2}`)
        .value(precio[index].marca);
      x.sheet(0)
        .cell(`H${index + 2}`)
        .value(precio[index].color);
      x.sheet(0)
        .cell(`I${index + 2}`)
        .value(precio[index].tipoPrecio);
      x.sheet(0)
        .cell(`J${index + 2}`)
        .value(precio[index].precio);
      /* for (let i = 0; i < precio[index].precios.length; i++) {
        if(precio[index].precios[i].tipoPrecio == 'P1'){
          x.sheet(0).cell(`I${index + 2 }`).value(precio[index].precios[i].precio)
        }
        if(precio[index].precios[i].tipoPrecio == 'P2'){
          x.sheet(0).cell(`J${index + 2 }`).value(precio[index].precios[i].precio)
        }
        if(precio[index].precios[i].tipoPrecio == 'E1'){
          x.sheet(0).cell(`K${index + 2 }`).value(precio[index].precios[i].precio)
        }
        if(precio[index].precios[i].tipoPrecio == 'E2'){
          x.sheet(0).cell(`L${index + 2 }`).value(precio[index].precios[i].precio)
        }   
      }*/
    }
    await x.toFileAsync('./recetas_econovision.xlsx');
    return precio;
  }
  async actualizarPrecios() {
    const filePath = path.join(__dirname, '../../masivo_transition.xlsx');
    const workbook = new Exceljs.stream.xlsx.WorkbookReader(filePath, {
      entries: 'emit',
    });

    let contador = 0;
    for await (const hojas of workbook) {
      for await (const hoja of hojas) {
        contador++;
        const codigoMia = hoja.getCell(1).value;
        const precio = hoja.getCell(10).value;
        console.log(precio);

        if (contador == 1) {
          continue;
        }

        if (codigoMia) {
          const receta = await this.precioReceta.findOne({
            _id: new Types.ObjectId(codigoMia.toString()),
          });
          if (receta) {
            await this.precioReceta.updateOne(
              { _id: new Types.ObjectId(codigoMia.toString()) },
              { precio: Number(precio) },
            );
          }
        }
      }
    }
  }
}
