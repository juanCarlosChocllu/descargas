import { Injectable } from '@nestjs/common';
import { CreatePreciosRecetaDto } from './dto/create-precios-receta.dto';
import { UpdatePreciosRecetaDto } from './dto/update-precios-receta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PrecioReceta } from './schema/precios-receta.schema';
import { Model } from 'mongoose';
import * as  xlsx from "xlsx-populate";

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
        $project:{
          material:'$materiallente.nombre',
          tipoLente:'$tipolente.nombre',
          tipoColor:'$tipocolorlente.nombre',
          tratamiento:'$tratamiento.nombre',
          rangos:'$rango.nombre',
          marca:'$marcalente.nombre',
          color:'$colorlente.nombre',
          precio:1,
          tipoPrecio:'$precios.nombre'
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
    x.sheet(0).cell(`H1`).value('tipo precio')
    x.sheet(0).cell(`I1`).value('precio')
    for (let index = 0; index < precio.length; index++) {
      x.sheet(0).cell(`A${index +2 }`).value(precio[index].material)
      x.sheet(0).cell(`B${index +2 }`).value(precio[index].tipoLente)
      x.sheet(0).cell(`C${index +2 }`).value(precio[index].tipoColor)
      x.sheet(0).cell(`D${index +2 }`).value(precio[index].tratamiento)
      x.sheet(0).cell(`E${index +2 }`).value(precio[index].rangos)
      x.sheet(0).cell(`F${index +2 }`).value(precio[index].marca)
      x.sheet(0).cell(`G${index +2 }`).value(precio[index].color)
      x.sheet(0).cell(`H${index +2 }`).value(precio[index].tipoPrecio)
      x.sheet(0).cell(`I${index +2 }`).value(precio[index].precio)
      
      
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
