import { BadRequestException, HttpStatus, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Users } from "./schema";
import { Model } from "mongoose";
import { Console, log } from "node:console";

import * as xlsx from "xlsx-populate";

export class UserService{
    constructor( @InjectModel(Users.name) private readonly userSchema:Model<Users> ){}
    async descargaUser(){
        const user= await  this.userSchema.aggregate([
            {
                $match:{
                    flag:'nuevo'                }
            },
            {
                $lookup:{
                    from:'Sucursal',
                    foreignField:'_id',
                    localField:'sucursal',
                    as :'sucursal',
                    pipeline:[
                    {
                        $project: {
                            _id:0,
                            sucursal:'$nombre'
                        }
                    }
                    ]
                },
              
            },
            {
                $unwind:{path:'$sucursal',preserveNullAndEmptyArrays:false}
            },

        
           
            {
                $project:{
                    nombre:1,
                    ap_paterno:1,
                    ap_materno:1,
                    sucursal:1
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
        x.sheet(0).cell(`F1`).value('ubicacion')
          for(let data=0; data < user.length; data ++  ){   
            const sucursal = user[data].sucursal;
            const sucursalNombre = sucursal ? sucursal.sucursal : 'Sin Sucursal';
      
            x.sheet(0).cell(`A${data +2 }`).value(user[data]['_id'].toString())
            x.sheet(0).cell(`B${data +2 }`).value(user[data].nombre)
            x.sheet(0).cell(`C${data + 2}`).value(user[data].ap_paterno)
            x.sheet(0).cell(`D${data + 2}`).value(user[data].ap_paterno)
            x.sheet(0).cell(`E${data + 2}`).value(sucursalNombre)
        
           }
           
          await  x.toFileAsync('./usuarios.xlsx')
           return  {status:HttpStatus.OK}
        
        
      } catch (error) {
        return new BadRequestException(error)
      }
        
    }


    descargarUserCrm(){
        
    }

}