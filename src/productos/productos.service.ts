import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Producto } from 'src/schema';
import { Model, Types } from 'mongoose';
import { Precio } from './schema/producto.schema';
import * as  xlsx from "xlsx-populate";
@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Producto.name) private readonly producto:Model<Producto>,
    @InjectModel(Precio.name) private readonly precio:Model<Precio>
){}
  create(createProductoDto: CreateProductoDto) {
    return 'This action adds a new producto';
  }

  async findAll() {
      const productos = []
      const precios =  await this.precio.find({abreviatura:{$in: ['P1', 'P2', 'E2', 'E1']}})
      
     for (const data of precios) {
                 const producto = await this.producto.aggregate([
          {
            $match:{
              precios:{$elemMatch:{tipoPrecio:new Types.ObjectId(data._id)}}
            }
          },
          {
            $lookup:{
              from:'Marca',
              foreignField:'_id',
              localField:'marca',
              as:'marca'
            }
          },
          {$unwind:{path:'$marca'}},
          {
            $lookup:{
              from:'Color',
              foreignField:'_id',
              localField:'color',
              as:'color'
            }
          },
          {$unwind:{path:'$color'}},

          {
            $lookup:{
              from:'TipoMontura',
              foreignField:'_id',
              localField:'tipoMontura',
              as:'tipoMontura'
            }
          },
          {$unwind:{path:'$tipoMontura'}},
          {
            $project:{
              tipoProducto:1,
              marca:'$marca.nombre',
              color:'$color.nombre',
              serie:1, 
              genero:1,
              categoria:1,
              codigoQR:1,
              precios:1,
              tipoMontura:'$tipoMontura.nombre'
            }
          }
         ])
       
        for (const p of  producto) {
          
        
          
          
         const  precio =  p.precios.filter((i) => String(i.tipoPrecio) == String(data._id)
         )[0].precio;
          
          
          let dataFromateada={
            nombre:data.nombre,
            tipoProducto:p.tipoProducto,
            marca:p.marca,
            color:p.color,
            serie:p.serie,
            genero:p.genero,
            categoria:p.categoria,
            codigoQR:p.codigoQR,
            precio:precio,
            tipoMontura:p.tipoMontura
            
          }
          productos.push(dataFromateada)
        } 
       
          
      }

      const x = await xlsx.fromBlankAsync()
           x.sheet(0).cell(`A1`).value('codigoQR')
          x.sheet(0).cell(`B1`).value('producto')
          x.sheet(0).cell(`C1`).value('marca')
          x.sheet(0).cell(`D1`).value('color')
          x.sheet(0).cell(`E1`).value('serie')
          x.sheet(0).cell(`F1`).value('genero')
          x.sheet(0).cell(`G1`).value('tipo montura')
          x.sheet(0).cell(`H1`).value('categoria')
          x.sheet(0).cell(`I1`).value('tipo precio')
          x.sheet(0).cell(`J1`).value('precio')
      
          for (let index = 0; index < productos.length; index++) {
            x.sheet(0).cell(`A${index +2 }`).value(productos[index].codigoQR)
            x.sheet(0).cell(`B${index +2 }`).value(productos[index].tipoProducto)
            x.sheet(0).cell(`C${index +2 }`).value(productos[index].marca)
            x.sheet(0).cell(`D${index +2 }`).value(productos[index].color)
            x.sheet(0).cell(`E${index +2 }`).value(productos[index].serie)
            x.sheet(0).cell(`F${index +2 }`).value(productos[index].genero)
            x.sheet(0).cell(`G${index +2 }`).value(productos[index].tipoMontura)
            x.sheet(0).cell(`H${index +2 }`).value(productos[index].categoria)
            x.sheet(0).cell(`I${index +2 }`).value(productos[index].nombre)
            x.sheet(0).cell(`J${index +2 }`).value(productos[index].precio)
          }
          await  x.toFileAsync('./producto_precio.xlsx')
    return  {status:HttpStatus.OK} ;
  }

  findOne(id: number) {
    return this.producto.find();
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
