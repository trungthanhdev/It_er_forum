import { Injectable } from "@nestjs/common";
import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";
import { config } from "dotenv";

config()
console.log("JWT_REFRESH_SECRET from env:", process.env.JWT_REFRESH_TOKEN);
export default registerAs(
    "jwt-refresh",
    (): JwtModuleOptions =>({
        secret: process.env.JWT_REFRESH_TOKEN,
        global: true,
        signOptions:{
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
        }
    }),
)
