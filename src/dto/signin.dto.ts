import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export class SigninDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  username?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(emailRegEx, {
    message:
      'email must be a valid email address with a proper domain and format',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters,
          at least one uppercase letter,
          one lowercase letter,
          one number and
          one special character`,
  })
  password: string;
}
