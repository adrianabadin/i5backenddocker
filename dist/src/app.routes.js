"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeHandler = void 0;
const auth_routes_1 = require("./auth/auth.routes");
const post_routes_1 = require("./post/post.routes");
const ads_routes_1 = __importDefault(require("./ads/ads.routes"));
function routeHandler(app) {
    app.use('/auth', auth_routes_1.authRoutes);
    app.use('/post', post_routes_1.postRouter);
    app.use('/ads', ads_routes_1.default);
    app.use('/', (req, res) => {
        console.log('root', req.path);
    });
}
exports.routeHandler = routeHandler;
