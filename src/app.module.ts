import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {RentCarsModule} from "./modules/rent-cars/rent-cars.module";
import { PgPromiseModule } from "./modules/pgmodule/pgpromise.module";

@Module({
  imports: [
    PgPromiseModule,
    RentCarsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
