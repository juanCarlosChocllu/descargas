import { BadRequestException, HttpStatus, Inject, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cliente, Users } from "./schema";
import { Model } from "mongoose";
import { Console, log } from "node:console";

import * as  xlsx from "xlsx-populate";
import { flag } from "./enum";

export class ClienteService{
    constructor( @InjectModel(Cliente.name) private readonly clienteSchema:Model<Cliente> ){}
        
    async descargarCliente(){
        const cliente = await this.clienteSchema.find({flag:flag.nuevo}).limit(500)
        const x = await  xlsx.fromBlankAsync()
        x.sheet(0).cell(`A1`).value('Canal de adquisición')
        x.sheet(0).cell(`B1`).value('Estado')
        x.sheet(0).cell(`C1`).value('Empresa')
        x.sheet(0).cell(`D1`).value('Consulta')
        x.sheet(0).cell(`E1`).value('Notas')
        x.sheet(0).cell(`F1`).value('Etiquetas')
        x.sheet(0).cell(`G1`).value('Asignado a')
        x.sheet(0).cell(`H1`).value('Contacto 1 - Nombre')
        x.sheet(0).cell(`I1`).value('Contacto 1 - Apellido')
        x.sheet(0).cell(`J1`).value('Contacto 1 - Email')
        x.sheet(0).cell(`K1`).value('Contacto 1 - Email 2')
        x.sheet(0).cell(`L1`).value('Contacto 1 - Telefono 1')
        x.sheet(0).cell(`M1`).value('Contacto 1 - Telefono 2')

        x.sheet(0).cell(`N1`).value('Contacto 2 - Nombre')
        x.sheet(0).cell(`O1`).value('Contacto 2 - Apellido')
        x.sheet(0).cell(`P1`).value('Contacto 2 - Email')
        x.sheet(0).cell(`Q1`).value('Contacto 2 - Email 2')
        x.sheet(0).cell(`R1`).value('Contacto 2 - Telefono 1')
        x.sheet(0).cell(`S1`).value('Contacto 2 - Telefono 2')

        x.sheet(0).cell(`T1`).value('Contacto 3 - Nombre')
        x.sheet(0).cell(`U1`).value('Contacto 3 - Apellido')
        x.sheet(0).cell(`V1`).value('Contacto 3 - Email')
        x.sheet(0).cell(`W1`).value('Contacto 3 - Email 2')
        x.sheet(0).cell(`X1`).value('Contacto 3 - Telefono 1')
        x.sheet(0).cell(`Y1`).value('Contacto 3 - Telefono 2')

        x.sheet(0).cell(`Z1`).value('Contacto 4 - Nombre')
        x.sheet(0).cell(`AA1`).value('Contacto 4 - Apellido')
        x.sheet(0).cell(`AB1`).value('Contacto 4 - Email')
        x.sheet(0).cell(`AC1`).value('Contacto 4 - Email 2')
        x.sheet(0).cell(`AD1`).value('Contacto 4 - Telefono 1')
        x.sheet(0).cell(`AE1`).value('Contacto 4 - Telefono 2')


        x.sheet(0).cell(`AF1`).value('Campo personalizado: XXXX')
        x.sheet(0).cell(`AG1`).value('Campo personalizado: XXXX')
        x.sheet(0).cell(`AH1`).value('Campo personalizado: XXXX')
        for(let data=0; data < cliente.length; data ++){
                    x.sheet(0).cell(`H${data +2 }`).value(cliente[data].nombre)
                    x.sheet(0).cell(`I${data +2 }`).value(`${cliente[data].ap_materno} ${cliente[data].ap_materno}`)
                    x.sheet(0).cell(`J${data + 2 }`).value(cliente[data].email)
                    x.sheet(0).cell(`K${data +2 }`).value('')
                    x.sheet(0).cell(`L${data +2 }`).value(cliente[data].telefono)
                    x.sheet(0).cell(`M${data +2 }`).value(cliente[data].celular)
        }
        await  x.toFileAsync('./planilla_carga_masiva.xlsx')
        return  {status:HttpStatus.OK}    
    }

}