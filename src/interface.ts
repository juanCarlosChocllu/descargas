import { Types } from "mongoose"

export interface LentaAI{
    _id: string
    totalLente:number
    lentesRepetidos:string[]
}



export interface LenteStock{
    lente:string
    idStock:string
    codigo:string
    cantidad:number,
    almacen:string
}


export interface StockI {     
    almacen: Types.ObjectId;         
    cantidad: number;
    lente:Types.ObjectId,             
    tipo: "almacen";         
    flag: "nuevo";           
     
}


export interface PrecioI{
    tipoPrecio:string
    precio: number
    flag: string
    tipoProducto: string
    
fechains: Date
}
