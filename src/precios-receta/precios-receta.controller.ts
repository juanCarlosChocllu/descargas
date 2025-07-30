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

  @Get()
  findAll() {
    return this.preciosRecetaService.findAll();
  }

  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preciosRecetaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreciosRecetaDto: UpdatePreciosRecetaDto) {
    return this.preciosRecetaService.update(+id, updatePreciosRecetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preciosRecetaService.remove(+id);
  }
}
