"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const auth_service_1 = require("./auth.service");
const authService = new auth_service_1.AuthService();
passport_1.default.use('login', new passport_local_1.Strategy({ passReqToCallback: true }, authService.localLoginVerify));
passport_1.default.use('register', new passport_local_1.Strategy({ passReqToCallback: true }, authService.localSignUpVerify));
