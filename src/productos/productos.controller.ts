import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

 
  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  
 
  @Get('servicio')
  servicio() {
    return this.productosService.servicios();
  }

  
  
}
