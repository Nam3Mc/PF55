import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreloadServices } from './preload.service';

@Controller('preload')
export class PreloadController {
  constructor(
    private readonly preloadService: PreloadServices
  ) {}

  @Post()
  initialPreload(){
    return this.preloadService.onApplicationBootstrap()
  }

}
