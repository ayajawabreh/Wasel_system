import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RouteService } from './route.service';
import { EstimateRouteDto } from './dto/estimate-route.dto';

@Controller('api/v1/routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post('estimate')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  estimateRoute(@Body() dto: EstimateRouteDto) {
    return this.routeService.estimateRoute(dto);
  }
}