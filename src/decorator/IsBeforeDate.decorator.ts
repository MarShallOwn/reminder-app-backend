import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
  } from 'class-validator';
  
  export function IsBeforeDate(
    property: string,
    validationOptions?: ValidationOptions,
  ) {
    return (object: any, propertyName: string) => {
      registerDecorator({
        name: 'isBeforeDate',
        target: object.constructor,
        propertyName,
        constraints: [property],
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            const relatedValue = (args.object as any)[relatedPropertyName];
            return value >= relatedValue;
          },
  
          defaultMessage(args: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            return `${propertyName} shouldn't be before ${relatedPropertyName}!`;
          },
        },
      });
    };
  }
  