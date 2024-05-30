"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "signupValidator", {
    enumerable: true,
    get: function() {
        return signupValidator;
    }
});
const _expressvalidator = require("express-validator");
const signupValidator = [
    (0, _expressvalidator.body)('username').notEmpty().withMessage('Cant post an empty String').isEmail().withMessage('Doesnt match a email type'),
    (0, _expressvalidator.body)('password').isStrongPassword({
        minLowercase: 3,
        minUppercase: 3,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage('Password must be have at least 3 lowercase leters 3 Upercase 1 number and 1 symbol'),
    (0, _expressvalidator.body)('name').isString().isLength({
        min: 3
    }),
    (0, _expressvalidator.body)('lastName').isString().isLength({
        min: 3
    }),
    (0, _expressvalidator.body)('phone').isMobilePhone('any', {
        strictMode: false
    }),
    (req, res, next)=>{
        const errors = (0, _expressvalidator.validationResult)(req);
        if (errors.isEmpty()) {
            next();
        } else {
            const data = errors.array();
            req.flash('errors', data);
            res.redirect('/auth/failedlogin');
        }
    }
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdXRoL3NpZ251cC52YWxpZGF0b3IudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdHlwZSBOZXh0RnVuY3Rpb24sIHR5cGUgUmVxdWVzdCwgdHlwZSBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXHJcbmltcG9ydCB7IGJvZHksIHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcidcclxuZXhwb3J0IGNvbnN0IHNpZ251cFZhbGlkYXRvciA9IFtcclxuICBib2R5KCd1c2VybmFtZScpLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoJ0NhbnQgcG9zdCBhbiBlbXB0eSBTdHJpbmcnKS5pc0VtYWlsKCkud2l0aE1lc3NhZ2UoJ0RvZXNudCBtYXRjaCBhIGVtYWlsIHR5cGUnKSxcclxuICBib2R5KCdwYXNzd29yZCcpLmlzU3Ryb25nUGFzc3dvcmQoeyBtaW5Mb3dlcmNhc2U6IDMsIG1pblVwcGVyY2FzZTogMywgbWluTnVtYmVyczogMSwgbWluU3ltYm9sczogMSB9KS53aXRoTWVzc2FnZSgnUGFzc3dvcmQgbXVzdCBiZSBoYXZlIGF0IGxlYXN0IDMgbG93ZXJjYXNlIGxldGVycyAzIFVwZXJjYXNlIDEgbnVtYmVyIGFuZCAxIHN5bWJvbCcpLFxyXG4gIGJvZHkoJ25hbWUnKS5pc1N0cmluZygpLmlzTGVuZ3RoKHsgbWluOiAzIH0pLFxyXG4gIGJvZHkoJ2xhc3ROYW1lJykuaXNTdHJpbmcoKS5pc0xlbmd0aCh7IG1pbjogMyB9KSxcclxuICBib2R5KCdwaG9uZScpLmlzTW9iaWxlUGhvbmUoJ2FueScsIHsgc3RyaWN0TW9kZTogZmFsc2UgfSksXHJcblxyXG4gIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpXHJcbiAgICBpZiAoZXJyb3JzLmlzRW1wdHkoKSkgeyBuZXh0KCkgfSBlbHNlIHtcclxuICAgICAgY29uc3QgZGF0YTogYW55W10gPSBlcnJvcnMuYXJyYXkoKVxyXG4gICAgICByZXEuZmxhc2goJ2Vycm9ycycsIGRhdGEpXHJcbiAgICAgIHJlcy5yZWRpcmVjdCgnL2F1dGgvZmFpbGVkbG9naW4nKVxyXG4gICAgfVxyXG4gIH1cclxuXVxyXG4iXSwibmFtZXMiOlsic2lnbnVwVmFsaWRhdG9yIiwiYm9keSIsIm5vdEVtcHR5Iiwid2l0aE1lc3NhZ2UiLCJpc0VtYWlsIiwiaXNTdHJvbmdQYXNzd29yZCIsIm1pbkxvd2VyY2FzZSIsIm1pblVwcGVyY2FzZSIsIm1pbk51bWJlcnMiLCJtaW5TeW1ib2xzIiwiaXNTdHJpbmciLCJpc0xlbmd0aCIsIm1pbiIsImlzTW9iaWxlUGhvbmUiLCJzdHJpY3RNb2RlIiwicmVxIiwicmVzIiwibmV4dCIsImVycm9ycyIsInZhbGlkYXRpb25SZXN1bHQiLCJpc0VtcHR5IiwiZGF0YSIsImFycmF5IiwiZmxhc2giLCJyZWRpcmVjdCJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkFFYUE7OztlQUFBQTs7O2tDQUQwQjtBQUNoQyxNQUFNQSxrQkFBa0I7SUFDN0JDLElBQUFBLHNCQUFJLEVBQUMsWUFBWUMsUUFBUSxHQUFHQyxXQUFXLENBQUMsNkJBQTZCQyxPQUFPLEdBQUdELFdBQVcsQ0FBQztJQUMzRkYsSUFBQUEsc0JBQUksRUFBQyxZQUFZSSxnQkFBZ0IsQ0FBQztRQUFFQyxjQUFjO1FBQUdDLGNBQWM7UUFBR0MsWUFBWTtRQUFHQyxZQUFZO0lBQUUsR0FBR04sV0FBVyxDQUFDO0lBQ2xIRixJQUFBQSxzQkFBSSxFQUFDLFFBQVFTLFFBQVEsR0FBR0MsUUFBUSxDQUFDO1FBQUVDLEtBQUs7SUFBRTtJQUMxQ1gsSUFBQUEsc0JBQUksRUFBQyxZQUFZUyxRQUFRLEdBQUdDLFFBQVEsQ0FBQztRQUFFQyxLQUFLO0lBQUU7SUFDOUNYLElBQUFBLHNCQUFJLEVBQUMsU0FBU1ksYUFBYSxDQUFDLE9BQU87UUFBRUMsWUFBWTtJQUFNO0lBRXZELENBQUNDLEtBQWNDLEtBQWVDO1FBQzVCLE1BQU1DLFNBQVNDLElBQUFBLGtDQUFnQixFQUFDSjtRQUNoQyxJQUFJRyxPQUFPRSxPQUFPLElBQUk7WUFBRUg7UUFBTyxPQUFPO1lBQ3BDLE1BQU1JLE9BQWNILE9BQU9JLEtBQUs7WUFDaENQLElBQUlRLEtBQUssQ0FBQyxVQUFVRjtZQUNwQkwsSUFBSVEsUUFBUSxDQUFDO1FBQ2Y7SUFDRjtDQUNEIn0=