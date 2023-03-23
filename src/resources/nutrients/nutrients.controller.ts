import { Controller } from '@nestjs/common';
import { NutrientsService } from './nutrients.service';

@Controller('nutrients')
export class NutrientsController {
  constructor(private readonly nutrientsService: NutrientsService) {}
}
