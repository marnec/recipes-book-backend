import { Logger } from '@nestjs/common';
import { ApplicationException } from 'src/exception/application.exception';

export const objectPop = <T = any>(obj: any, keys: string[], ignoreErrors= true): T[] => {
    const logger = new Logger(objectPop.name);
    const values: any[] = [];

    for (const key of keys) {
        if (!(key in obj)) {
            logger.error(`key '${key}' not in object: ${obj}`)
            throw new ApplicationException(`key '${key}' not in object`)
        }

        values.push(obj[key]);
        delete obj[key]
    }

    return values;
}