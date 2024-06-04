"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.userLogged = void 0;
const socket_io_1 = require("socket.io");
const logger_service_1 = require("./Services/logger.service");
const app_middleware_1 = require("./app.middleware");
const connect_flash_1 = __importDefault(require("connect-flash"));
const zod_1 = require("zod");
const dotenvSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string({ required_error: 'Must provide  a URL to connect to the database' }),
    LOG_DIRECTORY: zod_1.z.string({ required_error: 'Must provide a path to the logs directory' }),
    TKN_EXPIRATION: zod_1.z.string({ required_error: 'Must define JWT duration' }),
    KEYS_PATH: zod_1.z.string({ required_error: 'Must provide a path to Crpto asimetric keys' }),
    CLIENTID: zod_1.z.string({ required_error: 'Must provide google client ID' }),
    CALLBACKURL: zod_1.z.string({ required_error: 'Must provide a callback URL for google o auth' }),
    CLIENTSECRET: zod_1.z.string({ required_error: 'Must provide client secret key for google' }),
    SIMETRICKEY: zod_1.z.string({ required_error: 'Must provide a simetricKey for simetric encriptation' }),
    FACEBOOK_APP_ID: zod_1.z.string({ required_error: 'Must provide facebook app ID' }),
    FACEBOOK_APP_SECRET: zod_1.z.string({ required_error: 'Must provide facebook app secret' }),
    FACEBOOK_APP_CB: zod_1.z.string({ required_error: 'Must provide a callback url for Facebook oauth' }),
    FACEBOOK_PAGE: zod_1.z.string({ required_error: 'Must provide a facebook page id you admin to post the news  ' }),
    FB_PAGE_TOKEN: zod_1.z.string({ required_error: 'Must provide a permanent token for the page' }),
    NEWSPAPER_URL: zod_1.z.string({ required_error: 'Must provide the front end URL' }),
    CLIENTID_BUCKET: zod_1.z.string({ required_error: 'Must provide google client ID for the bucket' }),
    CLIENTSECRET_BUCKET: zod_1.z.string({ required_error: 'Must provide client secret key for google bucket' }),
    CALLBACK_BUCKET: zod_1.z.string({ required_error: 'Must provide a callback URL for google o auth bucket' }),
    YOUTUBE_CHANNEL: zod_1.z.string({ invalid_type_error: 'Must provide a string as a channel id' }).optional(),
    TURSO_AUTH_TOKEN: zod_1.z.string({ required_error: 'Must provide a conection token' }),
    TURSO_DATABASE_URL: zod_1.z.string({ invalid_type_error: 'Must provide a database url' })
});
dotenvSchema.parse(process.env);
exports.userLogged = { isVerified: false, lastName: '', id: '', username: '', name: '', rol: '', accessToken: '', fbid: '' };
const PORT = process.env.PORT !== undefined ? process.env.PORT : 8080;
app_middleware_1.app.use((0, connect_flash_1.default)());
exports.server = app_middleware_1.app.listen(PORT, () => {
    logger_service_1.logger.info(`Escuchando puerto ${PORT}`);
});
exports.io = new socket_io_1.Server(exports.server, { cors: { origin: 'http://localhost:3000/', methods: ['PUT', 'POST', 'GET'] } });
exports.io.on('connection', () => { console.log('connection'); });
