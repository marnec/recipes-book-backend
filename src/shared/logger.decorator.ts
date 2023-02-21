import { Logger } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { RequestContext } from '../custom-middleware/request-context';

const enum LEVELS {
  DEBUG = 'debug',
  ERROR = 'error',
  LOG = 'log',
  VERBOSE = 'verbose',
  WARN = 'warn'
}

/**
 * what you can specify from the logger decorator
 */
interface Opts {
  className?: string;
  logLevel?: string;
  description?: string;
  printUser?: boolean;
}

/**
 * try to explode the parameter
 * @param obj
 * @returns
 */
function objectRepresentation(obj: any): string {
  let repr: string;
  if (obj && typeof obj === 'object') {
    switch (true) {
      case obj.constructor === Array:
        repr = `[${objectRepresentation(obj[0])}${obj.length > 1 ? ', ...' : ''}] #${obj.length}`;
        break;
      case obj.constructor === Object:
        repr = `{${Object.keys(obj)
          .map(e => `<${e}>`)
          .join(', ')}}`;
        break;
      default:
        repr = obj.constructor.name;
    }
  } else {
    repr = JSON.stringify(obj);
  }
  return repr;
}

function defaultLogMessage(args: any[]): string {
  return `args: ${args.map(arg => objectRepresentation(arg)).join(', ')}`;
}

function replaceAll(stringInExam: string, search: string, replace: string): string {
  if (search && replace) {
    return stringInExam.split(search).join(replace);
  }
  return stringInExam;
}

/**
 * composition of the default user string in the logs
 * @param user
 * @returns
 */
function setUserFields(user: User): string {
  if (user != null) {
    const { name, email, id } = user;
    return `****User: name '${name}' email '${email}' id '${id}'****`;
  }
  return null;
} // setUserFields

/**
 * available three levels of logging at the moment
 * @param verbosityLevel
 * @returns
 */
function getCorrectLevels(verbosityLevel) {
  const levelsArr = [LEVELS.ERROR, LEVELS.WARN];
  if (verbosityLevel === 1) {
    levelsArr.push(LEVELS.LOG);
  }
  if (verbosityLevel === 2) {
    // log all levels
    levelsArr.push(LEVELS.LOG, LEVELS.DEBUG, LEVELS.VERBOSE);
  }
  return levelsArr as string[];
} // getCorrectLevels

function configLogLevel(options: Opts): string {
  const loggerLevel = process?.env?.DEFAULT_LOG_LEVEL || LEVELS.DEBUG;
  return options?.logLevel === LEVELS.DEBUG ||
    options?.logLevel === LEVELS.VERBOSE ||
    options?.logLevel === LEVELS.WARN ||
    options?.logLevel === LEVELS.LOG
    ? options.logLevel
    : loggerLevel;
}

export function logger(options?: Opts): MethodDecorator {
  const nestLevel = configLogLevel(options);
  // implement different verbosity levels from 0 (less verbose) to 2 (contains all the logs)
  const verbosityLevel = +process?.env?.VERBOSITY_LEVEL || 2;
  const verbosityLevelArr = getCorrectLevels(verbosityLevel);
  // flag that let print the user or not
  const printUser = process?.env?.PRINT_LOG_USER || options?.printUser;
  const nestDesc = options?.description || '';
  // construction from the description
  // take all the @[0-9]
  const atArr = nestDesc?.match(/@([0-9]+).(\w+)/g);
  // take the number of the property of the outer function
  const numFromAt = atArr?.map((atProp: string) => {
    return atProp.split(/@([0-9]+)./)[1];
  });
  // take the property written after the @[0-9]
  const propertyFromAt = atArr?.map((atProp: string) => {
    return atProp.split(/@([0-9]+)./)[2];
  });

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const nestClassName = options?.className || target?.name || target?.constructor?.name || '?';
    const nestLogger = new Logger(nestClassName);
    const targetMethod = descriptor.value;
    const myDescriptor = descriptor;

    let nestDescLoc = nestDesc;
    // eslint-disable-next-line func-names
    myDescriptor.value = function(...args: any[]) {
      // when said the number of the parameter of the function, specify the property
      // ex. @0.description or @1.name...
      if (atArr && atArr?.length) {
        atArr.forEach((at, index: number) => {
          // number of the property from the outer function
          // and property from the outer function combined together
          const arg = args[numFromAt?.[index]]?.[propertyFromAt?.[index]];
          // do not need this because it is not a class
          // when my description is provided and I want specifically those variables printed
          nestDescLoc = replaceAll(
            nestDescLoc,
            `@${numFromAt[index]}.${propertyFromAt[index]}`,
            arg
          );
          nestDescLoc = replaceAll(nestDescLoc, null, null);
        });
      } else {
        // print the default message with the args if no description is provided
        nestDescLoc = defaultLogMessage(args);
      }
      const userString = setUserFields(RequestContext.currentUser());
      if (verbosityLevelArr.includes(nestLevel)) {
        nestLogger[nestLevel](
          `${propertyKey} -> ${nestDescLoc} ${printUser ? '\n' + userString : ''}`
        );
      }
      return targetMethod.call(this, ...args);
    };
    return myDescriptor;
  };
}
