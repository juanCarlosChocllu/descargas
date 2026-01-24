import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePreciosRecetaDto } from './dto/create-precios-receta.dto';
import { UpdatePreciosRecetaDto } from './dto/update-precios-receta.dto';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ColorLente,
  MapRecetaNovar,
  MarcaLente,
  MaterialLentes,
  PrecioReceta,
  Rango,
  TipoColorLente,
  TipoLente,
  Tratamiento,
  Lente
} from './schema/precios-receta.schema';
import { Model, Types } from 'mongoose';
import * as xlsx from 'xlsx-populate';

import * as Exceljs from 'exceljs';
import * as path from 'path';
import { Precio } from 'src/schema';
import { flag } from 'src/enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { log } from 'console';

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

interface lenteI {

  materialLentes?: Types.ObjectId;

  tipoLente?: Types.ObjectId;

  tipoColorLente?: Types.ObjectId;

  colorLente?: Types.ObjectId;

  marcaLente?: Types.ObjectId;
}

@Injectable()
export class PreciosRecetaService {
  constructor(
    @InjectModel(PrecioReceta.name)
    private readonly precioReceta: Model<PrecioReceta>,

    @InjectModel(MapRecetaNovar.name)
    private readonly mapRecetaNovar: Model<MapRecetaNovar>,

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

    @InjectModel(Lente.name)
    private readonly lenteModel: Model<Lente>,

    private readonly httpService: HttpService,
  ) { }

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
    const filePath = path.join(
      __dirname,
      '../../semiprogresivoEcoParaguay26112025.xlsx',
    );
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
        console.log(monto);

