import { Module } from '@nestjs/common';
import { RentCarsController } from './rent-cars.controller';
import { RentCarsService } from './rent-cars.service';
import { PgPromiseModule } from "../pgmodule/pgpromise.module";

@Module({
  imports: [PgPromiseModule],
  controllers: [RentCarsController],
  providers: [RentCarsService]
})
export class RentCarsModule {}
