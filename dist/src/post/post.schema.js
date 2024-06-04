"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoEraseSchema = exports.videoUploadSchema = exports.updatePostSchema = exports.getPostById = exports.createPostSchema = exports.getPostsSchema = exports.postCreateSchema = void 0;
const zod_1 = require("zod");
const Entities_1 = require("../Entities");
const videoSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    youtubeId: zod_1.z.string().min(3, { message: 'YoutubeId debe ser un string de al menos 3 letras' }),
    url: zod_1.z.string().optional()
});
exports.postCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().uuid(),
        createdAt: zod_1.z.date(),
        updatedAt: zod_1.z.date(),
        title: zod_1.z.string({ invalid_type_error: 'El titulo debe se una cadena', required_error: 'Debes proveer un titulo' }).min(3, 'La cadena debe contener al menos 3 caracteres'),
        subTitle: zod_1.z.string({ invalid_type_error: 'El subtitulo debe ser un string' }).nullable().optional(),
        heading: zod_1.z.string({ invalid_type_error: 'El encabezado debe se una cadena', required_error: 'Debes proveer un encabezado' }).min(3, 'La cadena debe contener al menos 3 caracteres'),
        text: zod_1.z.string({ invalid_type_error: 'El cuerpo debe se una cadena', required_error: 'Debes proveer un texto para la nota' }).min(3, 'La cadena debe contener al menos 3 caracteres'),
        classification: zod_1.z.enum(Entities_1.ClassificationArray, { invalid_type_error: `La clasificacion debe estar dentro de las siguientes opciones  ${Entities_1.ClassificationArray.join(',')}. `, required_error: 'Debes proveer una clasificacion' }),
        importance: zod_1.z.enum(['1', '2', '3', '4', '5'], { invalid_type_error: 'La importancia de la nota debe ser string de  un numero del 1 al 5' }),
        fbid: zod_1.z.string({ invalid_type_error: 'Facebook ID debe ser una cadena' }).nullable().optional(),
        author: zod_1.z.string({ invalid_type_error: 'El autor debe ser una cadena que represente el id del usuario', required_error: 'Debes proveer un autor' }).uuid({ message: 'El autor debe ser un UUID' }),
        video: zod_1.z.string().optional()
    })
});
exports.getPostsSchema = zod_1.z.object({
    query: zod_1.z.object({
        cursor: zod_1.z.string({ invalid_type_error: 'El cursor debe ser una cadena que represente un Timestamp()' }).min(3).optional(),
        title: zod_1.z.string({ invalid_type_error: 'El titulo debe ser una cadena' }).min(3, 'El titulo debe tener al menos 3 caracteres de longitud').optional(),
        search: zod_1.z.string({ invalid_type_error: 'El search string debe ser una cadena' }).min(3, 'El search field debe tener 3 caracteres de longitud').optional(),
        minDate: zod_1.z.string({ invalid_type_error: 'minDate debe ser una cadena' }).min(6, 'minDate debe tener al menos 6 caracteres de longitud').optional(),
        maxDate: zod_1.z.string({ invalid_type_error: 'maxDate debe ser una cadena' }).min(6, 'maxDate debe tener al menos 6 caracteres de longitud').optional(),
        category: zod_1.z.enum(Entities_1.ClassificationArray, { invalid_type_error: `La categoria debe pertenecer a ${Entities_1.ClassificationArray.join(',')}` }).optional()
    })
});
exports.createPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ invalid_type_error: 'El titulo debe ser una cadena' }).min(3, 'El titulo debe tener al menos 3 caracteres de longitud'),
        subTitle: zod_1.z.string({ invalid_type_error: 'El subtitulo debe ser una cadena' }).min(3, 'El subtitulo debe tener al menos 3 caracteres de longitud').optional(),
        heading: zod_1.z.string({ invalid_type_error: 'El encabezado de la nota debe ser una cadena' }).min(3, 'El encabezado de la nota debe tener al menos 3 caracteres de longitud'),
        text: zod_1.z.string({ invalid_type_error: 'El texto de la nota debe ser una cadena' }).min(3, 'El texto de la nota debe tener al menos 3 caracteres de longitud'),
        classification: zod_1.z.enum(Entities_1.ClassificationArray, { invalid_type_error: `La categoria debe pertenecer a ${Entities_1.ClassificationArray.join(',')}` }),
        importance: zod_1.z.enum(['1', '2', '3', '4', '5'], { invalid_type_error: 'La importancia de la nota debe ser string de  un numero del 1 al 5' }),
        author: zod_1.z.string({ invalid_type_error: 'El autor debe ser un string' }).uuid({ message: 'El autor debe ser una cadena que represente a un uuid' }),
        audio: zod_1.z.string().optional(),
        video: zod_1.z.string().optional()
    })
});
exports.getPostById = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string({ invalid_type_error: 'El ID debe ser una cadena' }).uuid({ message: 'La cadena debe ser un UUID' }) })
});
const imageSchema = zod_1.z.object({
    id: zod_1.z.string({ invalid_type_error: 'Images ID debe ser un string' }).uuid({ message: 'Images ID debe ser una cadena que represente a un uuid' }).optional(),
    fbid: zod_1.z.string({ invalid_type_error: 'Images FBID debe ser un string' }).uuid({ message: 'Images FBID debe ser una cadena que represente a un uuid' }),
    url: zod_1.z.string({ invalid_type_error: 'Images URL must be a string' }).url({ message: 'The string provided must be a URL' })
});
const stringifiedImage = zod_1.z.custom((data) => {
    try {
        const dataParsed = JSON.parse(data);
        imageSchema.parse(dataParsed);
        return true;
    }
    catch (e) {
        return false;
    }
});
exports.updatePostSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ invalid_type_error: 'El titulo debe ser una cadena' }).min(3, 'El titulo debe tener al menos 3 caracteres de longitud').optional(),
        subTitle: zod_1.z.string({ invalid_type_error: 'El subtitulo debe ser una cadena' }).min(3, 'El subtitulo debe tener al menos 3 caracteres de longitud').optional(),
        heading: zod_1.z.string({ invalid_type_error: 'El encabezado de la nota debe ser una cadena' }).min(3, 'El encabezado de la nota debe tener al menos 3 caracteres de longitud').optional(),
        text: zod_1.z.string({ invalid_type_error: 'El texto de la nota debe ser una cadena' }).min(3, 'El texto de la nota debe tener al menos 3 caracteres de longitud').optional(),
        classification: zod_1.z.enum(Entities_1.ClassificationArray, { invalid_type_error: `La categoria debe pertenecer a ${Entities_1.ClassificationArray.join(',')}` }).optional(),
        importance: zod_1.z.enum(['1', '2', '3', '4', '5'], { invalid_type_error: 'La importancia de la nota debe ser string de  un numero del 1 al 5' }).optional(),
        author: zod_1.z.string({ invalid_type_error: 'El autor debe ser un string' }).uuid({ message: 'El autor debe ser una cadena que represente a un uuid' }).optional(),
        fbid: zod_1.z.string({ invalid_type_error: 'Post FBID must be a string' }),
        dbImages: zod_1.z.array(stringifiedImage).optional(),
        audio: zod_1.z.string().optional(),
        video: zod_1.z.string().optional()
    })
});
exports.videoUploadSchema = zod_1.z.object({
    body: zod_1.z.object({
        url: zod_1.z.string().url({ message: 'Debe contener una url valida' }).optional(),
        title: zod_1.z.string().min(3, { message: 'El titulo debe tener al menos 3 letras' }).optional(),
        description: zod_1.z.string().min(3, { message: 'La descripcion debe tener al menos 3 letas' }).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional()
    }).refine((value) => {
        if (value.url !== undefined)
            return true;
        else if (value.title !== undefined && value.description !== undefined)
            return true;
        return false;
    })
});
exports.videoEraseSchema = zod_1.z.object({
    query: zod_1.z.object({
        youtubeId: zod_1.z.string().min(3, { message: 'El youtube ID debe tener al menos 3 letras' })
    })
});
const audioSchema = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: 'Debe ser un uuid de la base de datos' }),
    driveId: zod_1.z.string().uuid({ message: 'Debe ser un UUID de google' })
});
const postManResponse = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    createdAt: zod_1.z.date({ invalid_type_error: 'Debe ser una fecha valida' }),
    title: zod_1.z.string().min(3, { message: 'El titulo debe tener al menos 3 letras' }),
    heading: zod_1.z.string().min(3, { message: 'El encabezado debe tener al menos 3 letras' }),
    text: zod_1.z.string().min(3, { message: 'El texto debe tener al menos 3 letras' }),
    classification: zod_1.z.string().min(3, { message: 'La clasificacion debe tener al menos 3 letras' }),
    importance: zod_1.z.number(),
    fbid: zod_1.z.string().min(3, { message: 'El fbid debe tener al menos 3 letras' }),
    isVisible: zod_1.z.boolean(),
    images: zod_1.z.array(imageSchema, { invalid_type_error: 'Debe ser un array de imagenes' }),
    audio: zod_1.z.array(audioSchema, { invalid_type_error: 'Debe ser un array de audioSchema' }),
    video: zod_1.z.array(videoSchema, { invalid_type_error: 'Debe ser un array de videoSchema' }),
    avatar: zod_1.z.string().url({ message: 'El avatar debe ser un link a la imagen de avatar' }),
    birthDate: zod_1.z.date(),
    lastName: zod_1.z.string().min(3, { message: 'El apellido debe ser una cadena de al menos 3 letras' }),
    name: zod_1.z.string().min(3, { message: 'El nombre debe ser una cadena de al menos 3 letras' }),
    isVerified: zod_1.z.boolean()
});
