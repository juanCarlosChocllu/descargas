import { Injectable } from '@nestjs/common';
import { CreatePreciosRecetaDto } from './dto/create-precios-receta.dto';
import { UpdatePreciosRecetaDto } from './dto/update-precios-receta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PrecioReceta } from './schema/precios-receta.schema';
import { Model } from 'mongoose';
import * as  xlsx from "xlsx-populate";
import { log } from 'node:util';

@Injectable()
export class PreciosRecetaService {
  constructor(@InjectModel(PrecioReceta.name) private readonly precioReceta:Model<PrecioReceta>){}
  create(createPreciosRecetaDto: CreatePreciosRecetaDto) {
    return 'This action adds a new preciosReceta';
  }

  async findAll() {
    const  precio = await  this.precioReceta.aggregate(
      [{
        $match:{
          flag:'nuevo'
        }
      },
      {
        $lookup:{
          from:'MaterialLentes',
          foreignField:'_id',
          localField:'materiallente',
          as:'materiallente'
        }
      },
      {$unwind:'$materiallente'},
     {
        $lookup:{
          from:'TipoLente',
          foreignField:'_id',
          localField:'tipolente',
          as:'tipolente'
        }
      },
      {$unwind:'$tipolente'},
      {
        $lookup:{
          from:'Rango',
          foreignField:'_id',
          localField:'rango',
          as:'rango'
        }
      },
      {$unwind:'$rango'},
      {
        $lookup:{
          from:'TipoColorLente',
          foreignField:'_id',
          localField:'tipocolorlente',
          as:'tipocolorlente'
        }
      },
      {$unwind:'$tipocolorlente'},
      
      {
        $lookup:{
          from:'ColorLente',
          foreignField:'_id',
          localField:'colorlente',
          as:'colorlente'
        }
      },
      {$unwind:'$colorlente'},
      {
        $lookup:{
          from:'MarcaLente',
          foreignField:'_id',
          localField:'marcalente',
          as:'marcalente'
        }
      },
      {$unwind:'$marcalente'},
       {
        $lookup:{
          from:'Tratamiento',
          foreignField:'_id',
          localField:'tratamiento',
          as:'tratamiento'
        }
      },
      {$unwind:'$tratamiento'},
      {
        $lookup:{
          from:'Precio',
          foreignField:'_id',
          localField:'precios',
          as:'precios'
        }
      },
      {$unwind:'$precios'},
      {
        $match:{
          'precios.abreviatura': { $in: ['P1', 'P2', 'E2', 'E1'] }
        }
      },
      {
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
        
      },
      
      
      {
        $project:{
          material: '$_id.material',
          tipoLente: '$_id.tipoLente',
          tipoColor: '$_id.tipoColor',
          tratamiento: '$_id.tratamiento',
          rangos: '$_id.rangos',
          marca: '$_id.marca',
          color: '$_id.color',
          precios:1
            }
      }
    ]
    )
    
    const x = await xlsx.fromBlankAsync()

    x.sheet(0).cell(`A1`).value('material')
    x.sheet(0).cell(`B1`).value('tipo lente')
    x.sheet(0).cell(`C1`).value('tipo color')
    x.sheet(0).cell(`D1`).value('tratamiento')
    x.sheet(0).cell(`E1`).value('rangos')
    x.sheet(0).cell(`F1`).value('marca')
    x.sheet(0).cell(`G1`).value('color')
    x.sheet(0).cell(`I1`).value('P1')
    x.sheet(0).cell(`J1`).value('P2')
    x.sheet(0).cell(`K1`).value('E1')
    x.sheet(0).cell(`L1`).value('E2')
    for (let index = 0; index < precio.length; index++) {  
      x.sheet(0).cell(`A${index +2 }`).value(precio[index].material)
      x.sheet(0).cell(`B${index +2 }`).value(precio[index].tipoLente)
      x.sheet(0).cell(`C${index +2 }`).value(precio[index].tipoColor)
      x.sheet(0).cell(`D${index +2 }`).value(precio[index].tratamiento)
      x.sheet(0).cell(`E${index +2 }`).value(precio[index].rangos)
      x.sheet(0).cell(`F${index +2 }`).value(precio[index].marca)
      x.sheet(0).cell(`G${index +2 }`).value(precio[index].color)
      for (let i = 0; i < precio[index].precios.length; i++) {
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
      }
    }
    await  x.toFileAsync('./recetas_precio.xlsx')
    return precio;
  }

  findOne(id: number) {
    return `This action returns a #${id} preciosReceta`;
  }

  update(id: number, updatePreciosRecetaDto: UpdatePreciosRecetaDto) {
    return `This action updates a #${id} preciosReceta`;
  }

  remove(id: number) {
    return `This action removes a #${id} preciosReceta`;
  }
}
