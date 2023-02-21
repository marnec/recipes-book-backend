import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

// ogni decorator riceve in input la richiesta e ritorna valori
// in questo caso la richiesta viene processata dalla funzione
// validate presente dentro a jwt strategy, se l'id utente
// presente dentro al token viene trovato nel DB, viene allegato
// e poi la richiesta arriva qui per esere processata
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.user;
  }
);
