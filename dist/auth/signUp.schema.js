"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SignUpSchema", {
    enumerable: true,
    get: function() {
        return SignUpSchema;
    }
});
const _zod = require("zod");
const SignUpSchema = _zod.z.object({
    body: _zod.z.object({
        username: _zod.z.string().email({
            message: 'Debe ser un correo valido'
        }),
        password: _zod.z.string().min(3, {
            message: 'La contraseña debe tener al menos 3 caracteres'
        }),
        name: _zod.z.string().min(3, {
            message: 'El nombre debe tener al menos 3 caracteres'
        }),
        lastName: _zod.z.string().min(3, {
            message: 'El apellido debe tener al menos 3 caracteres'
        }),
        phone: _zod.z.string().min(3, {
            message: ' El telefono debe contener al menos 3 caracteres '
        }).refine((value)=>{
            for(let i = 0; i < value.length; i++){
                const result = parseInt(value[i]);
                if (isNaN(result)) {
                    return false;
                }
            }
            return true;
        }, {
            message: ' Los caracteres del telefono deben ser numericos '
        }),
        birthDate: _zod.z.string().min(10, {
            message: 'La fecha debe tener 10 caracteres'
        }).optional(),
        gender: _zod.z.enum([
            'MALE',
            'FEMALE',
            'NOT_BINARY'
        ], {
            invalid_type_error: 'El genero es requerido y debe ser: MALE, FEMALE, NOT_BINARY'
        }).optional()
    })
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdXRoL3NpZ25VcC5zY2hlbWEudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCdcclxuZXhwb3J0IGNvbnN0IFNpZ25VcFNjaGVtYSA9IHoub2JqZWN0KHtcclxuICBib2R5OiB6Lm9iamVjdCh7XHJcbiAgICB1c2VybmFtZTogei5zdHJpbmcoKS5lbWFpbCh7IG1lc3NhZ2U6ICdEZWJlIHNlciB1biBjb3JyZW8gdmFsaWRvJyB9KSxcclxuICAgIHBhc3N3b3JkOiB6LnN0cmluZygpLm1pbigzLCB7IG1lc3NhZ2U6ICdMYSBjb250cmFzZcOxYSBkZWJlIHRlbmVyIGFsIG1lbm9zIDMgY2FyYWN0ZXJlcycgfSksXHJcbiAgICBuYW1lOiB6LnN0cmluZygpLm1pbigzLCB7IG1lc3NhZ2U6ICdFbCBub21icmUgZGViZSB0ZW5lciBhbCBtZW5vcyAzIGNhcmFjdGVyZXMnIH0pLFxyXG4gICAgbGFzdE5hbWU6IHouc3RyaW5nKCkubWluKDMsIHsgbWVzc2FnZTogJ0VsIGFwZWxsaWRvIGRlYmUgdGVuZXIgYWwgbWVub3MgMyBjYXJhY3RlcmVzJyB9KSxcclxuICAgIHBob25lOiB6LnN0cmluZygpLm1pbigzLCB7IG1lc3NhZ2U6ICcgRWwgdGVsZWZvbm8gZGViZSBjb250ZW5lciBhbCBtZW5vcyAzIGNhcmFjdGVyZXMgJyB9KS5yZWZpbmUoKHZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlSW50KHZhbHVlW2ldKVxyXG4gICAgICAgIGlmIChpc05hTihyZXN1bHQpKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0sIHsgbWVzc2FnZTogJyBMb3MgY2FyYWN0ZXJlcyBkZWwgdGVsZWZvbm8gZGViZW4gc2VyIG51bWVyaWNvcyAnIH0pLFxyXG4gICAgYmlydGhEYXRlOiB6LnN0cmluZygpLm1pbigxMCwgeyBtZXNzYWdlOiAnTGEgZmVjaGEgZGViZSB0ZW5lciAxMCBjYXJhY3RlcmVzJyB9KS5vcHRpb25hbCgpLCAvLyBkYXRlKHtpbnZhbGlkX3R5cGVfZXJyb3I6XCJEZWJlcyBwcm92ZWVyIHVuYSBmZWNoYSB2YWxpZGFcIn0pLFxyXG4gICAgZ2VuZGVyOiB6LmVudW0oWydNQUxFJywgJ0ZFTUFMRScsICdOT1RfQklOQVJZJ10sIHsgaW52YWxpZF90eXBlX2Vycm9yOiAnRWwgZ2VuZXJvIGVzIHJlcXVlcmlkbyB5IGRlYmUgc2VyOiBNQUxFLCBGRU1BTEUsIE5PVF9CSU5BUlknIH0pLm9wdGlvbmFsKClcclxuXHJcbiAgfSlcclxufSlcclxuXHJcbmV4cG9ydCB0eXBlIFNpZ25VcFR5cGUgPSB6LmluZmVyPHR5cGVvZiBTaWduVXBTY2hlbWE+Wydib2R5J11cclxuIl0sIm5hbWVzIjpbIlNpZ25VcFNjaGVtYSIsInoiLCJvYmplY3QiLCJib2R5IiwidXNlcm5hbWUiLCJzdHJpbmciLCJlbWFpbCIsIm1lc3NhZ2UiLCJwYXNzd29yZCIsIm1pbiIsIm5hbWUiLCJsYXN0TmFtZSIsInBob25lIiwicmVmaW5lIiwidmFsdWUiLCJpIiwibGVuZ3RoIiwicmVzdWx0IiwicGFyc2VJbnQiLCJpc05hTiIsImJpcnRoRGF0ZSIsIm9wdGlvbmFsIiwiZ2VuZGVyIiwiZW51bSIsImludmFsaWRfdHlwZV9lcnJvciJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7OytCQUNhQTs7O2VBQUFBOzs7cUJBREs7QUFDWCxNQUFNQSxlQUFlQyxNQUFDLENBQUNDLE1BQU0sQ0FBQztJQUNuQ0MsTUFBTUYsTUFBQyxDQUFDQyxNQUFNLENBQUM7UUFDYkUsVUFBVUgsTUFBQyxDQUFDSSxNQUFNLEdBQUdDLEtBQUssQ0FBQztZQUFFQyxTQUFTO1FBQTRCO1FBQ2xFQyxVQUFVUCxNQUFDLENBQUNJLE1BQU0sR0FBR0ksR0FBRyxDQUFDLEdBQUc7WUFBRUYsU0FBUztRQUFpRDtRQUN4RkcsTUFBTVQsTUFBQyxDQUFDSSxNQUFNLEdBQUdJLEdBQUcsQ0FBQyxHQUFHO1lBQUVGLFNBQVM7UUFBNkM7UUFDaEZJLFVBQVVWLE1BQUMsQ0FBQ0ksTUFBTSxHQUFHSSxHQUFHLENBQUMsR0FBRztZQUFFRixTQUFTO1FBQStDO1FBQ3RGSyxPQUFPWCxNQUFDLENBQUNJLE1BQU0sR0FBR0ksR0FBRyxDQUFDLEdBQUc7WUFBRUYsU0FBUztRQUFvRCxHQUFHTSxNQUFNLENBQUMsQ0FBQ0M7WUFDakcsSUFBSyxJQUFJQyxJQUFJLEdBQUdBLElBQUlELE1BQU1FLE1BQU0sRUFBRUQsSUFBSztnQkFDckMsTUFBTUUsU0FBU0MsU0FBU0osS0FBSyxDQUFDQyxFQUFFO2dCQUNoQyxJQUFJSSxNQUFNRixTQUFTO29CQUNqQixPQUFPO2dCQUNUO1lBQ0Y7WUFDQSxPQUFPO1FBQ1QsR0FBRztZQUFFVixTQUFTO1FBQW9EO1FBQ2xFYSxXQUFXbkIsTUFBQyxDQUFDSSxNQUFNLEdBQUdJLEdBQUcsQ0FBQyxJQUFJO1lBQUVGLFNBQVM7UUFBb0MsR0FBR2MsUUFBUTtRQUN4RkMsUUFBUXJCLE1BQUMsQ0FBQ3NCLElBQUksQ0FBQztZQUFDO1lBQVE7WUFBVTtTQUFhLEVBQUU7WUFBRUMsb0JBQW9CO1FBQThELEdBQUdILFFBQVE7SUFFbEo7QUFDRiJ9