"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "schemaValidator", {
    enumerable: true,
    get: function() {
        return schemaValidator;
    }
});
const _zod = require("zod");
const _loggerservice = require("../Services/logger.service");
const schemaValidator = (schema)=>(req, res, next)=>{
        try {
            if (Array.isArray(schema)) {
                schema.forEach((singleSchema)=>{
                    singleSchema.parse({
                        body: req.body,
                        query: req.query,
                        params: req.params
                    });
                });
            } else {
                schema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params
                });
            }
            next();
        } catch (error) {
            if (error instanceof _zod.ZodError) {
                res.status(404).send({
                    error: error.issues.map((issue)=>({
                            path: issue.path,
                            message: issue.message,
                            code: issue.code
                        }))
                });
                _loggerservice.logger.error({
                    function: 'schemaValidator',
                    error: error.issues.map((issue)=>({
                            path: issue.path,
                            message: issue.message,
                            code: issue.code
                        }))
                });
            }
        }
    };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlcy96b2QudmFsaWRhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdHlwZSBOZXh0RnVuY3Rpb24sIHR5cGUgUmVxdWVzdCwgdHlwZSBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXHJcbmltcG9ydCB7IFpvZEVycm9yLCB0eXBlIEFueVpvZE9iamVjdCB9IGZyb20gJ3pvZCdcclxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vU2VydmljZXMvbG9nZ2VyLnNlcnZpY2UnXHJcblxyXG5leHBvcnQgY29uc3Qgc2NoZW1hVmFsaWRhdG9yID0gKHNjaGVtYTogQW55Wm9kT2JqZWN0IHwgQW55Wm9kT2JqZWN0W10pID0+IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzY2hlbWEpKSB7XHJcbiAgICAgIHNjaGVtYS5mb3JFYWNoKHNpbmdsZVNjaGVtYSA9PiB7XHJcbiAgICAgICAgc2luZ2xlU2NoZW1hLnBhcnNlKHtcclxuICAgICAgICAgIGJvZHk6IHJlcS5ib2R5LFxyXG4gICAgICAgICAgcXVlcnk6IHJlcS5xdWVyeSxcclxuICAgICAgICAgIHBhcmFtczogcmVxLnBhcmFtc1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzY2hlbWEucGFyc2Uoe1xyXG4gICAgICAgIGJvZHk6IHJlcS5ib2R5LFxyXG4gICAgICAgIHF1ZXJ5OiByZXEucXVlcnksXHJcbiAgICAgICAgcGFyYW1zOiByZXEucGFyYW1zXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBuZXh0KClcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgWm9kRXJyb3IpIHtcclxuICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoe1xyXG4gICAgICAgIGVycm9yOlxyXG4gICAgICAgIGVycm9yLmlzc3Vlcy5tYXAoaXNzdWUgPT4gKHsgcGF0aDogaXNzdWUucGF0aCwgbWVzc2FnZTogaXNzdWUubWVzc2FnZSwgY29kZTogaXNzdWUuY29kZSB9KSlcclxuICAgICAgfSlcclxuICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdzY2hlbWFWYWxpZGF0b3InLCBlcnJvcjogZXJyb3IuaXNzdWVzLm1hcChpc3N1ZSA9PiAoeyBwYXRoOiBpc3N1ZS5wYXRoLCBtZXNzYWdlOiBpc3N1ZS5tZXNzYWdlLCBjb2RlOiBpc3N1ZS5jb2RlIH0pKSB9KVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsic2NoZW1hVmFsaWRhdG9yIiwic2NoZW1hIiwicmVxIiwicmVzIiwibmV4dCIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJzaW5nbGVTY2hlbWEiLCJwYXJzZSIsImJvZHkiLCJxdWVyeSIsInBhcmFtcyIsImVycm9yIiwiWm9kRXJyb3IiLCJzdGF0dXMiLCJzZW5kIiwiaXNzdWVzIiwibWFwIiwiaXNzdWUiLCJwYXRoIiwibWVzc2FnZSIsImNvZGUiLCJsb2dnZXIiLCJmdW5jdGlvbiJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7OytCQUlhQTs7O2VBQUFBOzs7cUJBSCtCOytCQUNyQjtBQUVoQixNQUFNQSxrQkFBa0IsQ0FBQ0MsU0FBMEMsQ0FBQ0MsS0FBY0MsS0FBZUM7UUFDdEcsSUFBSTtZQUNGLElBQUlDLE1BQU1DLE9BQU8sQ0FBQ0wsU0FBUztnQkFDekJBLE9BQU9NLE9BQU8sQ0FBQ0MsQ0FBQUE7b0JBQ2JBLGFBQWFDLEtBQUssQ0FBQzt3QkFDakJDLE1BQU1SLElBQUlRLElBQUk7d0JBQ2RDLE9BQU9ULElBQUlTLEtBQUs7d0JBQ2hCQyxRQUFRVixJQUFJVSxNQUFNO29CQUNwQjtnQkFDRjtZQUNGLE9BQU87Z0JBQ0xYLE9BQU9RLEtBQUssQ0FBQztvQkFDWEMsTUFBTVIsSUFBSVEsSUFBSTtvQkFDZEMsT0FBT1QsSUFBSVMsS0FBSztvQkFDaEJDLFFBQVFWLElBQUlVLE1BQU07Z0JBQ3BCO1lBQ0Y7WUFDQVI7UUFDRixFQUFFLE9BQU9TLE9BQU87WUFDZCxJQUFJQSxpQkFBaUJDLGFBQVEsRUFBRTtnQkFDN0JYLElBQUlZLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7b0JBQ25CSCxPQUNBQSxNQUFNSSxNQUFNLENBQUNDLEdBQUcsQ0FBQ0MsQ0FBQUEsUUFBVSxDQUFBOzRCQUFFQyxNQUFNRCxNQUFNQyxJQUFJOzRCQUFFQyxTQUFTRixNQUFNRSxPQUFPOzRCQUFFQyxNQUFNSCxNQUFNRyxJQUFJO3dCQUFDLENBQUE7Z0JBQzFGO2dCQUNBQyxxQkFBTSxDQUFDVixLQUFLLENBQUM7b0JBQUVXLFVBQVU7b0JBQW1CWCxPQUFPQSxNQUFNSSxNQUFNLENBQUNDLEdBQUcsQ0FBQ0MsQ0FBQUEsUUFBVSxDQUFBOzRCQUFFQyxNQUFNRCxNQUFNQyxJQUFJOzRCQUFFQyxTQUFTRixNQUFNRSxPQUFPOzRCQUFFQyxNQUFNSCxNQUFNRyxJQUFJO3dCQUFDLENBQUE7Z0JBQUk7WUFDako7UUFDRjtJQUNGIn0=