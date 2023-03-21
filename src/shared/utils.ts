import { InternalServerErrorException, Logger } from '@nestjs/common';

export const objectPop = <T = any>(obj: any, keys: string[], ignoreErrors= true): T[] => {
    const logger = new Logger(objectPop.name);
    const values: any[] = [];

    for (const key of keys) {
        if (!(key in obj)) {
            logger.error(`key '${key}' not in object: ${obj}`)
            throw new InternalServerErrorException(`key '${key}' not in object`)
        }

        values.push(obj[key]);
        delete obj[key]
    }

    return values;
}