        if (contador == 1) {
          continue;
        }
        if (
          !material &&
          !tipoLente &&
          !tipoColor &&
          !tratamiento &&
          !rangos &&
          !marca &&
          !colorLente &&
          !precio &&
          !monto
        ) {
          break;
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
          console.log(data, contador);

          const receta = await this.precioReceta.findOne({
            ...data,
            flag: flag.nuevo,
          });
          if (!receta) {
            console.log(data);
            await this.precioReceta.create({ ...data, flag: flag.nuevo });
          } else {
            console.error('existe', data);
          }
        } else {
          console.log({
            material: material,
            tipoLente: tipoLente,
            'tipo color': tipoColor,
            tratamientos: tratamiento,
            rango: rangos,
            marca: marca,
            color: colorLente,
          });
        }
      }
    }

    return { status: HttpStatus.OK };
  }

  async actualizarRangos() {
    const filePath = path.join(__dirname, '../../RD.xlsx');
    const workbook = new Exceljs.stream.xlsx.WorkbookReader(filePath, {
      entries: 'emit',
    });

    let contador = 0;
    for await (const hojas of workbook) {
      for await (const hoja of hojas) {
        contador++;
        const codigoMia = hoja.getCell(1).value;
        const rangos = hoja.getCell(6).value;

        if (contador == 1) {
          continue;
        }

        if (codigoMia) {
          const [receta, rango] = await Promise.all([
            this.precioReceta.findOne({
              _id: new Types.ObjectId(codigoMia.toString()),
            }),
            this.rangoModel.findOne({ nombre: rangos }),
          ]);

          if (receta && rango) {
            const resultado = await this.precioReceta.updateOne(
              { _id: receta },
              { rango: rango._id },
            );
            console.log(resultado);
          }
        }
      }
    }
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
          'precios.nombre': { $in: ['ECOPY-1', 'ECOPY-2', 'ECO 1', 'ECO 2'] },
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
    await x.toFileAsync('./PRECIOSECO1ECO2PARAGUAY.xlsx');
    return precio;
  }
  async actualizarPrecios() {
    const filePath = path.join(
      __dirname,
      '../../20251121recetas_econovision_paraguay.xlsx',
    );
    const workbook = new Exceljs.stream.xlsx.WorkbookReader(filePath, {
      entries: 'emit',
    });

    let contador = 0;
    for await (const hojas of workbook) {
      for await (const hoja of hojas) {
        contador++;
        const codigoMia = hoja.getCell(1).value;
        const precio = hoja.getCell(10).value;
        console.log(codigoMia, precio);

        if (contador == 1) {
          continue;
        }

        if (codigoMia) {
          const receta = await this.precioReceta.findOne({
            _id: new Types.ObjectId(codigoMia.toString()),
          });

          if (receta) {
            const resultado = await this.precioReceta.updateOne(
              { _id: new Types.ObjectId(codigoMia.toString()) },
              { precio: Number(precio) },
            );
            console.log(resultado);
          }
        }
      }
    }
  }

  async recetaNovar() {
    const receta = await this.precioReceta.aggregate<{
      materiallente: Types.ObjectId;
      materialNovar: string;
      tipolente: Types.ObjectId;
      tipolenteNovar: string;
      rango: Types.ObjectId;
      rangoNovar: string;
      tipocolorlente: Types.ObjectId;
      tipocolorlenteNovar: string;
      colorlente: Types.ObjectId;
      colorlenteNovar: string;
      marcalente: Types.ObjectId;
      marcalenteNovar: string;
      tratamiento: Types.ObjectId;
      tratamientoNovar: string;
    }>([
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
        $match: {
          'marcalente.nombre': {
            $in: ['RODENSTOCK BIG NORM', 'RODENSTOCK LIFE', 'RODENSTOCK MYCOM'],
          },
        },
      },
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
        $group: {
          _id: {
            materiallente: '$materiallente._id',
            tipolente: '$tipolente._id',
            rango: '$rango._id',
            tipocolorlente: '$tipocolorlente._id',
            colorlente: '$colorlente._id',
            marcalente: '$marcalente._id',
            tratamiento: '$tratamiento._id',
          },
          materiallente: { $first: '$materiallente._id' },
          materialNovar: { $first: '$materiallente.abreviaturaNovar' },
          tipolente: { $first: '$tipolente._id' },
          tipolenteNovar: { $first: '$tipolente.abreviaturaNovar' },
          rango: { $first: '$rango._id' },
          rangoNovar: { $first: '$rango.abreviaturaNovar' },
          tipocolorlente: { $first: '$tipocolorlente._id' },
          tipocolorlenteNovar: { $first: '$tipocolorlente.abreviaturaNovar' },
          colorlente: { $first: '$colorlente._id' },
          colorlenteNovar: { $first: '$colorlente.abreviaturaNovar' },
          marcalente: { $first: '$marcalente._id' },
          marcalenteNovar: { $first: '$marcalente.abreviaturaNovar' },
          tratamiento: { $first: '$tratamiento._id' },
          tratamientoNovar: { $first: '$tratamiento.abreviaturaNovar' },
        },
      },

      {
        $project: {
          _id: 0,
          materiallente: 1,
          materialNovar: 1,
          tipolente: 1,
          tipolenteNovar: 1,
          rango: 1,
          rangoNovar: 1,
          tipocolorlente: 1,
          tipocolorlenteNovar: 1,
          colorlente: 1,
          colorlenteNovar: 1,
          marcalente: 1,
          marcalenteNovar: 1,
          tratamiento: 1,
          tratamientoNovar: 1,
        },
      },
    ]);
    for (const item of receta) {
      const data = {
        colorLente: item.colorlente,
        marcaLente: item.marcalente,
        materialLentes: item.materiallente,
        rango: item.rango,
        tipoColorLente: item.tipocolorlente,
        tipoLente: item.tipolente,
        tratamiento: item.tratamiento,
      };
      const map = await this.mapRecetaNovar.findOne(data);
      if (!map) {
        const resultado = await this.mapRecetaNovar.create(data);
        console.log(resultado);

        resultado.codigoNovar = String(resultado._id);
        resultado.save();
      }
    }
  }

  async sincroNovar() {
    const receta = await this.mapRecetaNovar.aggregate<{
      materiallente: Types.ObjectId;
      materialNovar: string;
      tipolente: Types.ObjectId;
      tipolenteNovar: string;
      rango: Types.ObjectId;
      rangoNovar: string;
      tipocolorlente: Types.ObjectId;
      tipocolorlenteNovar: string;
      colorlente: Types.ObjectId;
      colorlenteNovar: string;
      marcalente: Types.ObjectId;
      marcalenteNovar: string;
      tratamiento: Types.ObjectId;
      tratamientoNovar: string;
      codigoNovar: string;
      tipolenteCodigo: string;
      isAr: boolean;
      isBlu: boolean;
      isFoto: boolean;
      tipolenteNombre: string;
      rangoNombre: string;
      materiallenteNombre: string;
      tipocolorlenteNombre: string;
      colorlenteNombre: string;
      marcalenteNombre: string;
      tratamientoNombre: string;
      materiallenteCodigo: string;
      rangoCodigoNovar: string;
      codigosMap: Types.ObjectId[];
    }>([

      {
        $lookup: {
          from: 'MaterialLentes',
          foreignField: '_id',
          localField: 'materialLentes',
          as: 'materiallente',
        },
      },
      { $unwind: '$materiallente' },
      {
        $lookup: {
          from: 'TipoLente',
          foreignField: '_id',
          localField: 'tipoLente',
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
        $match: {
          'rango.nombre': {
            $in: [
              'RD ADD +3.25 A +3.50',
              'RD ADD +1.00 A +3.00',
              'RD SUMATORIAS DE ESF. CON CIL. NO DEBE PASAR DE ESF +8.00 O -10.00 HASTA (CIL. -6.00)',
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'TipoColorLente',
          foreignField: '_id',
          localField: 'tipoColorLente',
          as: 'tipocolorlente',
        },
      },
      { $unwind: '$tipocolorlente' },

      {
        $lookup: {
          from: 'ColorLente',
          foreignField: '_id',
          localField: 'colorLente',
          as: 'colorlente',
        },
      },
      { $unwind: '$colorlente' },
      {
        $lookup: {
          from: 'MarcaLente',
          foreignField: '_id',
          localField: 'marcaLente',
          as: 'marcalente',
        },
      },
      { $unwind: '$marcalente' },
      {
        $match: {
          'marcalente.nombre': {
            $in: ['RODENSTOCK BIG NORM', 'RODENSTOCK LIFE', 'RODENSTOCK MYCOM'],
          },
        },
      },
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
        $group: {
          _id: {
            materiallente: '$materiallente._id',
            tipolente: '$tipolente._id',
            rango: '$rango._id',
            tipocolorlente: '$tipocolorlente._id',
            colorlente: '$colorlente._id',
            marcalente: '$marcalente._id',
            tratamiento: '$tratamiento._id',
          },
          materiallente: { $first: '$materiallente._id' },
          materialNovar: { $first: '$materiallente.abreviaturaNovar' },
          materiallenteNombre: { $first: '$materiallente.nombre' },
          materiallenteCodigo: { $first: '$materiallente.codigo' },

          tipolente: { $first: '$tipolente._id' },
          tipolenteNombre: { $first: '$tipolente.nombre' },
          tipolenteNovar: { $first: '$tipolente.abreviaturaNovar' },
          tipolenteCodigo: { $first: '$tipolente.codigo' },

          rango: { $first: '$rango._id' },
          rangoNovar: { $first: '$rango.abreviaturaNovar' },
          rangoNombre: { $first: '$rango.nombre' },
          rangoCodigoNovar: { $first: '$rango.codigoNovar' },

          tipocolorlente: { $first: '$tipocolorlente._id' },
          tipocolorlenteNovar: { $first: '$tipocolorlente.abreviaturaNovar' },
          tipocolorlenteNombre: { $first: '$tipocolorlente.nombre' },

          colorlente: { $first: '$colorlente._id' },
          colorlenteNovar: { $first: '$colorlente.abreviaturaNovar' },
          colorlenteNombre: { $first: '$colorlente.nombre' },

          marcalente: { $first: '$marcalente._id' },
          marcalenteNovar: { $first: '$marcalente.abreviaturaNovar' },
          marcalenteNombre: { $first: '$marcalente.nombre' },

          tratamiento: { $first: '$tratamiento._id' },
          tratamientoNovar: { $first: '$tratamiento.abreviaturaNovar' },
          tratamientoNombre: { $first: '$tratamiento.nombre' },

          codigoNovar: { $first: '$codigoNovar' },
          isAr: { $first: '$tratamiento.isAr' },
          isBlu: { $first: '$tratamiento.isBlu' },
          isFoto: { $first: '$tratamiento.isFoto' },
          codigosMap: { $addToSet: '$_id' },
        },
      },

      {
        $project: {
          _id: 0,
          materiallente: 1,
          materialNovar: 1,
          tipolente: 1,
          tipolenteNovar: 1,
          tipolenteCodigo: 1,
          rango: 1,
          rangoNovar: 1,
          tipocolorlente: 1,
          tipocolorlenteNovar: 1,
          colorlente: 1,
          colorlenteNovar: 1,
          marcalente: 1,
          marcalenteNovar: 1,
          tratamiento: 1,
          tratamientoNovar: 1,
          codigoNovar: 1,
          isAr: 1,
          isBlu: 1,
          isFoto: 1,
          tipolenteNombre: 1,
          rangoNombre: 1,
          materiallenteNombre: 1,
          tipocolorlenteNombre: 1,
          colorlenteNombre: 1,
          marcalenteNombre: 1,
          tratamientoNombre: 1,
          materiallenteCodigo: 1,
          rangoCodigoNovar: 1,
          codigosMap: 1,
        },
      },
    ]);
    console.log(receta.length);
    let contador = 0
    const url =
      '';
    for (const item of receta) {
      contador++
      const codigoProductoNovar =
        `${item.materialNovar ?? ''}_` +
        `${item.tipolenteNovar ?? ''}_` +
        `${item.tipocolorlenteNovar ?? ''}_` +
        `${item.tratamientoNovar ?? ''}_` +
        `${item.rangoNovar ?? ''}_` +
        `${item.marcalenteNovar ?? ''}_` +
        `${item.colorlenteNovar ?? ''}`;

      let nombre = `${item.tipolenteNombre} ${item.materiallenteNombre}`;

      if (item.tipocolorlenteNombre != 'SIN COLOR') {
        nombre += ` ${item.tipocolorlenteNombre}`;
      }

      if (item.colorlenteNombre != 'SIN COLOR') {
        nombre += ` ${item.colorlenteNombre}`;
      }

      if (item.marcalenteNombre != 'SIN MARCA') {
        if (item.marcalenteNombre == 'RODENSTOCK BIG NORM') {
          nombre += ` RDSBG`;
        } else if (item.marcalenteNombre == 'RODENSTOCK LIFE') {
          nombre += ` RDSL`;
        } else if (item.marcalenteNombre == 'RODENSTOCK MYCOM') {
          nombre += ` RDSM`;
        } else {
          nombre += ` ${item.marcalenteNombre}`;
        }
      }
      if (item.tratamientoNombre != 'SIN TRATAMIENTO') {
        nombre += ` ${item.tratamientoNombre}`;
      }
      nombre += ` ${item.rangoNombre}`;
      const data = {
        LoginApi: {
          Idioma: '',
          Login: '',
          Clave: '',
          ApiKey: '',
        },
        Codigo: codigoProductoNovar,
        CodigoErp: item.codigoNovar,
        Nombre: nombre,
        Descripcion: nombre,
        CodigoLaboratorio: '0001',
        CodigoMarca: item.rangoCodigoNovar ? item.rangoCodigoNovar : '',
        CodigoTipoProducto: 'LEN',
        CodigoTipoMaterial: item.materiallenteCodigo,
        CodigoTipoBase: item.tipolenteNovar,
        TipoVision: item.tipolenteCodigo,
        IsAr: item.isAr,
        IsBlu: item.isBlu,
        IsFoto: item.isFoto,
        TipoOperacion: 1,
      };

      const response = await firstValueFrom(this.httpService.post(url, data));
      if (response.data.IsOk == false) {
        let nombre = `${item.tipolenteNombre} ${item.materiallenteNombre} ${item.tipocolorlenteNombre} ${item.colorlenteNombre} ${item.marcalenteNombre} ${item.tratamientoNombre}  ${item.rangoNombre}`;

        await this.mapRecetaNovar.updateOne(
          { _id: new Types.ObjectId(item.codigoNovar) },
          { $set: { novar: false, responseNovar: JSON.stringify([response.data, data]) } },
        );
        console.error(nombre);
        console.error(data);
        console.error(response.data.Mensajes);
      } else {
        console.log(data.Codigo);
        console.log(response.data);
        for (const id of item.codigosMap) {
          await this.mapRecetaNovar.updateOne(
            { _id: new Types.ObjectId(id) },
            { $set: { novar: true } },
          );
        }
      }
    }
  }

  /*async errores() {


  const inicio = new Date();
  inicio.setHours(9, 0, 0, 0);


  const fin = new Date();
  fin.setHours(10, 0, 0, 0);
  const objectIdInicio = new mongoose.Types.ObjectId(
    Math.floor(inicio.getTime() / 1000).toString(16) + "0000000000000000"
  );

  const objectIdFin = new mongoose.Types.ObjectId(
    Math.floor(fin.getTime() / 1000).toString(16) + "0000000000000000"
  );
  console.log({ $gte: objectIdInicio, $lte: objectIdFin });
  
  const docs = await this.precioReceta
    .find({
      _id: { $gte: objectIdInicio, $lt: objectIdFin }
    })
  

  console.log(`Registros entre 9:00 y 10:00:`, docs.length);
    console.log(docs.length);
    
  docs.forEach(doc => {
    console.log(doc._id.getTimestamp(), doc._id.toString(), doc.precio);
  });
}*/

  async errores(corregir: string) {
    const id: Types.ObjectId[] = [];
    const inicioUTC = new Date(Date.UTC(2025, 10, 20, 14, 0, 0));
    const finUTC = new Date(Date.UTC(2025, 10, 20, 15, 0, 0));

    /* const inicioUTC = new Date(Date.UTC(2025, 10, 19, 23, 0, 0)); // 19 Nov 2025, 23:00 UTC
    const finUTC = new Date(Date.UTC(2025, 10, 20, 0, 0, 0)); */ // 20 Nov 2025, 00:00 UTC

    const objectIdInicio = new mongoose.Types.ObjectId(
      Math.floor(inicioUTC.getTime() / 1000)
        .toString(16)
        .padStart(8, '0') + '0000000000000000',
    );

    const objectIdFin = new mongoose.Types.ObjectId(
      Math.floor(finUTC.getTime() / 1000)
        .toString(16)
        .padStart(8, '0') + '0000000000000000',
    );

    console.log('RANGO:', { $gte: objectIdInicio, $lt: objectIdFin });

    const docs = await this.precioReceta.find({
      _id: { $gte: objectIdInicio, $lt: objectIdFin },
    });

    console.log('registro', docs.length);

    docs.forEach((doc) => {
      id.push(doc._id);
      console.log(doc._id.getTimestamp(), doc._id.toString());
    });

    if (corregir === 'true') {
      const response = await this.precioReceta.updateMany(
        { _id: { $in: id } },
        { $set: { flag: flag.eliminado, estado: 'error de carga' } },
      );
      console.log(response);
    }
  }

  async eliminarpy2() {
    const data = await this.precioReceta.aggregate<{
      _id: Types.ObjectId;
      nombre: string;
    }>([
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
          'precios.nombre': 'ECOPY-2',
        },
      },
      {
        $project: {
          _id: 1,
          nombre: '$precios.nombre',
        },
      },
    ]);
    console.log(data);
  }

  async descargarLente() {
    const lentes = await this.lenteModel.aggregate([
      {
        $match: {
          flag: 'nuevo',
        }
      },

      {
        $lookup: {
          from: 'MaterialLentes',
          foreignField: '_id',
          localField: 'materialLentes',
          as: 'materialLentes',
        },
      },
      {
        $unwind: { path: '$materialLentes', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'TipoLente',
          foreignField: '_id',
          localField: 'tipoLente',
          as: 'tipoLente',
        },
      },
      {
        $unwind: { path: '$tipoLente', preserveNullAndEmptyArrays: true }
      },

      {
        $lookup: {
          from: 'TipoColorLente',
          foreignField: '_id',
          localField: 'tipoColorLente',
          as: 'tipoColorLente',
        },
      },
      {
        $unwind: { path: '$tipoColorLente', preserveNullAndEmptyArrays: true }
      },

      {
        $lookup: {
          from: 'ColorLente',
          foreignField: '_id',
          localField: 'colorLente',
          as: 'colorLente',
        },
      },
      {
        $unwind: { path: '$colorLente', preserveNullAndEmptyArrays: true }
      },

      {
        $lookup: {
          from: 'MarcaLente',
          foreignField: '_id',
          localField: 'marcaLente',
          as: 'marcaLente',
        },
      },
      {
        $unwind: { path: '$marcaLente', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'Fabricante',
          foreignField: '_id',
          localField: 'fabricante',
          as: 'fabricante',
        },
      },


      /* {
         $lookup: {
           from: 'Stock',
           foreignField: 'lente',
           localField: '_id',
           as: 'stock',
         },
       },
       {
         $unwind: { path: '$stock', preserveNullAndEmptyArrays: true }
       },*/
      
      {
        $project: {
          _id: 1,
          codigo: 1,
          tipo: 1,
          ojo: 1,
          base: 1,
          cilindro: 1,
          esferico: 1,
          adicion: 1,
          fabricante: { $arrayElemAt: ['$fabricante.nombre', 0] },
          material: '$materialLentes.nombre',
          tipoLente: '$tipoLente.nombre',
          tipoColor: '$tipoColorLente.nombre',
          marca: '$marcaLente.nombre',
          color: '$colorLente.nombre',
          // cantidad: '$stock.cantidad'
        },
      }
    ])
    console.log(lentes);

    const x = await xlsx.fromBlankAsync();
   x.sheet(0).cell('A1').value('id');
x.sheet(0).cell('B1').value('codigo');
x.sheet(0).cell('C1').value('tipo');
x.sheet(0).cell('D1').value('cilindro');
x.sheet(0).cell('E1').value('esferico');
x.sheet(0).cell('F1').value('adicion');
x.sheet(0).cell('G1').value('base');
x.sheet(0).cell('H1').value('ojo');
x.sheet(0).cell('I1').value('fabricante');
x.sheet(0).cell('J1').value('material');
x.sheet(0).cell('K1').value('tipo lente');
x.sheet(0).cell('L1').value('tipo color');
x.sheet(0).cell('M1').value('marca');
x.sheet(0).cell('N1').value('color');



    for (let i = 0; i < lentes.length; i++) {
      const fila = i + 2;

      x.sheet(0).cell(`A${fila}`).value(String(lentes[i]._id));
    x.sheet(0).cell(`B${fila}`).value(lentes[i].codigo);
    x.sheet(0).cell(`C${fila}`).value(lentes[i].tipo);
    x.sheet(0).cell(`D${fila}`).value(lentes[i].cilindro);
    x.sheet(0).cell(`E${fila}`).value(lentes[i].esferico);
    x.sheet(0).cell(`F${fila}`).value(lentes[i].adicion);
    x.sheet(0).cell(`G${fila}`).value(lentes[i].base);
    x.sheet(0).cell(`H${fila}`).value(lentes[i].ojo);
    x.sheet(0).cell(`I${fila}`).value(lentes[i].fabricante);
    x.sheet(0).cell(`J${fila}`).value(lentes[i].material);
    x.sheet(0).cell(`K${fila}`).value(lentes[i].tipoLente);
    x.sheet(0).cell(`L${fila}`).value(lentes[i].tipoColor);
    x.sheet(0).cell(`M${fila}`).value(lentes[i].marca);
    x.sheet(0).cell(`N${fila}`).value(lentes[i].color);;



    }
    await x.toFileAsync('./lente.xlsx');
  }


  async reorganizarLente() {
    const filePath = path.join(
      __dirname,
      '../../lente.xlsx',
    );
    const workbook = new Exceljs.stream.xlsx.WorkbookReader(filePath, {
      entries: 'emit',
    });

    let contador = 0;
    for await (const hojas of workbook) {
      for await (const hoja of hojas) {
        contador++;
        const id = hoja.getCell(1).value;
        const codigo = hoja.getCell(2).value;
        const material = hoja.getCell(3).value;
        const tipoLente = hoja.getCell(4).value;
        const tipoColor = hoja.getCell(5).value;
        let marca = hoja.getCell(6).value;
        let color = hoja.getCell(7).value;
        if (contador == 1) {
          continue;
        }
        const [
          materiales,
          tiposLente,
          tipoColorLente,
          marcas,
          colorL

        ] = await Promise.all([

          this.materialLentesModel.find({ nombre: material }),

          this.tipoLenteModel.find({ nombre: tipoLente }),

          this.tipoColorLenteModel.find({ nombre: tipoColor }),

          this.marcaLenteModel.find({ nombre: marca }),

          this.colorLenteModel.find({ nombre: color })

        ]);


        const data: lenteI = {}

        if (materiales.length > 0) {
          const m = materiales.filter((item) => item.flag === 'nuevo')
          if (m.length > 0) {
            data.materialLentes = m[0]._id
          }
        }



        if (tiposLente.length > 0) {
          const m = tiposLente.filter((item) => item.flag === 'nuevo')
          if (m.length > 0) {
            data.tipoLente = m[0]._id
          }
        }

        if (tipoColorLente.length > 0) {
          const m = tipoColorLente.filter((item) => item.flag === 'nuevo')
          if (m.length > 0) {
            data.tipoColorLente = m[0]._id
          }
        }

        if (marcas.length > 0) {
          const m = marcas.filter((item) => item.flag === 'nuevo')
          if (m.length > 0) {
            data.marcaLente = m[0]._id
          }
        }

        if (colorL.length > 0) {
          const m = colorL.filter((item) => item.flag === 'nuevo')
          if (m.length > 0) {
            data.colorLente = m[0]._id
          }
        }

        console.log(codigo);
        console.log(data);
        if (Object.keys(data).length > 0) {
          const r = await this.lenteModel.updateOne(
            { _id: new Types.ObjectId(String(id)) },
            { $set: data }
          );
          console.log(r);
        }


      }



    }
  }
}


