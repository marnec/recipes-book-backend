import { Logger, Type } from '@nestjs/common';
import { snake } from 'radash';
import { ErrorCode } from 'src/exception/application-exceptions.enum';
import { ApplicationException } from 'src/exception/application.exception';
import { objectPop } from 'src/shared/utils';
import { In, Like } from 'typeorm';
import { BasePaginatedFilterDto, Pageable } from './base-paginated-filter.dto';

export function FilteredPaginatedQuery<E>(entity: Type<E>): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const className = target?.name || target?.constructor?.name;
    const logger = new Logger(className);
    const targetMethod = descriptor.value;
    const methodDescriptor = descriptor;
    methodDescriptor.value = function (...args: any[]) {
      const dto = args[0] as BasePaginatedFilterDto;
      if (!(dto.constructor.prototype instanceof BasePaginatedFilterDto)) {
        throw new ApplicationException(
          'The first argument of a @FilteredQuery decorated method must extend BasePaginatedFilterDto',
          ErrorCode.invalidParameters
        );
      }

      const columnNames = Object.keys((entity as any)._OPENAPI_METADATA_FACTORY());

      const [page, size, sort] = objectPop(dto, ['page', 'size', 'sort']);

      Object.entries({ ...dto } as BasePaginatedFilterDto).forEach(([key, value]) => {
        if (typeof value === 'string') {
          if (value.includes('%')) {
            dto[key] = Like(value);
          }
        }

        if (key.slice(-3) === 'Ids') {
          objectPop(dto, [key]);
          const columnName = key.slice(0, -3);

          if (columnNames.includes(columnName)) {
            dto[columnName] = { id: In(value) };
          } else {
            logger.error(`Column '${columnName}' not in entity ${entity.name}. Removed from dto`);
            logger.error('Filtering through a many to many relation is not supported');
          }
        }

        if (key.slice(-2) === 'Id') {
          objectPop(dto, [key]);
          const columnName = snake(key.slice(0, -2));
          if (columnNames.includes(columnName)) {
            dto[columnName] = value;
          } else {
            logger.error(`Column '${columnName}' not in entity ${entity.name}. Removed from dto`);
          }
        }

        if (!columnNames.includes(key) && dto.hasOwnProperty(key)) {
          objectPop(dto, [key]);
          logger.error(`Column '${key}' not in entity ${entity.name}. Removed from dto`);
        }
      });

      const pageable = new Pageable({ page, size, sort });
      return targetMethod.call(this, ...args, pageable);
    };
    return methodDescriptor;
  };
}
