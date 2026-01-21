import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Lente,SalidadLente,Stock, TotalStock, Venta}from './schema'
import { Model, Types } from 'mongoose';
import {LenteStock, StockI } from './interface';
import { flag } from './enum';
import { log } from 'console';


@Injectable()
export class AppService {

 /* constructor(
    @InjectModel(Lente.name)private readonly LenteSchema:Model<Lente>,
    @InjectModel(Stock.name) private readonly StockSchema:Model<Stock>,
    @InjectModel(TotalStock.name) private  TotalSchema:Model<TotalStock>,
    @InjectModel(Venta.name) private readonly  VentaSchema:Model<Venta>,
    @InjectModel(SalidadLente.name) private readonly  SalidaLenteSchema:Model<Venta>
  ){}
  async Lente() {
   const lente= await this.LenteSchema.find({flag:flag.nuevo})
   const cantidad =await this.LenteSchema.countDocuments({flag:flag.nuevo})
   const resultado={
    cantidad,
    lente
   }
   return resultado
  }


  async Stock(){
    const stock=  await this.StockSchema.find({flag:flag.nuevo,almacen:new Types.ObjectId('5eff2a981c1a1a6cd64ff232')})//alamacen optilab prueba    
    return stock
    

  }

  async lenteAgrupado(){
    const idLente=[]
     const lenteA= await this.LenteSchema.aggregate(
      [
        {
          $match:{flag:'nuevo'}
        },
        {
          $group:{
            _id:'$codigo',
            totalLente:{$sum: 1},
            lentesRepetidos:{$push:'$$ROOT'}
          }
        },
        {
          $match:{'totalLente':{$gt:1}}
        } 
      ]
     )
      lenteA.forEach((e)=>{
        e.lentesRepetidos.forEach((e)=>{  
         idLente.push(e['_id'])
      })
     })

    await this.eliminarLenteSinStock(idLente)   //elimina lente que no tenga documento stock  
    const lenteConSuStock=  await this.stockDeLenteRepetidos(idLente)
    const agrupadoPorCodigo=  this.agruparPorCodigo(lenteConSuStock) // agrupa por codigo  
    this.sumarYguardarNuevoStock(agrupadoPorCodigo)//suma i guarda los stock
     return agrupadoPorCodigo
  }
  async stockDeLenteRepetidos(id:string[]){
    
    const stockGrupo:any[]=[] 
    const lenteConCantidad:any[]=[]
    for (let i of id){
        
      const stock:any[] = await this.LenteSchema.aggregate([
        {
          $match: { _id: i }
        },
        {
          $lookup: {
            from: 'Stock',
            foreignField: 'lente',
            localField: '_id',
            as: 'stock'
          }
        },
        {
          $unwind: '$stock'
        },
        {
          $match: {
            'stock.almacen': new Types.ObjectId('5eff2a981c1a1a6cd64ff232'),
            'stock.flag':flag.nuevo
          
          }
        },
        {
          $group: {
            _id: '$_id', 
            codigo: { $first: '$codigo' }, 
            stock: { $push: '$stock' } 
          }
        }
      ]);
  
      stockGrupo.push(...stock)
      } 
     for(let e of stockGrupo){
         let data:LenteStock={
          lente:e._id,
          idStock:e.stock.map(item=> item._id),
          cantidad:e.stock.map((item:any)=> item.cantidad).reduce((total:number,cantidad:number)=> total + cantidad, 0),//suma la cantidad de dos o mas cantidades
          almacen:e.stock.map((item:any)=> item.almacen),
          codigo:e.codigo
         } 
         lenteConCantidad.push(data)    
      }   
        
    return lenteConCantidad
  }

  agruparPorCodigo(data:LenteStock[]){    
    let grupoData: { [codigo: string]: any[] } = {};
  for (let item of data) {
      let codigo:string = item.codigo;
    if (!grupoData[codigo]) {
        grupoData[codigo] = []; 
    }
    grupoData[codigo].push(item); 
   }
   const resultado = Object.keys(grupoData).map((key) => ({
    elemento: grupoData[key]
      }));

        
   return   resultado
   }

  async sumarYguardarNuevoStock(lenteAgrupado:any[]){ 
   for(let data of lenteAgrupado){         
    if(data.elemento.length> 1){ 

      
      for (let index = 0; index < data.elemento.length; index++) {
        const cantidad=data.elemento.map(item => item.cantidad).reduce((total:number,cantidad:number)=>total+cantidad,0)
        const stock = await this.StockSchema.findOne({lente:data.elemento[0].lente,almacen:data.elemento[index].almacen[0]})
         await this.StockSchema.findByIdAndUpdate(stock._id, {cantidad:cantidad})         
      }
     this.ActulizarIdVenta(...data.elemento)
     this.eliminarStockRepetido(data.elemento)
    this.eliminarStockRepetidoLente(data.elemento[0])
     console.log('...................');
     
    }
  }

  }

  private async ActulizarIdVenta(...idLente:LenteStock[]){
     for (let data of idLente){  

      const lente1= await  this.VentaSchema.findOne({lente1:new Types.ObjectId(data.lente)},'lente1')
      const lente2= await this.VentaSchema.findOne({lente2:new Types.ObjectId(data.lente)},'lente2')
      if(lente1){
       await this.VentaSchema.findByIdAndUpdate(lente1.id, {lente1:idLente[0].lente},{new:true})
       }
       if(lente2){
         await this.VentaSchema.findByIdAndUpdate(lente2.id, {lente2:idLente[0].lente}, {new:true})
       }
     }
     await this.ActualizarSalidaLente(idLente)
  }
  
  private async eliminarLenteSinStock(idLente:Lente[]){ 
    for(let id of idLente){
      const lenteStock=await this.LenteSchema.aggregate(
        [
          {
            $match:{_id:id}
          },
          {
            $lookup:{
              from:'Stock',
              foreignField:'lente',
              localField:'_id',
              as:'stock'
            }
          }
        ]
      )
      let lenteSinStock= lenteStock.filter((item)=> item.stock.length < 1);
      for( let l of  lenteSinStock){ 
        await this.LenteSchema.findByIdAndUpdate(l._id, {flag:flag.eliminado},{new:true})  //esta por verse
      }
    }
  }

   async ActualizarSalidaLente(data:any[]){
    for( let d of data){
        const salida = await this.SalidaLenteSchema.find({lente:d.lente})
       if(salida){

        for (let s of salida){        
          const respuesta = await  this.SalidaLenteSchema.findByIdAndUpdate(s.id, {lente:data[0].lente},{new:true})
    
        }
       }  
    } 
  }

  async eliminarStockRepetido(lenteConStock:any[]){

    const  dataRestante= lenteConStock.slice(1)
    
    for(let data of dataRestante ){
       data.idStock.map( async (item)=> await this.StockSchema.findByIdAndUpdate(item,{flag:flag.eliminado}) )   
         await this.LenteSchema.findOneAndUpdate(data.lente,{flag:flag.eliminado})
    }
    
  } 
  async eliminarStockRepetidoLente(lenteConStock:any){//elimina el estok del lente que se queta si tiene doble o mas stock

    if(lenteConStock.idStock.length > 1){
      lenteConStock.idStock.slice(1).map(async (item)=> await this.StockSchema.findByIdAndUpdate(item,{flag:flag.eliminado}) )
      
    }
  } */

}


