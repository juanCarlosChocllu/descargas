import { BadRequestException, HttpStatus, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UbicacionTrabajo, Users } from "./schema";
import { Model, Types } from "mongoose";
import { Console, log } from "node:console";

import * as xlsx from "xlsx-populate";
import { types } from "node:util";

export class UserService{
    constructor( 
        @InjectModel(Users.name) private readonly userSchema:Model<Users>,
        @InjectModel(UbicacionTrabajo.name) private readonly ubicacionSchema:Model<UbicacionTrabajo>
     ){}
    async descargaUser(){
        const user= await  this.userSchema.aggregate([
            {
                $match:{
                    flag:'nuevo',
                    tipo:{$ne:'cliente'}
                }
            },
            {
                $lookup:{
                    from:'Sucursal',
                    foreignField:'_id',
                    localField:'sucursal',
                    as :'sucursal'
                },
              
            },
            {
                $unwind:{path:'$sucursal',preserveNullAndEmptyArrays:true}
            },
            {
                $project:{
                    nombre:1,
                    ap_paterno:1,
                    ap_materno:1,
                    sucursal:1,
                    isActive:1
                }
            }


        ])   

      try {
        const x = await  xlsx.fromBlankAsync()
        x.sheet(0).cell(`A1`).value('id')
        x.sheet(0).cell(`B1`).value('nombre')
        x.sheet(0).cell(`C1`).value('apellido paterno')
        x.sheet(0).cell(`D1`).value('apellido materno')
        x.sheet(0).cell(`E1`).value('sucursal')
        x.sheet(0).cell(`F1`).value('estado')
        x.sheet(0).cell(`G1`).value('ubicacion')
          for(let data=0; data < user.length; data ++  ){   
            const sucursal = user[data].sucursal.nombre;            
            x.sheet(0).cell(`A${data +2 }`).value(user[data]['_id'].toString())
            x.sheet(0).cell(`B${data +2 }`).value(user[data].nombre)
            x.sheet(0).cell(`C${data + 2}`).value(user[data].ap_paterno)
            x.sheet(0).cell(`D${data + 2}`).value(user[data].ap_paterno)
            x.sheet(0).cell(`E${data + 2}`).value(sucursal)
            x.sheet(0).cell(`F${data + 2}`).value(user[data].isActive)
           }
          await  x.toFileAsync('./usuarios.xlsx')
           return  {status:HttpStatus.OK}
        
        
      } catch (error) {
        return new BadRequestException(error)
      }
        
    }


    descargarUserCrm(){
        
    }


    async actualizarUusuariosUbubicacion(){
    
      try {
        const excel = await xlsx.fromFileAsync('./usuarios.xlsx')
        const hoja=   excel.sheet('Sheet1').usedRange().value()
       const  u = hoja.map((item)=>item[6]);
        for(let t of u){
            if (t != undefined && t != 'ubicacion'){
                const ubicacion = await  this.ubicacionSchema.findOne({nombre:t.trim()})
                if(!ubicacion){
                    await this.ubicacionSchema.create({nombre:t.trim(), flag:'nuevo'})
                }            
            }
                
        }    
        for (let index = 2; index <= hoja.length; index++) {
            const id = excel.sheet('Sheet1').cell(`A${index}`).value()
            const nombre = excel.sheet('Sheet1').cell(`B${index}`).value()
            const ubicacion = excel.sheet('Sheet1').cell(`G${index}`).value()
            const usuario = await this.userSchema.exists({_id:new Types.ObjectId(`${id}`)})      
            if(usuario){    
                if(ubicacion){
                   const ubi= await this.ubicacionSchema.findOne({nombre:ubicacion})
                   if(ubi){
                    await this.userSchema.findByIdAndUpdate(id, {$set:{ubicacionTrabajo: new Types.ObjectId(ubi._id)}}, {new:true}) 
                   }
                   
                }
                await this.userSchema.findByIdAndUpdate(id, {isActive:false})     
            }else{
                console.log('usuario no encontrado', nombre)
            }     
        }
        return {status:HttpStatus.OK}
        
      } catch (error) {
        console.log(error);
        
        throw new BadRequestException() 
      }
    }

}