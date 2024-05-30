"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "loginValidator", {
    enumerable: true,
    get: function() {
        return loginValidator;
    }
});
const _expressvalidator = require("express-validator");
const loginValidator = [
    (0, _expressvalidator.body)('username').notEmpty().withMessage('Cant post an empty String').isEmail().withMessage('Doesnt match a email type'),
    (0, _expressvalidator.body)('password').notEmpty(),
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdXRoL2xvZ2luLnZhbGlkYXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHR5cGUgTmV4dEZ1bmN0aW9uLCB0eXBlIFJlcXVlc3QsIHR5cGUgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xyXG5pbXBvcnQgeyBib2R5LCB2YWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnZXhwcmVzcy12YWxpZGF0b3InXHJcbmV4cG9ydCBjb25zdCBsb2dpblZhbGlkYXRvciA9IFtcclxuICBib2R5KCd1c2VybmFtZScpLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoJ0NhbnQgcG9zdCBhbiBlbXB0eSBTdHJpbmcnKS5pc0VtYWlsKCkud2l0aE1lc3NhZ2UoJ0RvZXNudCBtYXRjaCBhIGVtYWlsIHR5cGUnKSxcclxuICBib2R5KCdwYXNzd29yZCcpLm5vdEVtcHR5KCksIC8vIC5pc1N0cm9uZ1Bhc3N3b3JkKHsgbWluTG93ZXJjYXNlOiAzLCBtaW5VcHBlcmNhc2U6IDMsIG1pbk51bWJlcnM6IDEsIG1pblN5bWJvbHM6IDEgfSkud2l0aE1lc3NhZ2UoJ1Bhc3N3b3JkIG11c3QgYmUgaGF2ZSBhdCBsZWFzdCAzIGxvd2VyY2FzZSBsZXRlcnMgMyBVcGVyY2FzZSAxIG51bWJlciBhbmQgMSBzeW1ib2wnKSxcclxuICAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIGNvbnN0IGVycm9ycyA9IHZhbGlkYXRpb25SZXN1bHQocmVxKVxyXG4gICAgaWYgKGVycm9ycy5pc0VtcHR5KCkpIHsgbmV4dCgpIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGRhdGE6IGFueVtdID0gZXJyb3JzLmFycmF5KClcclxuICAgICAgcmVxLmZsYXNoKCdlcnJvcnMnLCBkYXRhKVxyXG4gICAgICByZXMucmVkaXJlY3QoJy9hdXRoL2ZhaWxlZGxvZ2luJylcclxuICAgIH1cclxuICB9XHJcbl1cclxuIl0sIm5hbWVzIjpbImxvZ2luVmFsaWRhdG9yIiwiYm9keSIsIm5vdEVtcHR5Iiwid2l0aE1lc3NhZ2UiLCJpc0VtYWlsIiwicmVxIiwicmVzIiwibmV4dCIsImVycm9ycyIsInZhbGlkYXRpb25SZXN1bHQiLCJpc0VtcHR5IiwiZGF0YSIsImFycmF5IiwiZmxhc2giLCJyZWRpcmVjdCJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7K0JBRWFBOzs7ZUFBQUE7OztrQ0FEMEI7QUFDaEMsTUFBTUEsaUJBQWlCO0lBQzVCQyxJQUFBQSxzQkFBSSxFQUFDLFlBQVlDLFFBQVEsR0FBR0MsV0FBVyxDQUFDLDZCQUE2QkMsT0FBTyxHQUFHRCxXQUFXLENBQUM7SUFDM0ZGLElBQUFBLHNCQUFJLEVBQUMsWUFBWUMsUUFBUTtJQUN6QixDQUFDRyxLQUFjQyxLQUFlQztRQUM1QixNQUFNQyxTQUFTQyxJQUFBQSxrQ0FBZ0IsRUFBQ0o7UUFDaEMsSUFBSUcsT0FBT0UsT0FBTyxJQUFJO1lBQUVIO1FBQU8sT0FBTztZQUNwQyxNQUFNSSxPQUFjSCxPQUFPSSxLQUFLO1lBQ2hDUCxJQUFJUSxLQUFLLENBQUMsVUFBVUY7WUFDcEJMLElBQUlRLFFBQVEsQ0FBQztRQUNmO0lBQ0Y7Q0FDRCJ9