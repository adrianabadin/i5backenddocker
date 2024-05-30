"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "postValidation", {
    enumerable: true,
    get: function() {
        return postValidation;
    }
});
const _expressvalidator = require("express-validator");
const _Entities = require("../Entities");
const _loggerservice = require("../Services/logger.service");
const postValidation = [
    (0, _expressvalidator.body)('title').isString().withMessage('El titulo debe ser un String').isLength({
        min: 3
    }).withMessage('Debe tener al menos 3 caracteres'),
    (0, _expressvalidator.body)('heading').isString().withMessage('El encabezado debe ser un String').isLength({
        min: 3
    }).withMessage('Debe tener al menos 3 caracteres'),
    (0, _expressvalidator.body)('text').isString().withMessage('El Texto debe ser un String').isLength({
        min: 3
    }).withMessage('Debe tener al menos 3 caracteres'),
    (0, _expressvalidator.body)('classification').isString().withMessage('La clasificacion debe ser un string').isIn([
        'Municipales',
        'Economia',
        'Politica'
    ]).withMessage('Debes elegir una categoria Valida'),
    (0, _expressvalidator.body)('importance').isString().withMessage('La clasificacion debe ser un string').isNumeric().withMessage('debe ser un numero'),
    (req, res, next)=>{
        const errors = (0, _expressvalidator.validationResult)(req);
        if (errors.isEmpty()) next();
        else {
            _loggerservice.logger.debug({
                function: 'postValidation',
                errors
            });
            res.status(404).send(new _Entities.ResponseObject(errors, false, null));
        }
    }
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wb3N0L3Bvc3QudmFsaWRhdGlvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0eXBlIE5leHRGdW5jdGlvbiwgdHlwZSBSZXF1ZXN0LCB0eXBlIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcclxuaW1wb3J0IHsgYm9keSwgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJ1xyXG5pbXBvcnQgeyBSZXNwb25zZU9iamVjdCB9IGZyb20gJy4uL0VudGl0aWVzJ1xyXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi9TZXJ2aWNlcy9sb2dnZXIuc2VydmljZSdcclxuZXhwb3J0IGNvbnN0IHBvc3RWYWxpZGF0aW9uID0gW1xyXG4gIGJvZHkoJ3RpdGxlJykuaXNTdHJpbmcoKS53aXRoTWVzc2FnZSgnRWwgdGl0dWxvIGRlYmUgc2VyIHVuIFN0cmluZycpLmlzTGVuZ3RoKHsgbWluOiAzIH0pLndpdGhNZXNzYWdlKCdEZWJlIHRlbmVyIGFsIG1lbm9zIDMgY2FyYWN0ZXJlcycpLFxyXG4gIGJvZHkoJ2hlYWRpbmcnKS5pc1N0cmluZygpLndpdGhNZXNzYWdlKCdFbCBlbmNhYmV6YWRvIGRlYmUgc2VyIHVuIFN0cmluZycpLmlzTGVuZ3RoKHsgbWluOiAzIH0pLndpdGhNZXNzYWdlKCdEZWJlIHRlbmVyIGFsIG1lbm9zIDMgY2FyYWN0ZXJlcycpLFxyXG4gIGJvZHkoJ3RleHQnKS5pc1N0cmluZygpLndpdGhNZXNzYWdlKCdFbCBUZXh0byBkZWJlIHNlciB1biBTdHJpbmcnKS5pc0xlbmd0aCh7IG1pbjogMyB9KS53aXRoTWVzc2FnZSgnRGViZSB0ZW5lciBhbCBtZW5vcyAzIGNhcmFjdGVyZXMnKSxcclxuICBib2R5KCdjbGFzc2lmaWNhdGlvbicpLmlzU3RyaW5nKCkud2l0aE1lc3NhZ2UoJ0xhIGNsYXNpZmljYWNpb24gZGViZSBzZXIgdW4gc3RyaW5nJykuaXNJbihbJ011bmljaXBhbGVzJywgJ0Vjb25vbWlhJywgJ1BvbGl0aWNhJ10pLndpdGhNZXNzYWdlKCdEZWJlcyBlbGVnaXIgdW5hIGNhdGVnb3JpYSBWYWxpZGEnKSxcclxuICBib2R5KCdpbXBvcnRhbmNlJykuaXNTdHJpbmcoKS53aXRoTWVzc2FnZSgnTGEgY2xhc2lmaWNhY2lvbiBkZWJlIHNlciB1biBzdHJpbmcnKS5pc051bWVyaWMoKS53aXRoTWVzc2FnZSgnZGViZSBzZXIgdW4gbnVtZXJvJyksXHJcblxyXG4gIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpXHJcbiAgICBpZiAoZXJyb3JzLmlzRW1wdHkoKSkgbmV4dCgpXHJcbiAgICBlbHNlIHtcclxuICAgICAgbG9nZ2VyLmRlYnVnKHsgZnVuY3Rpb246ICdwb3N0VmFsaWRhdGlvbicsIGVycm9ycyB9KVxyXG4gICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZChuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3JzLCBmYWxzZSwgbnVsbCkpXHJcbiAgICB9XHJcbiAgfVxyXG5dXHJcbiJdLCJuYW1lcyI6WyJwb3N0VmFsaWRhdGlvbiIsImJvZHkiLCJpc1N0cmluZyIsIndpdGhNZXNzYWdlIiwiaXNMZW5ndGgiLCJtaW4iLCJpc0luIiwiaXNOdW1lcmljIiwicmVxIiwicmVzIiwibmV4dCIsImVycm9ycyIsInZhbGlkYXRpb25SZXN1bHQiLCJpc0VtcHR5IiwibG9nZ2VyIiwiZGVidWciLCJmdW5jdGlvbiIsInN0YXR1cyIsInNlbmQiLCJSZXNwb25zZU9iamVjdCJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7OytCQUlhQTs7O2VBQUFBOzs7a0NBSDBCOzBCQUNSOytCQUNSO0FBQ2hCLE1BQU1BLGlCQUFpQjtJQUM1QkMsSUFBQUEsc0JBQUksRUFBQyxTQUFTQyxRQUFRLEdBQUdDLFdBQVcsQ0FBQyxnQ0FBZ0NDLFFBQVEsQ0FBQztRQUFFQyxLQUFLO0lBQUUsR0FBR0YsV0FBVyxDQUFDO0lBQ3RHRixJQUFBQSxzQkFBSSxFQUFDLFdBQVdDLFFBQVEsR0FBR0MsV0FBVyxDQUFDLG9DQUFvQ0MsUUFBUSxDQUFDO1FBQUVDLEtBQUs7SUFBRSxHQUFHRixXQUFXLENBQUM7SUFDNUdGLElBQUFBLHNCQUFJLEVBQUMsUUFBUUMsUUFBUSxHQUFHQyxXQUFXLENBQUMsK0JBQStCQyxRQUFRLENBQUM7UUFBRUMsS0FBSztJQUFFLEdBQUdGLFdBQVcsQ0FBQztJQUNwR0YsSUFBQUEsc0JBQUksRUFBQyxrQkFBa0JDLFFBQVEsR0FBR0MsV0FBVyxDQUFDLHVDQUF1Q0csSUFBSSxDQUFDO1FBQUM7UUFBZTtRQUFZO0tBQVcsRUFBRUgsV0FBVyxDQUFDO0lBQy9JRixJQUFBQSxzQkFBSSxFQUFDLGNBQWNDLFFBQVEsR0FBR0MsV0FBVyxDQUFDLHVDQUF1Q0ksU0FBUyxHQUFHSixXQUFXLENBQUM7SUFFekcsQ0FBQ0ssS0FBY0MsS0FBZUM7UUFDNUIsTUFBTUMsU0FBU0MsSUFBQUEsa0NBQWdCLEVBQUNKO1FBQ2hDLElBQUlHLE9BQU9FLE9BQU8sSUFBSUg7YUFDakI7WUFDSEkscUJBQU0sQ0FBQ0MsS0FBSyxDQUFDO2dCQUFFQyxVQUFVO2dCQUFrQkw7WUFBTztZQUNsREYsSUFBSVEsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQyxJQUFJQyx3QkFBYyxDQUFDUixRQUFRLE9BQU87UUFDekQ7SUFDRjtDQUNEIn0=