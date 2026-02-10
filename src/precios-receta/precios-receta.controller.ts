import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
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

  @Post('recetaNovar')
  recetaNovar(@Body() createPreciosRecetaDto: CreatePreciosRecetaDto) {
    return this.preciosRecetaService.recetaNovar();
  }

  @Post('sincro')
  sincroNovar(@Body() createPreciosRecetaDto: CreatePreciosRecetaDto) {
    return this.preciosRecetaService.sincroNovar();
  }

  @Post('errores/:corregir')
  errores(@Param('corregir') corregir: string) {
    return this.preciosRecetaService.errores(corregir);
  }

  @Post('py2')
  eliminarpy2() {
    return this.preciosRecetaService.eliminarpy2();
  }

  @Post('actualizar/rangos')
  actualizarRangos() {
    return this.preciosRecetaService.actualizarRangos();
  }

    @Get('descargar/lente')
  descargarLente() {
    return this.preciosRecetaService.descargarLente();
  }
  
  @Get('descargar/combinacion')
  descargarLente2() {
    return this.preciosRecetaService.descargarLente2();
  }

  @Get('lente/organizar')
  reorganizarLente() {
    return this.preciosRecetaService.reorganizarLente();
  }

  
  @Get('tipoLente')
  tipoLente() {
    return this.preciosRecetaService.tipoLente();
  }
  @Get('material')
  material() {
    return this.preciosRecetaService.material();
  }
  @Get('tipoColor')
  tipoColor() {
    return this.preciosRecetaService.tipoColor();
  }
  @Get('color')
  color() {
    return this.preciosRecetaService.color();
  }


    @Get('tipoLente/cargar')
  tipoLentecargar() {
    return this.preciosRecetaService.tipoLenteCargar();
  }
  @Get('material/cargar')
  materialcargar() {
    return this.preciosRecetaService.materialCargar();
  }
  @Get('tipoColor/cargar')
  tipoColorcargar() {
    return this.preciosRecetaService.tipoColorCargar();
  }
  @Get('color/cargar')
  colorcargar() {
    return this.preciosRecetaService.colorCargar();
  }

  @Get('combinacionesLente/cargar')
  combinacionesLente() {
    return this.preciosRecetaService.combinacionesLente();
  }


}
