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
    ColumnPrismaError: function() {
        return ColumnPrismaError;
    },
    NotFoundPrismaError: function() {
        return NotFoundPrismaError;
    },
    PrismaError: function() {
        return PrismaError;
    },
    UniqueRestraintError: function() {
        return UniqueRestraintError;
    },
    UnknownPrismaError: function() {
        return UnknownPrismaError;
    }
});
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
class PrismaError extends Error {
    constructor(errorContent, target, message = 'Generic prisma error', code = 3000){
        super(message);
        _define_property(this, "errorContent", void 0);
        _define_property(this, "target", void 0);
        _define_property(this, "code", void 0);
        this.errorContent = errorContent;
        this.target = target;
        this.code = code;
        this.name = 'Prisma Error';
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (Error.captureStackTrace) Error.captureStackTrace(this, PrismaError);
    }
}
class UniqueRestraintError extends PrismaError {
    constructor(errorContent, target, message = 'No se puede duplicar un campo unico', code = 3001){
        super(errorContent, target, message, code);
        _define_property(this, "errorContent", void 0);
        _define_property(this, "target", void 0);
        _define_property(this, "code", void 0);
        this.errorContent = errorContent;
        this.target = target;
        this.code = code;
        this.name = 'Unique Restraint Error';
    }
}
class ColumnPrismaError extends PrismaError {
    constructor(errorContent, target, message = 'El dato excede el tamaño de la columna', code = 3002){
        super(errorContent, target, message, code);
        _define_property(this, "errorContent", void 0);
        _define_property(this, "target", void 0);
        _define_property(this, "code", void 0);
        this.errorContent = errorContent;
        this.target = target;
        this.code = code;
        this.name = 'Column Prisma Error';
    }
}
class NotFoundPrismaError extends PrismaError {
    constructor(errorContent, target, message = 'El registro no se encontro', code = 3003){
        super(errorContent, target, message, code);
        _define_property(this, "errorContent", void 0);
        _define_property(this, "target", void 0);
        _define_property(this, "code", void 0);
        this.errorContent = errorContent;
        this.target = target;
        this.code = code;
        this.name = 'Not Found Prisma Error';
    }
}
class UnknownPrismaError extends PrismaError {
    constructor(errorContent, target, message = 'Error desconocido en la base de datos', code = 3000){
        super(errorContent, target, message, code);
        _define_property(this, "errorContent", void 0);
        _define_property(this, "target", void 0);
        _define_property(this, "code", void 0);
        this.errorContent = errorContent;
        this.target = target;
        this.code = code;
        this.name = 'Unknown Prisma Error';
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TZXJ2aWNlcy9wcmlzbWEuZXJyb3JzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQcmlzbWFFcnJvciBleHRlbmRzIEVycm9yIHtcclxuICBjb25zdHJ1Y3RvciAocHVibGljIGVycm9yQ29udGVudD86IGFueSwgcHVibGljIHRhcmdldD86IGFueSwgbWVzc2FnZTogc3RyaW5nID0gJ0dlbmVyaWMgcHJpc21hIGVycm9yJywgcHVibGljIGNvZGU6IG51bWJlciA9IDMwMDApIHtcclxuICAgIHN1cGVyKG1lc3NhZ2UpXHJcbiAgICB0aGlzLm5hbWUgPSAnUHJpc21hIEVycm9yJ1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9zdHJpY3QtYm9vbGVhbi1leHByZXNzaW9uc1xyXG4gICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBQcmlzbWFFcnJvcilcclxuICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFVuaXF1ZVJlc3RyYWludEVycm9yIGV4dGVuZHMgUHJpc21hRXJyb3Ige1xyXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgZXJyb3JDb250ZW50PzogYW55LCBwdWJsaWMgdGFyZ2V0PzogYW55LCBtZXNzYWdlOiBzdHJpbmcgPSAnTm8gc2UgcHVlZGUgZHVwbGljYXIgdW4gY2FtcG8gdW5pY28nLCBwdWJsaWMgY29kZTogbnVtYmVyID0gMzAwMSkge1xyXG4gICAgc3VwZXIoZXJyb3JDb250ZW50LCB0YXJnZXQsIG1lc3NhZ2UsIGNvZGUpXHJcbiAgICB0aGlzLm5hbWUgPSAnVW5pcXVlIFJlc3RyYWludCBFcnJvcidcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb2x1bW5QcmlzbWFFcnJvciBleHRlbmRzIFByaXNtYUVycm9yIHtcclxuICBjb25zdHJ1Y3RvciAocHVibGljIGVycm9yQ29udGVudD86IGFueSwgcHVibGljIHRhcmdldD86IGFueSwgbWVzc2FnZTogc3RyaW5nID0gJ0VsIGRhdG8gZXhjZWRlIGVsIHRhbWHDsW8gZGUgbGEgY29sdW1uYScsIHB1YmxpYyBjb2RlOiBudW1iZXIgPSAzMDAyKSB7XHJcbiAgICBzdXBlcihlcnJvckNvbnRlbnQsIHRhcmdldCwgbWVzc2FnZSwgY29kZSlcclxuICAgIHRoaXMubmFtZSA9ICdDb2x1bW4gUHJpc21hIEVycm9yJ1xyXG4gIH1cclxufVxyXG5leHBvcnQgY2xhc3MgTm90Rm91bmRQcmlzbWFFcnJvciBleHRlbmRzIFByaXNtYUVycm9yIHtcclxuICBjb25zdHJ1Y3RvciAocHVibGljIGVycm9yQ29udGVudD86IGFueSwgcHVibGljIHRhcmdldD86IGFueSwgbWVzc2FnZTogc3RyaW5nID0gJ0VsIHJlZ2lzdHJvIG5vIHNlIGVuY29udHJvJywgcHVibGljIGNvZGU6IG51bWJlciA9IDMwMDMpIHtcclxuICAgIHN1cGVyKGVycm9yQ29udGVudCwgdGFyZ2V0LCBtZXNzYWdlLCBjb2RlKVxyXG4gICAgdGhpcy5uYW1lID0gJ05vdCBGb3VuZCBQcmlzbWEgRXJyb3InXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBVbmtub3duUHJpc21hRXJyb3IgZXh0ZW5kcyBQcmlzbWFFcnJvciB7XHJcbiAgY29uc3RydWN0b3IgKHB1YmxpYyBlcnJvckNvbnRlbnQ6IGFueSwgcHVibGljIHRhcmdldD86IGFueSwgbWVzc2FnZTogc3RyaW5nID0gJ0Vycm9yIGRlc2Nvbm9jaWRvIGVuIGxhIGJhc2UgZGUgZGF0b3MnLCBwdWJsaWMgY29kZTogbnVtYmVyID0gMzAwMCkge1xyXG4gICAgc3VwZXIoZXJyb3JDb250ZW50LCB0YXJnZXQsIG1lc3NhZ2UsIGNvZGUpXHJcbiAgICB0aGlzLm5hbWUgPSAnVW5rbm93biBQcmlzbWEgRXJyb3InXHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJDb2x1bW5QcmlzbWFFcnJvciIsIk5vdEZvdW5kUHJpc21hRXJyb3IiLCJQcmlzbWFFcnJvciIsIlVuaXF1ZVJlc3RyYWludEVycm9yIiwiVW5rbm93blByaXNtYUVycm9yIiwiRXJyb3IiLCJjb25zdHJ1Y3RvciIsImVycm9yQ29udGVudCIsInRhcmdldCIsIm1lc3NhZ2UiLCJjb2RlIiwibmFtZSIsImNhcHR1cmVTdGFja1RyYWNlIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQWVhQSxpQkFBaUI7ZUFBakJBOztJQU1BQyxtQkFBbUI7ZUFBbkJBOztJQXJCU0MsV0FBVztlQUFYQTs7SUFRVEMsb0JBQW9CO2VBQXBCQTs7SUFtQkFDLGtCQUFrQjtlQUFsQkE7Ozs7Ozs7Ozs7Ozs7Ozs7QUEzQk4sTUFBZUYsb0JBQW9CRztJQUN4Q0MsWUFBYSxBQUFPQyxZQUFrQixFQUFFLEFBQU9DLE1BQVksRUFBRUMsVUFBa0Isc0JBQXNCLEVBQUUsQUFBT0MsT0FBZSxJQUFJLENBQUU7UUFDakksS0FBSyxDQUFDRDs7OzthQURZRixlQUFBQTthQUEyQkMsU0FBQUE7YUFBK0RFLE9BQUFBO1FBRTVHLElBQUksQ0FBQ0MsSUFBSSxHQUFHO1FBQ1oseUVBQXlFO1FBQ3pFLElBQUlOLE1BQU1PLGlCQUFpQixFQUFFUCxNQUFNTyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUVWO0lBQzdEO0FBQ0Y7QUFDTyxNQUFNQyw2QkFBNkJEO0lBQ3hDSSxZQUFhLEFBQU9DLFlBQWtCLEVBQUUsQUFBT0MsTUFBWSxFQUFFQyxVQUFrQixxQ0FBcUMsRUFBRSxBQUFPQyxPQUFlLElBQUksQ0FBRTtRQUNoSixLQUFLLENBQUNILGNBQWNDLFFBQVFDLFNBQVNDOzs7O2FBRG5CSCxlQUFBQTthQUEyQkMsU0FBQUE7YUFBOEVFLE9BQUFBO1FBRTNILElBQUksQ0FBQ0MsSUFBSSxHQUFHO0lBQ2Q7QUFDRjtBQUVPLE1BQU1YLDBCQUEwQkU7SUFDckNJLFlBQWEsQUFBT0MsWUFBa0IsRUFBRSxBQUFPQyxNQUFZLEVBQUVDLFVBQWtCLHdDQUF3QyxFQUFFLEFBQU9DLE9BQWUsSUFBSSxDQUFFO1FBQ25KLEtBQUssQ0FBQ0gsY0FBY0MsUUFBUUMsU0FBU0M7Ozs7YUFEbkJILGVBQUFBO2FBQTJCQyxTQUFBQTthQUFpRkUsT0FBQUE7UUFFOUgsSUFBSSxDQUFDQyxJQUFJLEdBQUc7SUFDZDtBQUNGO0FBQ08sTUFBTVYsNEJBQTRCQztJQUN2Q0ksWUFBYSxBQUFPQyxZQUFrQixFQUFFLEFBQU9DLE1BQVksRUFBRUMsVUFBa0IsNEJBQTRCLEVBQUUsQUFBT0MsT0FBZSxJQUFJLENBQUU7UUFDdkksS0FBSyxDQUFDSCxjQUFjQyxRQUFRQyxTQUFTQzs7OzthQURuQkgsZUFBQUE7YUFBMkJDLFNBQUFBO2FBQXFFRSxPQUFBQTtRQUVsSCxJQUFJLENBQUNDLElBQUksR0FBRztJQUNkO0FBQ0Y7QUFDTyxNQUFNUCwyQkFBMkJGO0lBQ3RDSSxZQUFhLEFBQU9DLFlBQWlCLEVBQUUsQUFBT0MsTUFBWSxFQUFFQyxVQUFrQix1Q0FBdUMsRUFBRSxBQUFPQyxPQUFlLElBQUksQ0FBRTtRQUNqSixLQUFLLENBQUNILGNBQWNDLFFBQVFDLFNBQVNDOzs7O2FBRG5CSCxlQUFBQTthQUEwQkMsU0FBQUE7YUFBZ0ZFLE9BQUFBO1FBRTVILElBQUksQ0FBQ0MsSUFBSSxHQUFHO0lBQ2Q7QUFDRiJ9