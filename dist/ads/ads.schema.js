"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createAdSchema", {
    enumerable: true,
    get: function() {
        return createAdSchema;
    }
});
const _zod = require("zod");
const createAdSchema = _zod.z.object({
    body: _zod.z.object({
        importance: _zod.z.string().refine((value)=>{
            const parsed = parseInt(value);
            if (isNaN(parsed)) return false;
            if (parsed > 0 && parsed < 5) return true;
            else return false;
        }, {
            message: 'Debes proveer un caracter de numero del 1 al 4'
        }),
        usersId: _zod.z.string().min(3, {
            message: 'Debe se una cadena de al menos 3 caracteres'
        }),
        url: _zod.z.string().min(3, {
            message: 'Debes proveer una cadena de al menos 3 caracteres'
        }).nullable().optional(),
        title: _zod.z.string().min(3, {
            message: 'Debes proveer una cadena de al menos 3 carateres'
        })
    })
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZHMvYWRzLnNjaGVtYS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB6IH0gZnJvbSAnem9kJ1xyXG5leHBvcnQgY29uc3QgY3JlYXRlQWRTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgYm9keTogei5vYmplY3Qoe1xyXG4gICAgaW1wb3J0YW5jZTogei5zdHJpbmcoKS5yZWZpbmUoKHZhbHVlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHZhbHVlKVxyXG4gICAgICBpZiAoaXNOYU4ocGFyc2VkKSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmIChwYXJzZWQgPiAwICYmIHBhcnNlZCA8IDUpIHJldHVybiB0cnVlXHJcbiAgICAgIGVsc2UgcmV0dXJuIGZhbHNlXHJcbiAgICB9LCB7IG1lc3NhZ2U6ICdEZWJlcyBwcm92ZWVyIHVuIGNhcmFjdGVyIGRlIG51bWVybyBkZWwgMSBhbCA0JyB9KSxcclxuICAgIHVzZXJzSWQ6IHouc3RyaW5nKCkubWluKDMsIHsgbWVzc2FnZTogJ0RlYmUgc2UgdW5hIGNhZGVuYSBkZSBhbCBtZW5vcyAzIGNhcmFjdGVyZXMnIH0pLFxyXG4gICAgdXJsOiB6LnN0cmluZygpLm1pbigzLCB7IG1lc3NhZ2U6ICdEZWJlcyBwcm92ZWVyIHVuYSBjYWRlbmEgZGUgYWwgbWVub3MgMyBjYXJhY3RlcmVzJyB9KS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXHJcbiAgICB0aXRsZTogei5zdHJpbmcoKS5taW4oMywgeyBtZXNzYWdlOiAnRGViZXMgcHJvdmVlciB1bmEgY2FkZW5hIGRlIGFsIG1lbm9zIDMgY2FyYXRlcmVzJyB9KVxyXG5cclxuICB9KVxyXG59KVxyXG5cclxuZXhwb3J0IHR5cGUgY3JlYXRlQWRUeXBlID0gei5pbmZlcjx0eXBlb2YgY3JlYXRlQWRTY2hlbWE+Wydib2R5J11cclxuIl0sIm5hbWVzIjpbImNyZWF0ZUFkU2NoZW1hIiwieiIsIm9iamVjdCIsImJvZHkiLCJpbXBvcnRhbmNlIiwic3RyaW5nIiwicmVmaW5lIiwidmFsdWUiLCJwYXJzZWQiLCJwYXJzZUludCIsImlzTmFOIiwibWVzc2FnZSIsInVzZXJzSWQiLCJtaW4iLCJ1cmwiLCJudWxsYWJsZSIsIm9wdGlvbmFsIiwidGl0bGUiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkFDYUE7OztlQUFBQTs7O3FCQURLO0FBQ1gsTUFBTUEsaUJBQWlCQyxNQUFDLENBQUNDLE1BQU0sQ0FBQztJQUNyQ0MsTUFBTUYsTUFBQyxDQUFDQyxNQUFNLENBQUM7UUFDYkUsWUFBWUgsTUFBQyxDQUFDSSxNQUFNLEdBQUdDLE1BQU0sQ0FBQyxDQUFDQztZQUM3QixNQUFNQyxTQUFTQyxTQUFTRjtZQUN4QixJQUFJRyxNQUFNRixTQUFTLE9BQU87WUFDMUIsSUFBSUEsU0FBUyxLQUFLQSxTQUFTLEdBQUcsT0FBTztpQkFDaEMsT0FBTztRQUNkLEdBQUc7WUFBRUcsU0FBUztRQUFpRDtRQUMvREMsU0FBU1gsTUFBQyxDQUFDSSxNQUFNLEdBQUdRLEdBQUcsQ0FBQyxHQUFHO1lBQUVGLFNBQVM7UUFBOEM7UUFDcEZHLEtBQUtiLE1BQUMsQ0FBQ0ksTUFBTSxHQUFHUSxHQUFHLENBQUMsR0FBRztZQUFFRixTQUFTO1FBQW9ELEdBQUdJLFFBQVEsR0FBR0MsUUFBUTtRQUM1R0MsT0FBT2hCLE1BQUMsQ0FBQ0ksTUFBTSxHQUFHUSxHQUFHLENBQUMsR0FBRztZQUFFRixTQUFTO1FBQW1EO0lBRXpGO0FBQ0YifQ==