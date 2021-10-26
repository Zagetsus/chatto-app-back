import { validate } from 'class-validator';

interface ErrorInterface {
  property: string;
  description: any;
}

interface ValidationInterface {
  status: boolean;
  errors?: ErrorInterface[];
}

export async function validation(data: any): Promise<ValidationInterface> {
  const validated = await validate(data);

  if (validated.length === 0) {
    return { status: true };
  }

  const errors = [];

  for (let i = 0; i < validated.length; i++) {
    const error = validated[i];

    const newError = {
      property: error.property,
      description: Object.values(error.constraints).join('; '),
    };

    errors.push(newError);
  }

  return { status: false, errors };
}
