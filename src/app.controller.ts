import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user.service';
import { ClienteService } from './cliente.service';
import { ProductosService } from './productos.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,

    private readonly userService: UserService,
    private readonly clienteService: ClienteService,
    private readonly productosService: ProductosService
  ) {}

 /*@Get('lente')
  Lente() {
    return this.appService.Lente();
  }

  @Get('stock')
  async Stock(){
     return await  this.appService.Stock()
  }

  @Get('grupo')
  async LenteGrupo(){
     return await  this.appService.lenteAgrupado()
  }*/

  @Get('user/decargar/excel')
  async descargaUser(){
     return await  this.userService.descargaUser()
  }

  @Get('user/actualizar/ubicacion')
  async actualizarUusuariosUbubicacion(){
     return  this.userService.actualizarUusuariosUbubicacion()
  }

  @Get('cliente/decargar')
   descargarCliente(){
     return this.clienteService.descargarCliente()


  }

  @Get('productos/decargar')
  listarProductos(){
     return this.productosService.listarProductos()
  }
}
