import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { fullNameRegex, passwordRegex, userNameRegex } from '../utils/regex';

export class UserValidate {
  @IsEmail()
  @IsString({ message: 'O e-mail deve ser um texto.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @Matches(userNameRegex, {
    message: 'Digite seu nome completo.',
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  username: string;

  @Matches(passwordRegex, {
    message:
      'A senha deverá conter no mínimo 8 caracteres, contendo letras e números.',
  })
  password: string;

  @Matches(fullNameRegex, {
    message: 'Digite seu nome completo.',
  })
  name: string;
}
