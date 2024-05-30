"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createPostSchema: function() {
        return createPostSchema;
    },
    getPostById: function() {
        return getPostById;
    },
    getPostsSchema: function() {
        return getPostsSchema;
    },
    postCreateSchema: function() {
        return postCreateSchema;
    },
    updatePostSchema: function() {
        return updatePostSchema;
    },
    videoEraseSchema: function() {
        return videoEraseSchema;
    },
    videoUploadSchema: function() {
        return videoUploadSchema;
    }
});
const _zod = require("zod");
const _Entities = require("../Entities");
const videoSchema = _zod.z.object({
    id: _zod.z.string().uuid(),
    youtubeId: _zod.z.string().min(3, {
        message: 'YoutubeId debe ser un string de al menos 3 letras'
    }),
    url: _zod.z.string().optional()
});
const postCreateSchema = _zod.z.object({
    body: _zod.z.object({
        id: _zod.z.string().uuid(),
        createdAt: _zod.z.date(),
        updatedAt: _zod.z.date(),
        title: _zod.z.string({
            invalid_type_error: 'El titulo debe se una cadena',
            required_error: 'Debes proveer un titulo'
        }).min(3, 'La cadena debe contener al menos 3 caracteres'),
        subTitle: _zod.z.string({
            invalid_type_error: 'El subtitulo debe ser un string'
        }).nullable().optional(),
        heading: _zod.z.string({
            invalid_type_error: 'El encabezado debe se una cadena',
            required_error: 'Debes proveer un encabezado'
        }).min(3, 'La cadena debe contener al menos 3 caracteres'),
        text: _zod.z.string({
            invalid_type_error: 'El cuerpo debe se una cadena',
            required_error: 'Debes proveer un texto para la nota'
        }).min(3, 'La cadena debe contener al menos 3 caracteres'),
        classification: _zod.z.enum(_Entities.ClassificationArray, {
            invalid_type_error: `La clasificacion debe estar dentro de las siguientes opciones  ${_Entities.ClassificationArray.join(',')}. `,
            required_error: 'Debes proveer una clasificacion'
        }),
        importance: _zod.z.enum([
            '1',
            '2',
            '3',
            '4',
            '5'
        ], {
            invalid_type_error: 'La importancia de la nota debe ser string de  un numero del 1 al 5'
        }),
        fbid: _zod.z.string({
            invalid_type_error: 'Facebook ID debe ser una cadena'
        }).nullable().optional(),
        author: _zod.z.string({
            invalid_type_error: 'El autor debe ser una cadena que represente el id del usuario',
            required_error: 'Debes proveer un autor'
        }).uuid({
            message: 'El autor debe ser un UUID'
        }),
        video: _zod.z.string().optional()
    })
});
const getPostsSchema = _zod.z.object({
    query: _zod.z.object({
        cursor: _zod.z.string({
            invalid_type_error: 'El cursor debe ser una cadena que represente un Timestamp()'
        }).min(3).optional(),
        title: _zod.z.string({
            invalid_type_error: 'El titulo debe ser una cadena'
        }).min(3, 'El titulo debe tener al menos 3 caracteres de longitud').optional(),
        search: _zod.z.string({
            invalid_type_error: 'El search string debe ser una cadena'
        }).min(3, 'El search field debe tener 3 caracteres de longitud').optional(),
        minDate: _zod.z.string({
            invalid_type_error: 'minDate debe ser una cadena'
        }).min(6, 'minDate debe tener al menos 6 caracteres de longitud').optional(),
        maxDate: _zod.z.string({
            invalid_type_error: 'maxDate debe ser una cadena'
        }).min(6, 'maxDate debe tener al menos 6 caracteres de longitud').optional(),
        category: _zod.z.enum(_Entities.ClassificationArray, {
            invalid_type_error: `La categoria debe pertenecer a ${_Entities.ClassificationArray.join(',')}`
        }).optional()
    })
});
const createPostSchema = _zod.z.object({
    body: _zod.z.object({
        title: _zod.z.string({
            invalid_type_error: 'El titulo debe ser una cadena'
        }).min(3, 'El titulo debe tener al menos 3 caracteres de longitud'),
        subTitle: _zod.z.string({
            invalid_type_error: 'El subtitulo debe ser una cadena'
        }).min(3, 'El subtitulo debe tener al menos 3 caracteres de longitud').optional(),
        heading: _zod.z.string({
            invalid_type_error: 'El encabezado de la nota debe ser una cadena'
        }).min(3, 'El encabezado de la nota debe tener al menos 3 caracteres de longitud'),
        text: _zod.z.string({
            invalid_type_error: 'El texto de la nota debe ser una cadena'
        }).min(3, 'El texto de la nota debe tener al menos 3 caracteres de longitud'),
        classification: _zod.z.enum(_Entities.ClassificationArray, {
            invalid_type_error: `La categoria debe pertenecer a ${_Entities.ClassificationArray.join(',')}`
        }),
        importance: _zod.z.enum([
            '1',
            '2',
            '3',
            '4',
            '5'
        ], {
            invalid_type_error: 'La importancia de la nota debe ser string de  un numero del 1 al 5'
        }),
        author: _zod.z.string({
            invalid_type_error: 'El autor debe ser un string'
        }).uuid({
            message: 'El autor debe ser una cadena que represente a un uuid'
        }),
        audio: _zod.z.string().optional(),
        video: _zod.z.string().optional()
    })
});
const getPostById = _zod.z.object({
    params: _zod.z.object({
        id: _zod.z.string({
            invalid_type_error: 'El ID debe ser una cadena'
        }).uuid({
            message: 'La cadena debe ser un UUID'
        })
    })
});
const imageSchema = _zod.z.object({
    id: _zod.z.string({
        invalid_type_error: 'Images ID debe ser un string'
    }).uuid({
        message: 'Images ID debe ser una cadena que represente a un uuid'
    }).optional(),
    fbid: _zod.z.string({
        invalid_type_error: 'Images FBID debe ser un string'
    }).uuid({
        message: 'Images FBID debe ser una cadena que represente a un uuid'
    }),
    url: _zod.z.string({
        invalid_type_error: 'Images URL must be a string'
    }).url({
        message: 'The string provided must be a URL'
    })
});
const stringifiedImage = _zod.z.custom((data)=>{
    try {
        const dataParsed = JSON.parse(data);
        imageSchema.parse(dataParsed);
        return true;
    } catch (e) {
        return false;
    }
});
const updatePostSchema = _zod.z.object({
    body: _zod.z.object({
        title: _zod.z.string({
            invalid_type_error: 'El titulo debe ser una cadena'
        }).min(3, 'El titulo debe tener al menos 3 caracteres de longitud').optional(),
        subTitle: _zod.z.string({
            invalid_type_error: 'El subtitulo debe ser una cadena'
        }).min(3, 'El subtitulo debe tener al menos 3 caracteres de longitud').optional(),
        heading: _zod.z.string({
            invalid_type_error: 'El encabezado de la nota debe ser una cadena'
        }).min(3, 'El encabezado de la nota debe tener al menos 3 caracteres de longitud').optional(),
        text: _zod.z.string({
            invalid_type_error: 'El texto de la nota debe ser una cadena'
        }).min(3, 'El texto de la nota debe tener al menos 3 caracteres de longitud').optional(),
        classification: _zod.z.enum(_Entities.ClassificationArray, {
            invalid_type_error: `La categoria debe pertenecer a ${_Entities.ClassificationArray.join(',')}`
        }).optional(),
        importance: _zod.z.enum([
            '1',
            '2',
            '3',
            '4',
            '5'
        ], {
            invalid_type_error: 'La importancia de la nota debe ser string de  un numero del 1 al 5'
        }).optional(),
        author: _zod.z.string({
            invalid_type_error: 'El autor debe ser un string'
        }).uuid({
            message: 'El autor debe ser una cadena que represente a un uuid'
        }).optional(),
        fbid: _zod.z.string({
            invalid_type_error: 'Post FBID must be a string'
        }),
        dbImages: _zod.z.array(stringifiedImage).optional(),
        audio: _zod.z.string().optional(),
        video: _zod.z.string().optional()
    })
});
const videoUploadSchema = _zod.z.object({
    body: _zod.z.object({
        url: _zod.z.string().url({
            message: 'Debe contener una url valida'
        }).optional(),
        title: _zod.z.string().min(3, {
            message: 'El titulo debe tener al menos 3 letras'
        }).optional(),
        description: _zod.z.string().min(3, {
            message: 'La descripcion debe tener al menos 3 letas'
        }).optional(),
        tags: _zod.z.array(_zod.z.string()).optional()
    }).refine((value)=>{
        if (value.url !== undefined) return true;
        else if (value.title !== undefined && value.description !== undefined) return true;
        return false;
    })
});
const videoEraseSchema = _zod.z.object({
    query: _zod.z.object({
        youtubeId: _zod.z.string().min(3, {
            message: 'El youtube ID debe tener al menos 3 letras'
        })
    })
});
const audioSchema = _zod.z.object({
    id: _zod.z.string().uuid({
        message: 'Debe ser un uuid de la base de datos'
    }),
    driveId: _zod.z.string().uuid({
        message: 'Debe ser un UUID de google'
    })
});
const postManResponse = _zod.z.object({
    id: _zod.z.string().uuid(),
    createdAt: _zod.z.date({
        invalid_type_error: 'Debe ser una fecha valida'
    }),
    title: _zod.z.string().min(3, {
        message: 'El titulo debe tener al menos 3 letras'
    }),
    heading: _zod.z.string().min(3, {
        message: 'El encabezado debe tener al menos 3 letras'
    }),
    text: _zod.z.string().min(3, {
        message: 'El texto debe tener al menos 3 letras'
    }),
    classification: _zod.z.string().min(3, {
        message: 'La clasificacion debe tener al menos 3 letras'
    }),
    importance: _zod.z.number(),
    fbid: _zod.z.string().min(3, {
        message: 'El fbid debe tener al menos 3 letras'
    }),
    isVisible: _zod.z.boolean(),
    images: _zod.z.array(imageSchema, {
        invalid_type_error: 'Debe ser un array de imagenes'
    }),
    audio: _zod.z.array(audioSchema, {
        invalid_type_error: 'Debe ser un array de audioSchema'
    }),
    video: _zod.z.array(videoSchema, {
        invalid_type_error: 'Debe ser un array de videoSchema'
    }),
    avatar: _zod.z.string().url({
        message: 'El avatar debe ser un link a la imagen de avatar'
    }),
    birthDate: _zod.z.date(),
    lastName: _zod.z.string().min(3, {
        message: 'El apellido debe ser una cadena de al menos 3 letras'
    }),
    name: _zod.z.string().min(3, {
        message: 'El nombre debe ser una cadena de al menos 3 letras'
    }),
    isVerified: _zod.z.boolean()
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wb3N0L3Bvc3Quc2NoZW1hLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHosIFpvZE9iamVjdCB9IGZyb20gJ3pvZCdcclxuaW1wb3J0IHsgQ2xhc3NpZmljYXRpb25BcnJheSB9IGZyb20gJy4uL0VudGl0aWVzJ1xyXG5pbXBvcnQgeyB0eXBlIFByaXNtYSB9IGZyb20gJ0BwcmlzbWEvY2xpZW50J1xyXG5cclxuY29uc3QgdmlkZW9TY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgaWQ6IHouc3RyaW5nKCkudXVpZCgpLFxyXG4gIHlvdXR1YmVJZDogei5zdHJpbmcoKS5taW4oMywgeyBtZXNzYWdlOiAnWW91dHViZUlkIGRlYmUgc2VyIHVuIHN0cmluZyBkZSBhbCBtZW5vcyAzIGxldHJhcycgfSksXHJcbiAgdXJsOiB6LnN0cmluZygpLm9wdGlvbmFsKClcclxufSlcclxuZXhwb3J0IGNvbnN0IHBvc3RDcmVhdGVTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgYm9keTogei5vYmplY3Qoe1xyXG4gICAgaWQ6IHouc3RyaW5nKCkudXVpZCgpLFxyXG4gICAgY3JlYXRlZEF0OiB6LmRhdGUoKSxcclxuICAgIHVwZGF0ZWRBdDogei5kYXRlKCksXHJcbiAgICB0aXRsZTogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdFbCB0aXR1bG8gZGViZSBzZSB1bmEgY2FkZW5hJywgcmVxdWlyZWRfZXJyb3I6ICdEZWJlcyBwcm92ZWVyIHVuIHRpdHVsbycgfSkubWluKDMsICdMYSBjYWRlbmEgZGViZSBjb250ZW5lciBhbCBtZW5vcyAzIGNhcmFjdGVyZXMnKSxcclxuICAgIHN1YlRpdGxlOiB6LnN0cmluZyh7IGludmFsaWRfdHlwZV9lcnJvcjogJ0VsIHN1YnRpdHVsbyBkZWJlIHNlciB1biBzdHJpbmcnIH0pLm51bGxhYmxlKCkub3B0aW9uYWwoKSxcclxuICAgIGhlYWRpbmc6IHouc3RyaW5nKHsgaW52YWxpZF90eXBlX2Vycm9yOiAnRWwgZW5jYWJlemFkbyBkZWJlIHNlIHVuYSBjYWRlbmEnLCByZXF1aXJlZF9lcnJvcjogJ0RlYmVzIHByb3ZlZXIgdW4gZW5jYWJlemFkbycgfSkubWluKDMsICdMYSBjYWRlbmEgZGViZSBjb250ZW5lciBhbCBtZW5vcyAzIGNhcmFjdGVyZXMnKSxcclxuICAgIHRleHQ6IHouc3RyaW5nKHsgaW52YWxpZF90eXBlX2Vycm9yOiAnRWwgY3VlcnBvIGRlYmUgc2UgdW5hIGNhZGVuYScsIHJlcXVpcmVkX2Vycm9yOiAnRGViZXMgcHJvdmVlciB1biB0ZXh0byBwYXJhIGxhIG5vdGEnIH0pLm1pbigzLCAnTGEgY2FkZW5hIGRlYmUgY29udGVuZXIgYWwgbWVub3MgMyBjYXJhY3RlcmVzJyksXHJcbiAgICBjbGFzc2lmaWNhdGlvbjogei5lbnVtKENsYXNzaWZpY2F0aW9uQXJyYXksIHsgaW52YWxpZF90eXBlX2Vycm9yOiBgTGEgY2xhc2lmaWNhY2lvbiBkZWJlIGVzdGFyIGRlbnRybyBkZSBsYXMgc2lndWllbnRlcyBvcGNpb25lcyAgJHtDbGFzc2lmaWNhdGlvbkFycmF5LmpvaW4oJywnKX0uIGAsIHJlcXVpcmVkX2Vycm9yOiAnRGViZXMgcHJvdmVlciB1bmEgY2xhc2lmaWNhY2lvbicgfSksXHJcbiAgICBpbXBvcnRhbmNlOiB6LmVudW0oWycxJywgJzInLCAnMycsICc0JywgJzUnXSwgeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdMYSBpbXBvcnRhbmNpYSBkZSBsYSBub3RhIGRlYmUgc2VyIHN0cmluZyBkZSAgdW4gbnVtZXJvIGRlbCAxIGFsIDUnIH0pLFxyXG4gICAgZmJpZDogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdGYWNlYm9vayBJRCBkZWJlIHNlciB1bmEgY2FkZW5hJyB9KS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXHJcbiAgICBhdXRob3I6IHouc3RyaW5nKHsgaW52YWxpZF90eXBlX2Vycm9yOiAnRWwgYXV0b3IgZGViZSBzZXIgdW5hIGNhZGVuYSBxdWUgcmVwcmVzZW50ZSBlbCBpZCBkZWwgdXN1YXJpbycsIHJlcXVpcmVkX2Vycm9yOiAnRGViZXMgcHJvdmVlciB1biBhdXRvcicgfSkudXVpZCh7IG1lc3NhZ2U6ICdFbCBhdXRvciBkZWJlIHNlciB1biBVVUlEJyB9KSxcclxuICAgIHZpZGVvOiB6LnN0cmluZygpLm9wdGlvbmFsKClcclxuICB9KVxyXG59KVxyXG5leHBvcnQgY29uc3QgZ2V0UG9zdHNTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgcXVlcnk6IHoub2JqZWN0KHtcclxuICAgIGN1cnNvcjogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdFbCBjdXJzb3IgZGViZSBzZXIgdW5hIGNhZGVuYSBxdWUgcmVwcmVzZW50ZSB1biBUaW1lc3RhbXAoKScgfSkubWluKDMpLm9wdGlvbmFsKCksXHJcbiAgICB0aXRsZTogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdFbCB0aXR1bG8gZGViZSBzZXIgdW5hIGNhZGVuYScgfSkubWluKDMsICdFbCB0aXR1bG8gZGViZSB0ZW5lciBhbCBtZW5vcyAzIGNhcmFjdGVyZXMgZGUgbG9uZ2l0dWQnKS5vcHRpb25hbCgpLFxyXG4gICAgc2VhcmNoOiB6LnN0cmluZyh7IGludmFsaWRfdHlwZV9lcnJvcjogJ0VsIHNlYXJjaCBzdHJpbmcgZGViZSBzZXIgdW5hIGNhZGVuYScgfSkubWluKDMsICdFbCBzZWFyY2ggZmllbGQgZGViZSB0ZW5lciAzIGNhcmFjdGVyZXMgZGUgbG9uZ2l0dWQnKS5vcHRpb25hbCgpLFxyXG4gICAgbWluRGF0ZTogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdtaW5EYXRlIGRlYmUgc2VyIHVuYSBjYWRlbmEnIH0pLm1pbig2LCAnbWluRGF0ZSBkZWJlIHRlbmVyIGFsIG1lbm9zIDYgY2FyYWN0ZXJlcyBkZSBsb25naXR1ZCcpLm9wdGlvbmFsKCksXHJcbiAgICBtYXhEYXRlOiB6LnN0cmluZyh7IGludmFsaWRfdHlwZV9lcnJvcjogJ21heERhdGUgZGViZSBzZXIgdW5hIGNhZGVuYScgfSkubWluKDYsICdtYXhEYXRlIGRlYmUgdGVuZXIgYWwgbWVub3MgNiBjYXJhY3RlcmVzIGRlIGxvbmdpdHVkJykub3B0aW9uYWwoKSxcclxuICAgIGNhdGVnb3J5OiB6LmVudW0oQ2xhc3NpZmljYXRpb25BcnJheSwgeyBpbnZhbGlkX3R5cGVfZXJyb3I6IGBMYSBjYXRlZ29yaWEgZGViZSBwZXJ0ZW5lY2VyIGEgJHtDbGFzc2lmaWNhdGlvbkFycmF5LmpvaW4oJywnKX1gIH0pLm9wdGlvbmFsKClcclxuXHJcbiAgfSlcclxufSlcclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVBvc3RTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgYm9keTogei5vYmplY3Qoe1xyXG4gICAgdGl0bGU6IHouc3RyaW5nKHsgaW52YWxpZF90eXBlX2Vycm9yOiAnRWwgdGl0dWxvIGRlYmUgc2VyIHVuYSBjYWRlbmEnIH0pLm1pbigzLCAnRWwgdGl0dWxvIGRlYmUgdGVuZXIgYWwgbWVub3MgMyBjYXJhY3RlcmVzIGRlIGxvbmdpdHVkJyksXHJcbiAgICBzdWJUaXRsZTogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdFbCBzdWJ0aXR1bG8gZGViZSBzZXIgdW5hIGNhZGVuYScgfSkubWluKDMsICdFbCBzdWJ0aXR1bG8gZGViZSB0ZW5lciBhbCBtZW5vcyAzIGNhcmFjdGVyZXMgZGUgbG9uZ2l0dWQnKS5vcHRpb25hbCgpLFxyXG4gICAgaGVhZGluZzogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdFbCBlbmNhYmV6YWRvIGRlIGxhIG5vdGEgZGViZSBzZXIgdW5hIGNhZGVuYScgfSkubWluKDMsICdFbCBlbmNhYmV6YWRvIGRlIGxhIG5vdGEgZGViZSB0ZW5lciBhbCBtZW5vcyAzIGNhcmFjdGVyZXMgZGUgbG9uZ2l0dWQnKSxcclxuICAgIHRleHQ6IHouc3RyaW5nKHsgaW52YWxpZF90eXBlX2Vycm9yOiAnRWwgdGV4dG8gZGUgbGEgbm90YSBkZWJlIHNlciB1bmEgY2FkZW5hJyB9KS5taW4oMywgJ0VsIHRleHRvIGRlIGxhIG5vdGEgZGViZSB0ZW5lciBhbCBtZW5vcyAzIGNhcmFjdGVyZXMgZGUgbG9uZ2l0dWQnKSxcclxuICAgIGNsYXNzaWZpY2F0aW9uOiB6LmVudW0oQ2xhc3NpZmljYXRpb25BcnJheSwgeyBpbnZhbGlkX3R5cGVfZXJyb3I6IGBMYSBjYXRlZ29yaWEgZGViZSBwZXJ0ZW5lY2VyIGEgJHtDbGFzc2lmaWNhdGlvbkFycmF5LmpvaW4oJywnKX1gIH0pLFxyXG4gICAgaW1wb3J0YW5jZTogei5lbnVtKFsnMScsICcyJywgJzMnLCAnNCcsICc1J10sIHsgaW52YWxpZF90eXBlX2Vycm9yOiAnTGEgaW1wb3J0YW5jaWEgZGUgbGEgbm90YSBkZWJlIHNlciBzdHJpbmcgZGUgIHVuIG51bWVybyBkZWwgMSBhbCA1JyB9KSxcclxuICAgIGF1dGhvcjogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdFbCBhdXRvciBkZWJlIHNlciB1biBzdHJpbmcnIH0pLnV1aWQoeyBtZXNzYWdlOiAnRWwgYXV0b3IgZGViZSBzZXIgdW5hIGNhZGVuYSBxdWUgcmVwcmVzZW50ZSBhIHVuIHV1aWQnIH0pLFxyXG4gICAgYXVkaW86IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcclxuICAgIHZpZGVvOiB6LnN0cmluZygpLm9wdGlvbmFsKClcclxuICB9KVxyXG59KVxyXG5leHBvcnQgY29uc3QgZ2V0UG9zdEJ5SWQgPSB6Lm9iamVjdCh7XHJcbiAgcGFyYW1zOiB6Lm9iamVjdCh7IGlkOiB6LnN0cmluZyh7IGludmFsaWRfdHlwZV9lcnJvcjogJ0VsIElEIGRlYmUgc2VyIHVuYSBjYWRlbmEnIH0pLnV1aWQoeyBtZXNzYWdlOiAnTGEgY2FkZW5hIGRlYmUgc2VyIHVuIFVVSUQnIH0pIH0pXHJcbn0pXHJcblxyXG5jb25zdCBpbWFnZVNjaGVtYSA9IHoub2JqZWN0KHtcclxuICBpZDogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdJbWFnZXMgSUQgZGViZSBzZXIgdW4gc3RyaW5nJyB9KS51dWlkKHsgbWVzc2FnZTogJ0ltYWdlcyBJRCBkZWJlIHNlciB1bmEgY2FkZW5hIHF1ZSByZXByZXNlbnRlIGEgdW4gdXVpZCcgfSkub3B0aW9uYWwoKSxcclxuICBmYmlkOiB6LnN0cmluZyh7IGludmFsaWRfdHlwZV9lcnJvcjogJ0ltYWdlcyBGQklEIGRlYmUgc2VyIHVuIHN0cmluZycgfSkudXVpZCh7IG1lc3NhZ2U6ICdJbWFnZXMgRkJJRCBkZWJlIHNlciB1bmEgY2FkZW5hIHF1ZSByZXByZXNlbnRlIGEgdW4gdXVpZCcgfSksXHJcbiAgdXJsOiB6LnN0cmluZyh7IGludmFsaWRfdHlwZV9lcnJvcjogJ0ltYWdlcyBVUkwgbXVzdCBiZSBhIHN0cmluZycgfSkudXJsKHsgbWVzc2FnZTogJ1RoZSBzdHJpbmcgcHJvdmlkZWQgbXVzdCBiZSBhIFVSTCcgfSlcclxufSlcclxuY29uc3Qgc3RyaW5naWZpZWRJbWFnZSA9IHouY3VzdG9tIDwgc3RyaW5nID4oKGRhdGEpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgZGF0YVBhcnNlZCA9IEpTT04ucGFyc2UoZGF0YSBhcyBzdHJpbmcpXHJcbiAgICBpbWFnZVNjaGVtYS5wYXJzZShkYXRhUGFyc2VkKVxyXG4gICAgcmV0dXJuIHRydWVcclxuICB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZSB9XHJcbn0pXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVQb3N0U2NoZW1hID0gei5vYmplY3Qoe1xyXG4gIGJvZHk6IHoub2JqZWN0KHtcclxuICAgIHRpdGxlOiB6LnN0cmluZyh7IGludmFsaWRfdHlwZV9lcnJvcjogJ0VsIHRpdHVsbyBkZWJlIHNlciB1bmEgY2FkZW5hJyB9KS5taW4oMywgJ0VsIHRpdHVsbyBkZWJlIHRlbmVyIGFsIG1lbm9zIDMgY2FyYWN0ZXJlcyBkZSBsb25naXR1ZCcpLm9wdGlvbmFsKCksXHJcbiAgICBzdWJUaXRsZTogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdFbCBzdWJ0aXR1bG8gZGViZSBzZXIgdW5hIGNhZGVuYScgfSkubWluKDMsICdFbCBzdWJ0aXR1bG8gZGViZSB0ZW5lciBhbCBtZW5vcyAzIGNhcmFjdGVyZXMgZGUgbG9uZ2l0dWQnKS5vcHRpb25hbCgpLFxyXG4gICAgaGVhZGluZzogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdFbCBlbmNhYmV6YWRvIGRlIGxhIG5vdGEgZGViZSBzZXIgdW5hIGNhZGVuYScgfSkubWluKDMsICdFbCBlbmNhYmV6YWRvIGRlIGxhIG5vdGEgZGViZSB0ZW5lciBhbCBtZW5vcyAzIGNhcmFjdGVyZXMgZGUgbG9uZ2l0dWQnKS5vcHRpb25hbCgpLFxyXG4gICAgdGV4dDogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdFbCB0ZXh0byBkZSBsYSBub3RhIGRlYmUgc2VyIHVuYSBjYWRlbmEnIH0pLm1pbigzLCAnRWwgdGV4dG8gZGUgbGEgbm90YSBkZWJlIHRlbmVyIGFsIG1lbm9zIDMgY2FyYWN0ZXJlcyBkZSBsb25naXR1ZCcpLm9wdGlvbmFsKCksXHJcbiAgICBjbGFzc2lmaWNhdGlvbjogei5lbnVtKENsYXNzaWZpY2F0aW9uQXJyYXksIHsgaW52YWxpZF90eXBlX2Vycm9yOiBgTGEgY2F0ZWdvcmlhIGRlYmUgcGVydGVuZWNlciBhICR7Q2xhc3NpZmljYXRpb25BcnJheS5qb2luKCcsJyl9YCB9KS5vcHRpb25hbCgpLFxyXG4gICAgaW1wb3J0YW5jZTogei5lbnVtKFsnMScsICcyJywgJzMnLCAnNCcsICc1J10sIHsgaW52YWxpZF90eXBlX2Vycm9yOiAnTGEgaW1wb3J0YW5jaWEgZGUgbGEgbm90YSBkZWJlIHNlciBzdHJpbmcgZGUgIHVuIG51bWVybyBkZWwgMSBhbCA1JyB9KS5vcHRpb25hbCgpLFxyXG4gICAgYXV0aG9yOiB6LnN0cmluZyh7IGludmFsaWRfdHlwZV9lcnJvcjogJ0VsIGF1dG9yIGRlYmUgc2VyIHVuIHN0cmluZycgfSkudXVpZCh7IG1lc3NhZ2U6ICdFbCBhdXRvciBkZWJlIHNlciB1bmEgY2FkZW5hIHF1ZSByZXByZXNlbnRlIGEgdW4gdXVpZCcgfSkub3B0aW9uYWwoKSxcclxuICAgIGZiaWQ6IHouc3RyaW5nKHsgaW52YWxpZF90eXBlX2Vycm9yOiAnUG9zdCBGQklEIG11c3QgYmUgYSBzdHJpbmcnIH0pLFxyXG4gICAgZGJJbWFnZXM6IHouYXJyYXkoc3RyaW5naWZpZWRJbWFnZSkub3B0aW9uYWwoKSxcclxuICAgIGF1ZGlvOiB6LnN0cmluZygpLm9wdGlvbmFsKCksXHJcbiAgICB2aWRlbzogei5zdHJpbmcoKS5vcHRpb25hbCgpXHJcblxyXG4gIH0pXHJcblxyXG59KVxyXG5cclxuZXhwb3J0IGNvbnN0IHZpZGVvVXBsb2FkU2NoZW1hID0gei5vYmplY3Qoe1xyXG4gIGJvZHk6IHoub2JqZWN0KHtcclxuICAgIHVybDogei5zdHJpbmcoKS51cmwoeyBtZXNzYWdlOiAnRGViZSBjb250ZW5lciB1bmEgdXJsIHZhbGlkYScgfSkub3B0aW9uYWwoKSxcclxuICAgIHRpdGxlOiB6LnN0cmluZygpLm1pbigzLCB7IG1lc3NhZ2U6ICdFbCB0aXR1bG8gZGViZSB0ZW5lciBhbCBtZW5vcyAzIGxldHJhcycgfSkub3B0aW9uYWwoKSxcclxuICAgIGRlc2NyaXB0aW9uOiB6LnN0cmluZygpLm1pbigzLCB7IG1lc3NhZ2U6ICdMYSBkZXNjcmlwY2lvbiBkZWJlIHRlbmVyIGFsIG1lbm9zIDMgbGV0YXMnIH0pLm9wdGlvbmFsKCksXHJcbiAgICB0YWdzOiB6LmFycmF5KHouc3RyaW5nKCkpLm9wdGlvbmFsKClcclxuXHJcbiAgfSkucmVmaW5lKCh2YWx1ZSkgPT4ge1xyXG4gICAgaWYgKHZhbHVlLnVybCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gdHJ1ZVxyXG4gICAgZWxzZSBpZiAodmFsdWUudGl0bGUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZS5kZXNjcmlwdGlvbiAhPT0gdW5kZWZpbmVkKSByZXR1cm4gdHJ1ZVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSlcclxufSlcclxuZXhwb3J0IGNvbnN0IHZpZGVvRXJhc2VTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgcXVlcnk6IHoub2JqZWN0KHtcclxuICAgIHlvdXR1YmVJZDogei5zdHJpbmcoKS5taW4oMywgeyBtZXNzYWdlOiAnRWwgeW91dHViZSBJRCBkZWJlIHRlbmVyIGFsIG1lbm9zIDMgbGV0cmFzJyB9KVxyXG4gIH0pXHJcbn0pXHJcblxyXG5jb25zdCBhdWRpb1NjaGVtYSA9IHoub2JqZWN0KHtcclxuICBpZDogei5zdHJpbmcoKS51dWlkKHsgbWVzc2FnZTogJ0RlYmUgc2VyIHVuIHV1aWQgZGUgbGEgYmFzZSBkZSBkYXRvcycgfSksXHJcbiAgZHJpdmVJZDogei5zdHJpbmcoKS51dWlkKHsgbWVzc2FnZTogJ0RlYmUgc2VyIHVuIFVVSUQgZGUgZ29vZ2xlJyB9KVxyXG59KVxyXG5jb25zdCBwb3N0TWFuUmVzcG9uc2UgPSB6Lm9iamVjdCh7XHJcbiAgaWQ6IHouc3RyaW5nKCkudXVpZCgpLFxyXG4gIGNyZWF0ZWRBdDogei5kYXRlKHsgaW52YWxpZF90eXBlX2Vycm9yOiAnRGViZSBzZXIgdW5hIGZlY2hhIHZhbGlkYScgfSksXHJcbiAgdGl0bGU6IHouc3RyaW5nKCkubWluKDMsIHsgbWVzc2FnZTogJ0VsIHRpdHVsbyBkZWJlIHRlbmVyIGFsIG1lbm9zIDMgbGV0cmFzJyB9KSxcclxuICBoZWFkaW5nOiB6LnN0cmluZygpLm1pbigzLCB7IG1lc3NhZ2U6ICdFbCBlbmNhYmV6YWRvIGRlYmUgdGVuZXIgYWwgbWVub3MgMyBsZXRyYXMnIH0pLFxyXG4gIHRleHQ6IHouc3RyaW5nKCkubWluKDMsIHsgbWVzc2FnZTogJ0VsIHRleHRvIGRlYmUgdGVuZXIgYWwgbWVub3MgMyBsZXRyYXMnIH0pLFxyXG4gIGNsYXNzaWZpY2F0aW9uOiB6LnN0cmluZygpLm1pbigzLCB7IG1lc3NhZ2U6ICdMYSBjbGFzaWZpY2FjaW9uIGRlYmUgdGVuZXIgYWwgbWVub3MgMyBsZXRyYXMnIH0pLFxyXG4gIGltcG9ydGFuY2U6IHoubnVtYmVyKCksXHJcbiAgZmJpZDogei5zdHJpbmcoKS5taW4oMywgeyBtZXNzYWdlOiAnRWwgZmJpZCBkZWJlIHRlbmVyIGFsIG1lbm9zIDMgbGV0cmFzJyB9KSxcclxuICBpc1Zpc2libGU6IHouYm9vbGVhbigpLFxyXG4gIGltYWdlczogei5hcnJheShpbWFnZVNjaGVtYSwgeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdEZWJlIHNlciB1biBhcnJheSBkZSBpbWFnZW5lcycgfSksXHJcbiAgYXVkaW86IHouYXJyYXkoYXVkaW9TY2hlbWEsIHsgaW52YWxpZF90eXBlX2Vycm9yOiAnRGViZSBzZXIgdW4gYXJyYXkgZGUgYXVkaW9TY2hlbWEnIH0pLFxyXG4gIHZpZGVvOiB6LmFycmF5KHZpZGVvU2NoZW1hLCB7IGludmFsaWRfdHlwZV9lcnJvcjogJ0RlYmUgc2VyIHVuIGFycmF5IGRlIHZpZGVvU2NoZW1hJyB9KSxcclxuICBhdmF0YXI6IHouc3RyaW5nKCkudXJsKHsgbWVzc2FnZTogJ0VsIGF2YXRhciBkZWJlIHNlciB1biBsaW5rIGEgbGEgaW1hZ2VuIGRlIGF2YXRhcicgfSksXHJcbiAgYmlydGhEYXRlOiB6LmRhdGUoKSxcclxuICBsYXN0TmFtZTogei5zdHJpbmcoKS5taW4oMywgeyBtZXNzYWdlOiAnRWwgYXBlbGxpZG8gZGViZSBzZXIgdW5hIGNhZGVuYSBkZSBhbCBtZW5vcyAzIGxldHJhcycgfSksXHJcbiAgbmFtZTogei5zdHJpbmcoKS5taW4oMywgeyBtZXNzYWdlOiAnRWwgbm9tYnJlIGRlYmUgc2VyIHVuYSBjYWRlbmEgZGUgYWwgbWVub3MgMyBsZXRyYXMnIH0pLFxyXG4gIGlzVmVyaWZpZWQ6IHouYm9vbGVhbigpXHJcblxyXG59KVxyXG5cclxuLypcclxuSW5mZXJlbmNpYSBkZSB0aXBvc1xyXG4qL1xyXG5leHBvcnQgdHlwZSBDcmVhdGVQb3N0VHlwZSA9IHouaW5mZXI8dHlwZW9mIGNyZWF0ZVBvc3RTY2hlbWE+XHJcbmV4cG9ydCB0eXBlIEdldFBvc3RzVHlwZSA9IHouaW5mZXI8dHlwZW9mIGdldFBvc3RzU2NoZW1hPlxyXG5leHBvcnQgdHlwZSBHZXRQb3N0QnlJZCA9IHouaW5mZXI8dHlwZW9mIGdldFBvc3RCeUlkPlxyXG5leHBvcnQgdHlwZSBVcGRhdGVQb3N0VHlwZSA9IHouaW5mZXI8dHlwZW9mIHVwZGF0ZVBvc3RTY2hlbWE+XHJcbmV4cG9ydCB0eXBlIEltYWdlc1NjaGVtYSA9IHouaW5mZXI8dHlwZW9mIGltYWdlU2NoZW1hPlxyXG5leHBvcnQgdHlwZSBWaWRlb1VwbG9hZCA9IHouaW5mZXI8dHlwZW9mIHZpZGVvVXBsb2FkU2NoZW1hPlxyXG5leHBvcnQgdHlwZSBWaWRlb0VyYXNlVHlwZSA9IHouaW5mZXI8dHlwZW9mIHZpZGVvRXJhc2VTY2hlbWE+XHJcbmV4cG9ydCB0eXBlIFBvc3RNYW5hZ2VyVHlwZSA9IHouaW5mZXI8dHlwZW9mIHBvc3RNYW5SZXNwb25zZT5cclxuIl0sIm5hbWVzIjpbImNyZWF0ZVBvc3RTY2hlbWEiLCJnZXRQb3N0QnlJZCIsImdldFBvc3RzU2NoZW1hIiwicG9zdENyZWF0ZVNjaGVtYSIsInVwZGF0ZVBvc3RTY2hlbWEiLCJ2aWRlb0VyYXNlU2NoZW1hIiwidmlkZW9VcGxvYWRTY2hlbWEiLCJ2aWRlb1NjaGVtYSIsInoiLCJvYmplY3QiLCJpZCIsInN0cmluZyIsInV1aWQiLCJ5b3V0dWJlSWQiLCJtaW4iLCJtZXNzYWdlIiwidXJsIiwib3B0aW9uYWwiLCJib2R5IiwiY3JlYXRlZEF0IiwiZGF0ZSIsInVwZGF0ZWRBdCIsInRpdGxlIiwiaW52YWxpZF90eXBlX2Vycm9yIiwicmVxdWlyZWRfZXJyb3IiLCJzdWJUaXRsZSIsIm51bGxhYmxlIiwiaGVhZGluZyIsInRleHQiLCJjbGFzc2lmaWNhdGlvbiIsImVudW0iLCJDbGFzc2lmaWNhdGlvbkFycmF5Iiwiam9pbiIsImltcG9ydGFuY2UiLCJmYmlkIiwiYXV0aG9yIiwidmlkZW8iLCJxdWVyeSIsImN1cnNvciIsInNlYXJjaCIsIm1pbkRhdGUiLCJtYXhEYXRlIiwiY2F0ZWdvcnkiLCJhdWRpbyIsInBhcmFtcyIsImltYWdlU2NoZW1hIiwic3RyaW5naWZpZWRJbWFnZSIsImN1c3RvbSIsImRhdGEiLCJkYXRhUGFyc2VkIiwiSlNPTiIsInBhcnNlIiwiZSIsImRiSW1hZ2VzIiwiYXJyYXkiLCJkZXNjcmlwdGlvbiIsInRhZ3MiLCJyZWZpbmUiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsImF1ZGlvU2NoZW1hIiwiZHJpdmVJZCIsInBvc3RNYW5SZXNwb25zZSIsIm51bWJlciIsImlzVmlzaWJsZSIsImJvb2xlYW4iLCJpbWFnZXMiLCJhdmF0YXIiLCJiaXJ0aERhdGUiLCJsYXN0TmFtZSIsIm5hbWUiLCJpc1ZlcmlmaWVkIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQW9DYUEsZ0JBQWdCO2VBQWhCQTs7SUFhQUMsV0FBVztlQUFYQTs7SUF4QkFDLGNBQWM7ZUFBZEE7O0lBaEJBQyxnQkFBZ0I7ZUFBaEJBOztJQXdEQUMsZ0JBQWdCO2VBQWhCQTs7SUErQkFDLGdCQUFnQjtlQUFoQkE7O0lBYkFDLGlCQUFpQjtlQUFqQkE7OztxQkFuRmdCOzBCQUNPO0FBR3BDLE1BQU1DLGNBQWNDLE1BQUMsQ0FBQ0MsTUFBTSxDQUFDO0lBQzNCQyxJQUFJRixNQUFDLENBQUNHLE1BQU0sR0FBR0MsSUFBSTtJQUNuQkMsV0FBV0wsTUFBQyxDQUFDRyxNQUFN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