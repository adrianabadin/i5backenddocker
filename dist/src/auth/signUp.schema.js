"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpSchema = void 0;
const zod_1 = require("zod");
exports.SignUpSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().email({ message: 'Debe ser un correo valido' }),
        password: zod_1.z.string().min(3, { message: 'La contraseña debe tener al menos 3 caracteres' }),
        name: zod_1.z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
        lastName: zod_1.z.string().min(3, { message: 'El apellido debe tener al menos 3 caracteres' }),
        phone: zod_1.z.string().min(3, { message: ' El telefono debe contener al menos 3 caracteres ' }).refine((value) => {
            for (let i = 0; i < value.length; i++) {
                const result = parseInt(value[i]);
                if (isNaN(result)) {
                    return false;
                }
            }
            return true;
        }, { message: ' Los caracteres del telefono deben ser numericos ' }),
        birthDate: zod_1.z.string().min(10, { message: 'La fecha debe tener 10 caracteres' }).optional(),
        gender: zod_1.z.enum(['MALE', 'FEMALE', 'NOT_BINARY'], { invalid_type_error: 'El genero es requerido y debe ser: MALE, FEMALE, NOT_BINARY' }).optional()
    })
});
