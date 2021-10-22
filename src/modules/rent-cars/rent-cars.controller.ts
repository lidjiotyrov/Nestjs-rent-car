import {Inject, Controller, Body, Post, Get, Query} from '@nestjs/common';
import {RentCarsService} from "./rent-cars.service";
import { periodDto, rateDto, vinDto } from "./rent-cars.dto";

@Controller('rentCars')
export class RentCarsController {
  constructor(
    @Inject(RentCarsService)
    private readonly RentCarsService: RentCarsService
  ) {}

  @Post('/amountsForThePeriod')
  async postAmountsForThePeriod(@Body() body: rateDto, @Query() period: periodDto): Promise<number> {

    return await this.RentCarsService.amountsForThePeriod(body, period)
  }

  @Post('/createSession')
  async createNewSession(@Body() body: vinDto, @Query() period: periodDto) {

    return await this.RentCarsService.createSession(body.vin, period)
  }

  @Get('/reportByAllCars')
  async postReportByAllCars() {

    return await this.RentCarsService.reportByAllCars()
  }

  @Post('/reportByOneCar')
  async postReportByOneCar(@Body() body) {

    return await this.RentCarsService.reportByOneCar(body.vin)
  }
}
