"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "logger", {
    enumerable: true,
    get: function() {
        return logger;
    }
});
const _winston = /*#__PURE__*/ _interop_require_default(require("winston"));
const _dotenv = /*#__PURE__*/ _interop_require_default(require("dotenv"));
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_dotenv.default.config();
var _process_env_LOG_DIRECTORY;
const logPath = (_process_env_LOG_DIRECTORY = process.env.LOG_DIRECTORY) !== null && _process_env_LOG_DIRECTORY !== void 0 ? _process_env_LOG_DIRECTORY : '';
if (logPath !== undefined && !_fs.default.existsSync(logPath)) _fs.default.mkdirSync(logPath);
const logger = _winston.default.createLogger({
    level: 'debug',
    format: _winston.default.format.combine(_winston.default.format.prettyPrint(), _winston.default.format.timestamp()),
    transports: [
        new _winston.default.transports.File({
            filename: _path.default.join(logPath, 'errors.log'),
            level: 'error'
        }),
        new _winston.default.transports.File({
            filename: _path.default.join(logPath, 'debug.log')
        })
    ]
});
if (process.env.NODE_ENV !== 'PRODUCTION') {
    logger.add(new _winston.default.transports.Console({
        format: _winston.default.format.combine(_winston.default.format.prettyPrint(), _winston.default.format.colorize({
            all: true
        }), _winston.default.format.timestamp())
    }));
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TZXJ2aWNlcy9sb2dnZXIuc2VydmljZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgd2luc3RvbiBmcm9tICd3aW5zdG9uJ1xyXG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudidcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5kb3RlbnYuY29uZmlnKClcclxuY29uc3QgbG9nUGF0aCA9IHByb2Nlc3MuZW52LkxPR19ESVJFQ1RPUlkgPz8gJydcclxuXHJcbmlmIChsb2dQYXRoICE9PSB1bmRlZmluZWQgJiYgIWZzLmV4aXN0c1N5bmMobG9nUGF0aCkpIGZzLm1rZGlyU3luYyhsb2dQYXRoKVxyXG5leHBvcnQgY29uc3QgbG9nZ2VyID0gd2luc3Rvbi5jcmVhdGVMb2dnZXIoe1xyXG4gIGxldmVsOiAnZGVidWcnLFxyXG4gIGZvcm1hdDogd2luc3Rvbi5mb3JtYXQuY29tYmluZSh3aW5zdG9uLmZvcm1hdC5wcmV0dHlQcmludCgpLCB3aW5zdG9uLmZvcm1hdC50aW1lc3RhbXAoKSksXHJcbiAgdHJhbnNwb3J0czogW25ldyB3aW5zdG9uLnRyYW5zcG9ydHMuRmlsZSh7XHJcbiAgICBmaWxlbmFtZTogcGF0aC5qb2luKGxvZ1BhdGgsICdlcnJvcnMubG9nJyksXHJcbiAgICBsZXZlbDogJ2Vycm9yJ1xyXG4gIH0pLFxyXG4gIG5ldyB3aW5zdG9uLnRyYW5zcG9ydHMuRmlsZSh7IGZpbGVuYW1lOiBwYXRoLmpvaW4obG9nUGF0aCwgJ2RlYnVnLmxvZycpIH0pXVxyXG5cclxufSlcclxuXHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ1BST0RVQ1RJT04nKSB7XHJcbiAgbG9nZ2VyLmFkZChuZXcgd2luc3Rvbi50cmFuc3BvcnRzLkNvbnNvbGUoe1xyXG4gICAgZm9ybWF0OiB3aW5zdG9uLmZvcm1hdC5jb21iaW5lKFxyXG4gICAgICB3aW5zdG9uLmZvcm1hdC5wcmV0dHlQcmludCgpLFxyXG4gICAgICB3aW5zdG9uLmZvcm1hdC5jb2xvcml6ZSh7IGFsbDogdHJ1ZSB9KSxcclxuICAgICAgd2luc3Rvbi5mb3JtYXQudGltZXN0YW1wKCkpXHJcbiAgfSkpXHJcbn1cclxuIl0sIm5hbWVzIjpbImxvZ2dlciIsImRvdGVudiIsImNvbmZpZyIsInByb2Nlc3MiLCJsb2dQYXRoIiwiZW52IiwiTE9HX0RJUkVDVE9SWSIsInVuZGVmaW5lZCIsImZzIiwiZXhpc3RzU3luYyIsIm1rZGlyU3luYyIsIndpbnN0b24iLCJjcmVhdGVMb2dnZXIiLCJsZXZlbCIsImZvcm1hdCIsImNvbWJpbmUiLCJwcmV0dHlQcmludCIsInRpbWVzdGFtcCIsInRyYW5zcG9ydHMiLCJGaWxlIiwiZmlsZW5hbWUiLCJwYXRoIiwiam9pbiIsIk5PREVfRU5WIiwiYWRkIiwiQ29uc29sZSIsImNvbG9yaXplIiwiYWxsIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkFRYUE7OztlQUFBQTs7O2dFQVJPOytEQUNEOzJEQUNKOzZEQUNFOzs7Ozs7QUFDakJDLGVBQU0sQ0FBQ0MsTUFBTTtJQUNHQztBQUFoQixNQUFNQyxVQUFVRCxDQUFBQSw2QkFBQUEsUUFBUUUsR0FBRyxDQUFDQyxhQUFhLGNBQXpCSCx3Q0FBQUEsNkJBQTZCO0FBRTdDLElBQUlDLFlBQVlHLGFBQWEsQ0FBQ0MsV0FBRSxDQUFDQyxVQUFVLENBQUNMLFVBQVVJLFdBQUUsQ0FBQ0UsU0FBUyxDQUFDTjtBQUM1RCxNQUFNSixTQUFTVyxnQkFBTyxDQUFDQyxZQUFZLENBQUM7SUFDekNDLE9BQU87SUFDUEMsUUFBUUgsZ0JBQU8sQ0FBQ0csTUFBTSxDQUFDQyxPQUFPLENBQUNKLGdCQUFPLENBQUNHLE1BQU0sQ0FBQ0UsV0FBVyxJQUFJTCxnQkFBTyxDQUFDRyxNQUFNLENBQUNHLFNBQVM7SUFDckZDLFlBQVk7UUFBQyxJQUFJUCxnQkFBTyxDQUFDTyxVQUFVLENBQUNDLElBQUksQ0FBQztZQUN2Q0MsVUFBVUMsYUFBSSxDQUFDQyxJQUFJLENBQUNsQixTQUFTO1lBQzdCUyxPQUFPO1FBQ1Q7UUFDQSxJQUFJRixnQkFBTyxDQUFDTyxVQUFVLENBQUNDLElBQUksQ0FBQztZQUFFQyxVQUFVQyxhQUFJLENBQUNDLElBQUksQ0FBQ2xCLFNBQVM7UUFBYTtLQUFHO0FBRTdFO0FBRUEsSUFBSUQsUUFBUUUsR0FBRyxDQUFDa0IsUUFBUSxLQUFLLGNBQWM7SUFDekN2QixPQUFPd0IsR0FBRyxDQUFDLElBQUliLGdCQUFPLENBQUNPLFVBQVUsQ0FBQ08sT0FBTyxDQUFDO1FBQ3hDWCxRQUFRSCxnQkFBTyxDQUFDRyxNQUFNLENBQUNDLE9BQU8sQ0FDNUJKLGdCQUFPLENBQUNHLE1BQU0sQ0FBQ0UsV0FBVyxJQUMxQkwsZ0JBQU8sQ0FBQ0csTUFBTSxDQUFDWSxRQUFRLENBQUM7WUFBRUMsS0FBSztRQUFLLElBQ3BDaEIsZ0JBQU8sQ0FBQ0csTUFBTSxDQUFDRyxTQUFTO0lBQzVCO0FBQ0YifQ==