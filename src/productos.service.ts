import { InjectModel } from "@nestjs/mongoose";
import { Precio, Producto, Sucursal } from "./schema";
import { Model, Types } from "mongoose";
import { log } from "console";


export class ProductosService {

    constructor( 
        
        @InjectModel(Producto.name) private readonly productoSchema:Model<Producto>,
        @InjectModel(Precio.name) private readonly precioSchema:Model<Precio>,
        @InjectModel(Sucursal.name) private readonly sucursalSchema:Model<Precio>
    
    ){}

    


    async listarProductos(){
        const data:any[]= []
      /*  const dataFormateada:any[]=[]

        const sucursal = await this.sucursalSchema.find({empresa:new Types.ObjectId('5cc8c7b4b9c0e54d37434d29')})
        for(let s of sucursal ){
            let dataObjec={
                sucursal :s.nombre,
                precios:s['precios']
                
            }
            data.push(dataObjec)
            
        }

        for(let d of data){
                console.log(d);
                
                for(let p of d.precios ){
                
                    const precio = await this.precioSchema.findOne({_id: p})
           
                    
                    const producto = await this.productoSchema.findOne({  precios: { $elemMatch: { tipoPrecio: precio._id }}})
                
                    if(producto){
                    for(let data2 of producto.precios ){
                        const dataProducto={
                            sucursal:d.sucursal,
                            producto : producto.tipoProducto, 
                            serie : producto.serie,
                            nombre: precio.nombre,
                            precio: data2.precio,
                            correlativo: producto.correlativo,
                            codigoQR: producto.codigoQR

                       }                      
                       dataFormateada.push(dataProducto)
                       break
                    }
                   }

                    
                    
                  
                                        
                    
                }

            }
        
     */
       const producto = await this.productoSchema.find().limit(100)


        for(let d of producto){
            for(let p of  d.precios ){
            const precio = await this.precioSchema.findOne({_id: p.tipoPrecio})
            const sucursal = await this.sucursalSchema.findOne({ precios: { $in: [precio._id] } }).select('nombre');
           if(sucursal){    
           const dataProducto={
            sucursal :sucursal.nombre, 
            producto : d.tipoProducto, 
            serie : d.serie,
            nombre: precio.nombre,
            precio: p.precio,
            correlativo: d.correlativo,
            codigoQR: d.codigoQR,
            fecha: p.fechains
            
       }
     
            data.push(dataProducto)  
           }
         }
         

         
         

        }
               
        

        return data
        }


    calcularProcenta(precio1:number, precio2:number){
        return (precio2 / precio1) * 100

        
    }

}