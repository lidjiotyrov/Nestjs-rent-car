import { Injectable, Inject } from '@nestjs/common';
import { periodDto, rateDto } from "./rent-cars.dto";
import { PG_CONNECTION } from "../../constans";

@Injectable()
export class RentCarsService {
  constructor(@Inject(PG_CONNECTION) private conn: any) {
  }

  async amountsForThePeriod(body: rateDto, {startDate, endDate}: periodDto) {
    const diff = new Date( new Date(endDate).getTime() - new Date(startDate).getTime());
    const days = diff.getUTCDate();
    const rate = await this.conn.query(`SELECT * FROM public."Rate" WHERE name = '${body.rate}'`)
    const priceForRate = rate.rows[0].price
    let sale = 1;
    if(days >= 3 && days <= 5) {
      sale = 0.95
    }
    if(days >= 6 && days <= 14) {
      sale = 0.90
    }
    if(days >= 15 && days <= 30) {
      sale = 0.85
    }

    return priceForRate * days * sale;
  }

  async createSession(vin: string, {startDate, endDate}: periodDto) {
    const start = new Date(startDate).getDay()
    const end = new Date(endDate).getDay()
    console.log(start, end);
    if (start === 6 || start === 0) {
      return 'Начало аренды не может быть назначено на субботу или воскресенье'
    }
    if (end === 6 || end === 0) {
      return 'Конец аренды не может быть назначен на субботу или воскресенье'
    }
    const res = await this.conn.query(`SELECT * FROM public."Car" WHERE vin = '${vin}'`)
    const car = res.rows[0]
    const isRent = car.isRent;
    const diff = new Date( new Date().getTime() - new Date(car.modified).getTime());
    const days = diff.getUTCDate();
    const currentDate = new Date().toISOString()

    if (!isRent) {
      if (days > 3) {
        await this.conn.query(`INSERT INTO public."Session" ("uuid", "startDate", "endDate", "uuidCar")
                VALUES (uuid_generate_v4(), '${startDate}', '${endDate}', '${car.uuid}')`)
        await this.conn.query(`UPDATE public."Car" SET "isRent" = true WHERE vin = '${vin}'`)
        await this.conn.query(`UPDATE public."Car" SET "modified" = '${currentDate}' WHERE vin = '${vin}'`)

        return 'Автомобиль арендован'
      }
      else return 'С даты возвращения автомобиля не прошло 3 дня'
    }
    else {
      return 'Автомобиль находится в аренде'
    }

  }

  async reportByAllCars() {
    const resBySession = await this.conn.query(`SELECT * FROM public."Session"`)
    let days = 0
    resBySession.rows.forEach((session) => {
      const diff = new Date( new Date(session.endDate).getTime() - new Date(session.startDate).getTime());
      const d = diff.getUTCDate()
      days = days + d
    })

    return days
  }

  async reportByOneCar(vin: string) {
    const res = await this.conn.query(`SELECT * FROM public."Car" WHERE vin = '${vin}'`)
    const uuidCar = res.rows[0].uuid
    const resBySession = await this.conn.query(`SELECT * FROM public."Session" WHERE "uuidCar" = '${uuidCar}'`)

    let days = 0
    resBySession.rows.forEach((session) => {
      const diff = new Date( new Date(session.endDate).getTime() - new Date(session.startDate).getTime());
      const d = diff.getUTCDate()
      days = days + d
    })

    return `Количество дней аренды для ${res.rows[0].mark} ${res.rows[0].model} ${res.rows[0].num} состовляет ${days} дней`
  }
}