import { Injectable } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { config } from 'dotenv';

config();
console.log('JWT_SECRET from env:', process.env.JWT_TOKEN);
export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_TOKEN,
    global: true,
    signOptions: {
      expiresIn: process.env.JWT_TOKEN_EXPIRY,
    },
  }),
);
