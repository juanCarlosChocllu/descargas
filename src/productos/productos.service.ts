import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Producto } from 'src/schema';
import { Model, Types } from 'mongoose';
import { Precio, Servicio } from './schema/producto.schema';
import * as  xlsx from "xlsx-populate";
@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Producto.name) private readonly producto:Model<Producto>,
    @InjectModel(Precio.name) private readonly precio:Model<Precio>,
    @InjectModel(Servicio.name) private readonly servicio:Model<Servicio>
){}
 

  async  findAll() {
    const productos = [];
    const precios = await this.precio.find({ abreviatura: { $in: ['P1', 'P2', 'E2', 'E1'] } });
  
    // Promesas para manejar la consulta en paralelo
    const productosPromesas = precios.map(async (data) => {
      const producto = await this.producto.aggregate([
        {
          $match: {
            precios: { $elemMatch: { tipoPrecio: new Types.ObjectId(data._id) } },
            tipoProducto: { $ne: 'OTRO PRODUCTO' },
          },
        },
        {
          $lookup: {
            from: 'Marca',
            foreignField: '_id',
            localField: 'marca',
            as: 'marca',
          },
        },
        { $unwind: { path: '$marca', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'Color',
            foreignField: '_id',
            localField: 'color',
            as: 'color',
          },
        },
        { $unwind: { path: '$color', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'TipoMontura',
            foreignField: '_id',
            localField: 'tipoMontura',
            as: 'tipoMontura',
          },
        },
        { $unwind: { path: '$tipoMontura', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            tipoProducto: 1,
            marca: '$marca.nombre',
            color: '$color.nombre',
            serie: 1,
            genero: 1,
            categoria: 1,
            codigoQR: 1,
            precios: 1,
            tipoMontura: '$tipoMontura.nombre',
          },
        },
      ])
  
      return producto.map((p) => {
        const precio = p.precios.filter(
          (i) => String(i.tipoPrecio) === String(data._id)
        )[0].precio;
  
      
  
        return {
          nombre: data.nombre,
          tipoProducto: p.tipoProducto,
          marca: p.marca,
          color: p.color,
          serie: p.serie,
          genero: p.genero,
          categoria: p.categoria,
          codigoQR: p.codigoQR,
          precio: precio,
          tipoMontura: p.tipoMontura,
          id: String(p._id),
        };
      });
    });
  
    // Esperamos a que todas las promesas terminen
    const resultados = await Promise.all(productosPromesas);
    resultados.forEach((result) => productos.push(...result));
  
    // Creamos el archivo Excel de forma incremental
    const x = await xlsx.fromBlankAsync();
    x.sheet(0).cell('A1').value('id');
    x.sheet(0).cell('B1').value('codigoQR');
    x.sheet(0).cell('C1').value('producto');
    x.sheet(0).cell('D1').value('marca');
    x.sheet(0).cell('E1').value('color');
    x.sheet(0).cell('F1').value('serie');
    x.sheet(0).cell('G1').value('genero');
    x.sheet(0).cell('H1').value('tipo montura');
    x.sheet(0).cell('I1').value('categoria');
    x.sheet(0).cell('J1').value('tipo precio');
    x.sheet(0).cell('K1').value('precio');
  
    // Escribir los productos de forma incremental
    for (let index = 0; index < productos.length; index++) {
      const producto = productos[index];
      const rowIndex = index + 2; // Comienza en la fila 2
      x.sheet(0).cell(`A${rowIndex}`).value(producto.id);
      x.sheet(0).cell(`B${rowIndex}`).value(producto.codigoQR);
      x.sheet(0).cell(`C${rowIndex}`).value(producto.tipoProducto);
      x.sheet(0).cell(`D${rowIndex}`).value(producto.marca);
      x.sheet(0).cell(`E${rowIndex}`).value(producto.color);
      x.sheet(0).cell(`F${rowIndex}`).value(producto.serie);
      x.sheet(0).cell(`G${rowIndex}`).value(producto.genero);
      x.sheet(0).cell(`H${rowIndex}`).value(producto.tipoMontura);
      x.sheet(0).cell(`I${rowIndex}`).value(producto.categoria);
      x.sheet(0).cell(`J${rowIndex}`).value(producto.nombre);
      x.sheet(0).cell(`K${rowIndex}`).value(producto.precio);
    }
  
    // Guardar el archivo en el sistema
    await x.toFileAsync('./producto_precio.xlsx');
  
    // Devolver el estado
    return { status: 201, message: 'Archivo generado exitosamente' };
  }

  async servicios() {
    const servicios = [];
    const precios = await this.precio.find();
      
    const servicio =  precios.map(async (item)=> {
     const data=  await this.servicio.find({precios:{ $elemMatch: { tipoPrecio: new Types.ObjectId(item._id) } }})
     return data.map((p) => {
      const precio = p.precios.filter(
        (i) => String(i.tipoPrecio) === String(item._id)
      )[0].precio
       const data  = {
    tipoPrecio:item.nombre,
        id:String(p._id),
        nombre:p.nombre,
        descripcion:p.nombre,
        precio:precio
  }
      return data
    } )


    

    } )
    
    const s = await Promise.all(servicio)
    s.forEach((result) => servicios.push(...result))

    const x = await xlsx.fromBlankAsync();
    x.sheet(0).cell('A1').value('id');
    x.sheet(0).cell('B1').value('nombre');
    x.sheet(0).cell('C1').value('descripcion');
    x.sheet(0).cell('D1').value('tipo precio');
    x.sheet(0).cell('E1').value('monto');
  
  
    // Escribir los productos de forma incremental
    for (let index = 0; index < servicios.length; index++) {
      const producto = servicios[index];
      const rowIndex = index + 2; // Comienza en la fila 2
      x.sheet(0).cell(`A${rowIndex}`).value(producto.id);
      x.sheet(0).cell(`B${rowIndex}`).value(producto.nombre);
      x.sheet(0).cell(`C${rowIndex}`).value(producto.descripcion);
      x.sheet(0).cell(`D${rowIndex}`).value(producto.tipoPrecio);
      x.sheet(0).cell(`E${rowIndex}`).value(producto.precio);
        
        
        
    }
  

    await x.toFileAsync('./servicio.xlsx');
  
   
    return { status: 201, message: 'Archivo generado exitosamente' };
  }

}
