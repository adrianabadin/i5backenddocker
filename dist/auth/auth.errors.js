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
    AuthError: function() {
        return AuthError;
    },
    UserCreateError: function() {
        return UserCreateError;
    },
    UserExistsError: function() {
        return UserExistsError;
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
class AuthError extends Error {
    constructor(errorContent, message = 'Error de autenticacion', code = 1000){
        super(message);
        _define_property(this, "errorContent", void 0);
        _define_property(this, "message", void 0);
        _define_property(this, "code", void 0);
        _define_property(this, "text", void 0);
        this.errorContent = errorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Auth Error';
        this.code = code;
    }
}
class UserCreateError extends AuthError {
    constructor(errorContent, message = 'Error al crear el usuario', code = 1001){
        super(errorContent, message, code);
    }
}
class UserExistsError extends AuthError {
    constructor(errorContent, message = 'El usuario ya existe', code = 1002){
        super(errorContent, message, code);
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdXRoL2F1dGguZXJyb3JzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBdXRoRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgcHVibGljIHRleHQ6IHN0cmluZ1xyXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgZXJyb3JDb250ZW50PzogYW55LCBwdWJsaWMgbWVzc2FnZTogc3RyaW5nID0gJ0Vycm9yIGRlIGF1dGVudGljYWNpb24nLCBwdWJsaWMgY29kZTogbnVtYmVyID0gMTAwMCkge1xyXG4gICAgc3VwZXIobWVzc2FnZSlcclxuICAgIHRoaXMudGV4dCA9IG1lc3NhZ2VcclxuICAgIHRoaXMubmFtZSA9ICdBdXRoIEVycm9yJ1xyXG4gICAgdGhpcy5jb2RlID0gY29kZVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJDcmVhdGVFcnJvciBleHRlbmRzIEF1dGhFcnJvciB7XHJcbiAgY29uc3RydWN0b3IgKGVycm9yQ29udGVudD86IGFueSwgbWVzc2FnZTogc3RyaW5nID0gJ0Vycm9yIGFsIGNyZWFyIGVsIHVzdWFyaW8nLCBjb2RlOiBudW1iZXIgPSAxMDAxKSB7XHJcbiAgICBzdXBlcihlcnJvckNvbnRlbnQsIG1lc3NhZ2UsIGNvZGUpXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBVc2VyRXhpc3RzRXJyb3IgZXh0ZW5kcyBBdXRoRXJyb3Ige1xyXG4gIGNvbnN0cnVjdG9yIChlcnJvckNvbnRlbnQ/OiBhbnksIG1lc3NhZ2UgPSAnRWwgdXN1YXJpbyB5YSBleGlzdGUnLCBjb2RlID0gMTAwMikge1xyXG4gICAgc3VwZXIoZXJyb3JDb250ZW50LCBtZXNzYWdlLCBjb2RlKVxyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiQXV0aEVycm9yIiwiVXNlckNyZWF0ZUVycm9yIiwiVXNlckV4aXN0c0Vycm9yIiwiRXJyb3IiLCJjb25zdHJ1Y3RvciIsImVycm9yQ29udGVudCIsIm1lc3NhZ2UiLCJjb2RlIiwidGV4dCIsIm5hbWUiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBc0JBLFNBQVM7ZUFBVEE7O0lBVVRDLGVBQWU7ZUFBZkE7O0lBS0FDLGVBQWU7ZUFBZkE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFmTixNQUFlRixrQkFBa0JHO0lBRXRDQyxZQUFhLEFBQU9DLFlBQWtCLEVBQUUsQUFBT0MsVUFBa0Isd0JBQXdCLEVBQUUsQUFBT0MsT0FBZSxJQUFJLENBQUU7UUFDckgsS0FBSyxDQUFDRDs7OztRQUZSLHVCQUFPRSxRQUFQLEtBQUE7YUFDb0JILGVBQUFBO2FBQTJCQyxVQUFBQTthQUFtREMsT0FBQUE7UUFFaEcsSUFBSSxDQUFDQyxJQUFJLEdBQUdGO1FBQ1osSUFBSSxDQUFDRyxJQUFJLEdBQUc7UUFDWixJQUFJLENBQUNGLElBQUksR0FBR0E7SUFDZDtBQUNGO0FBRU8sTUFBTU4sd0JBQXdCRDtJQUNuQ0ksWUFBYUMsWUFBa0IsRUFBRUMsVUFBa0IsMkJBQTJCLEVBQUVDLE9BQWUsSUFBSSxDQUFFO1FBQ25HLEtBQUssQ0FBQ0YsY0FBY0MsU0FBU0M7SUFDL0I7QUFDRjtBQUNPLE1BQU1MLHdCQUF3QkY7SUFDbkNJLFlBQWFDLFlBQWtCLEVBQUVDLFVBQVUsc0JBQXNCLEVBQUVDLE9BQU8sSUFBSSxDQUFFO1FBQzlFLEtBQUssQ0FBQ0YsY0FBY0MsU0FBU0M7SUFDL0I7QUFDRiJ9