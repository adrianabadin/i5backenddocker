"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdSchema = void 0;
const zod_1 = require("zod");
exports.createAdSchema = zod_1.z.object({
    body: zod_1.z.object({
        importance: zod_1.z.string().refine((value) => {
            const parsed = parseInt(value);
            if (isNaN(parsed))
                return false;
            if (parsed > 0 && parsed < 5)
                return true;
            else
                return false;
        }, { message: 'Debes proveer un caracter de numero del 1 al 4' }),
        usersId: zod_1.z.string().min(3, { message: 'Debe se una cadena de al menos 3 caracteres' }),
        url: zod_1.z.string().min(3, { message: 'Debes proveer una cadena de al menos 3 caracteres' }).nullable().optional(),
        title: zod_1.z.string().min(3, { message: 'Debes proveer una cadena de al menos 3 carateres' })
    })
});
