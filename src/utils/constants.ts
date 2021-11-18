import { SetMetadata } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
