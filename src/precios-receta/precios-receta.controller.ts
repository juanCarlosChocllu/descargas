import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreciosRecetaService } from './precios-receta.service';
import { CreatePreciosRecetaDto } from './dto/create-precios-receta.dto';
import { UpdatePreciosRecetaDto } from './dto/update-precios-receta.dto';

@Controller('precios/receta')
export class PreciosRecetaController {
  constructor(private readonly preciosRecetaService: PreciosRecetaService) {}

  @Post()
  create(@Body() createPreciosRecetaDto: CreatePreciosRecetaDto) {
    return this.preciosRecetaService.create(createPreciosRecetaDto);
  }
  
  @Post('2')
  crearCombiancion(@Body() createPreciosRecetaDto: CreatePreciosRecetaDto) {
    return this.preciosRecetaService.crearCombiancion();
  }
    @Post('actualizar')
  actualizarPrecios(@Body() createPreciosRecetaDto: CreatePreciosRecetaDto) {
    return this.preciosRecetaService.actualizarPrecios();
  }

  @Get()
  findAll() {
    return this.preciosRecetaService.findAll();
  }

  

  
}
