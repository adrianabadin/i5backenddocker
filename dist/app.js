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
    io: function() {
        return io;
    },
    server: function() {
        return server;
    },
    userLogged: function() {
        return userLogged;
    }
});
const _socketio = require("socket.io");
const _loggerservice = require("./Services/logger.service");
const _appmiddleware = require("./app.middleware");
const _connectflash = /*#__PURE__*/ _interop_require_default(require("connect-flash"));
const _zod = require("zod");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const dotenvSchema = _zod.z.object({
    DATABASE_URL: _zod.z.string({
        required_error: 'Must provide  a URL to connect to the database'
    }),
    LOG_DIRECTORY: _zod.z.string({
        required_error: 'Must provide a path to the logs directory'
    }),
    TKN_EXPIRATION: _zod.z.string({
        required_error: 'Must define JWT duration'
    }),
    KEYS_PATH: _zod.z.string({
        required_error: 'Must provide a path to Crpto asimetric keys'
    }),
    CLIENTID: _zod.z.string({
        required_error: 'Must provide google client ID'
    }),
    CALLBACKURL: _zod.z.string({
        required_error: 'Must provide a callback URL for google o auth'
    }),
    CLIENTSECRET: _zod.z.string({
        required_error: 'Must provide client secret key for google'
    }),
    SIMETRICKEY: _zod.z.string({
        required_error: 'Must provide a simetricKey for simetric encriptation'
    }),
    FACEBOOK_APP_ID: _zod.z.string({
        required_error: 'Must provide facebook app ID'
    }),
    FACEBOOK_APP_SECRET: _zod.z.string({
        required_error: 'Must provide facebook app secret'
    }),
    FACEBOOK_APP_CB: _zod.z.string({
        required_error: 'Must provide a callback url for Facebook oauth'
    }),
    FACEBOOK_PAGE: _zod.z.string({
        required_error: 'Must provide a facebook page id you admin to post the news  '
    }),
    FB_PAGE_TOKEN: _zod.z.string({
        required_error: 'Must provide a permanent token for the page'
    }),
    NEWSPAPER_URL: _zod.z.string({
        required_error: 'Must provide the front end URL'
    }),
    CLIENTID_BUCKET: _zod.z.string({
        required_error: 'Must provide google client ID for the bucket'
    }),
    CLIENTSECRET_BUCKET: _zod.z.string({
        required_error: 'Must provide client secret key for google bucket'
    }),
    CALLBACK_BUCKET: _zod.z.string({
        required_error: 'Must provide a callback URL for google o auth bucket'
    }),
    YOUTUBE_CHANNEL: _zod.z.string({
        invalid_type_error: 'Must provide a string as a channel id'
    }).optional(),
    TURSO_AUTH_TOKEN: _zod.z.string({
        required_error: 'Must provide a conection token'
    }),
    TURSO_DATABASE_URL: _zod.z.string({
        invalid_type_error: 'Must provide a database url'
    })
});
dotenvSchema.parse(process.env);
const userLogged = {
    isVerified: false,
    lastName: '',
    id: '',
    username: '',
    name: '',
    rol: '',
    accessToken: '',
    fbid: ''
};
const PORT = process.env.PORT !== undefined ? process.env.PORT : 8080;
_appmiddleware.app.use((0, _connectflash.default)());
const server = _appmiddleware.app.listen(PORT, ()=>{
    _loggerservice.logger.info(`Escuchando puerto ${PORT}`);
});
const io = new _socketio.Server(server, {
    cors: {
        origin: 'http://localhost:3000/',
        methods: [
            'PUT',
            'POST',
            'GET'
        ]
    }
});
io.on('connection', ()=>{
    console.log('connection');
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmVyIH0gZnJvbSAnc29ja2V0LmlvJ1xyXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuL1NlcnZpY2VzL2xvZ2dlci5zZXJ2aWNlJ1xyXG5pbXBvcnQgeyBhcHAgfSBmcm9tICcuL2FwcC5taWRkbGV3YXJlJ1xyXG5pbXBvcnQgZmxhc2ggZnJvbSAnY29ubmVjdC1mbGFzaCdcclxuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCdcclxuXHJcbmNvbnN0IGRvdGVudlNjaGVtYSA9IHoub2JqZWN0KHtcclxuICBEQVRBQkFTRV9VUkw6IHouc3RyaW5nKHsgcmVxdWlyZWRfZXJyb3I6ICdNdXN0IHByb3ZpZGUgIGEgVVJMIHRvIGNvbm5lY3QgdG8gdGhlIGRhdGFiYXNlJyB9KSxcclxuICBMT0dfRElSRUNUT1JZOiB6LnN0cmluZyh7IHJlcXVpcmVkX2Vycm9yOiAnTXVzdCBwcm92aWRlIGEgcGF0aCB0byB0aGUgbG9ncyBkaXJlY3RvcnknIH0pLFxyXG4gIFRLTl9FWFBJUkFUSU9OOiB6LnN0cmluZyh7IHJlcXVpcmVkX2Vycm9yOiAnTXVzdCBkZWZpbmUgSldUIGR1cmF0aW9uJyB9KSxcclxuICBLRVlTX1BBVEg6IHouc3RyaW5nKHsgcmVxdWlyZWRfZXJyb3I6ICdNdXN0IHByb3ZpZGUgYSBwYXRoIHRvIENycHRvIGFzaW1ldHJpYyBrZXlzJyB9KSxcclxuICBDTElFTlRJRDogei5zdHJpbmcoeyByZXF1aXJlZF9lcnJvcjogJ011c3QgcHJvdmlkZSBnb29nbGUgY2xpZW50IElEJyB9KSxcclxuICBDQUxMQkFDS1VSTDogei5zdHJpbmcoeyByZXF1aXJlZF9lcnJvcjogJ011c3QgcHJvdmlkZSBhIGNhbGxiYWNrIFVSTCBmb3IgZ29vZ2xlIG8gYXV0aCcgfSksXHJcbiAgQ0xJRU5UU0VDUkVUOiB6LnN0cmluZyh7IHJlcXVpcmVkX2Vycm9yOiAnTXVzdCBwcm92aWRlIGNsaWVudCBzZWNyZXQga2V5IGZvciBnb29nbGUnIH0pLFxyXG4gIFNJTUVUUklDS0VZOiB6LnN0cmluZyh7IHJlcXVpcmVkX2Vycm9yOiAnTXVzdCBwcm92aWRlIGEgc2ltZXRyaWNLZXkgZm9yIHNpbWV0cmljIGVuY3JpcHRhdGlvbicgfSksXHJcbiAgRkFDRUJPT0tfQVBQX0lEOiB6LnN0cmluZyh7IHJlcXVpcmVkX2Vycm9yOiAnTXVzdCBwcm92aWRlIGZhY2Vib29rIGFwcCBJRCcgfSksXHJcbiAgRkFDRUJPT0tfQVBQX1NFQ1JFVDogei5zdHJpbmcoeyByZXF1aXJlZF9lcnJvcjogJ011c3QgcHJvdmlkZSBmYWNlYm9vayBhcHAgc2VjcmV0JyB9KSxcclxuICBGQUNFQk9PS19BUFBfQ0I6IHouc3RyaW5nKHsgcmVxdWlyZWRfZXJyb3I6ICdNdXN0IHByb3ZpZGUgYSBjYWxsYmFjayB1cmwgZm9yIEZhY2Vib29rIG9hdXRoJyB9KSxcclxuICBGQUNFQk9PS19QQUdFOiB6LnN0cmluZyh7IHJlcXVpcmVkX2Vycm9yOiAnTXVzdCBwcm92aWRlIGEgZmFjZWJvb2sgcGFnZSBpZCB5b3UgYWRtaW4gdG8gcG9zdCB0aGUgbmV3cyAgJyB9KSxcclxuICBGQl9QQUdFX1RPS0VOOiB6LnN0cmluZyh7IHJlcXVpcmVkX2Vycm9yOiAnTXVzdCBwcm92aWRlIGEgcGVybWFuZW50IHRva2VuIGZvciB0aGUgcGFnZScgfSksXHJcbiAgTkVXU1BBUEVSX1VSTDogei5zdHJpbmcoeyByZXF1aXJlZF9lcnJvcjogJ011c3QgcHJvdmlkZSB0aGUgZnJvbnQgZW5kIFVSTCcgfSksXHJcbiAgQ0xJRU5USURfQlVDS0VUOiB6LnN0cmluZyh7IHJlcXVpcmVkX2Vycm9yOiAnTXVzdCBwcm92aWRlIGdvb2dsZSBjbGllbnQgSUQgZm9yIHRoZSBidWNrZXQnIH0pLFxyXG4gIENMSUVOVFNFQ1JFVF9CVUNLRVQ6IHouc3RyaW5nKHsgcmVxdWlyZWRfZXJyb3I6ICdNdXN0IHByb3ZpZGUgY2xpZW50IHNlY3JldCBrZXkgZm9yIGdvb2dsZSBidWNrZXQnIH0pLFxyXG4gIENBTExCQUNLX0JVQ0tFVDogei5zdHJpbmcoeyByZXF1aXJlZF9lcnJvcjogJ011c3QgcHJvdmlkZSBhIGNhbGxiYWNrIFVSTCBmb3IgZ29vZ2xlIG8gYXV0aCBidWNrZXQnIH0pLFxyXG4gIFlPVVRVQkVfQ0hBTk5FTDogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdNdXN0IHByb3ZpZGUgYSBzdHJpbmcgYXMgYSBjaGFubmVsIGlkJyB9KS5vcHRpb25hbCgpLFxyXG4gIFRVUlNPX0FVVEhfVE9LRU46IHouc3RyaW5nKHsgcmVxdWlyZWRfZXJyb3I6ICdNdXN0IHByb3ZpZGUgYSBjb25lY3Rpb24gdG9rZW4nIH0pLFxyXG4gIFRVUlNPX0RBVEFCQVNFX1VSTDogei5zdHJpbmcoeyBpbnZhbGlkX3R5cGVfZXJyb3I6ICdNdXN0IHByb3ZpZGUgYSBkYXRhYmFzZSB1cmwnIH0pXHJcblxyXG59KVxyXG5kb3RlbnZTY2hlbWEucGFyc2UocHJvY2Vzcy5lbnYpXHJcbnR5cGUgZW52aXJvbWVudFZhcmlhYmxlcyA9IHouaW5mZXI8dHlwZW9mIGRvdGVudlNjaGVtYT5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbmFtZXNwYWNlXHJcbiAgbmFtZXNwYWNlIE5vZGVKU3tcclxuICAgIGludGVyZmFjZSBQcm9jZXNzRW52IGV4dGVuZHMgZW52aXJvbWVudFZhcmlhYmxlcyB7fVxyXG4gIH1cclxufVxyXG5leHBvcnQgY29uc3QgdXNlckxvZ2dlZDoge1xyXG4gIGlzVmVyaWZpZWQ6IGJvb2xlYW5cclxuICBsYXN0TmFtZTogc3RyaW5nXHJcbiAgaWQ6IHN0cmluZ1xyXG4gIGZiaWQ6IHN0cmluZ1xyXG4gIHVzZXJuYW1lOiBzdHJpbmdcclxuICBuYW1lOiBzdHJpbmdcclxuICByb2w6IHN0cmluZ1xyXG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmcgfCBudWxsXHJcbn0gPSB7IGlzVmVyaWZpZWQ6IGZhbHNlLCBsYXN0TmFtZTogJycsIGlkOiAnJywgdXNlcm5hbWU6ICcnLCBuYW1lOiAnJywgcm9sOiAnJywgYWNjZXNzVG9rZW46ICcnLCBmYmlkOiAnJyB9XHJcbmNvbnN0IFBPUlQgPSBwcm9jZXNzLmVudi5QT1JUICE9PSB1bmRlZmluZWQgPyBwcm9jZXNzLmVudi5QT1JUIDogODA4MFxyXG5hcHAudXNlKGZsYXNoKCkpXHJcblxyXG5leHBvcnQgY29uc3Qgc2VydmVyID0gYXBwLmxpc3RlbihQT1JULCAoKSA9PiB7XHJcbiAgbG9nZ2VyLmluZm8oYEVzY3VjaGFuZG8gcHVlcnRvICR7UE9SVH1gKVxyXG59KVxyXG5cclxuZXhwb3J0IGNvbnN0IGlvID0gbmV3IFNlcnZlcihzZXJ2ZXIsIHsgY29yczogeyBvcmlnaW46ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvJywgbWV0aG9kczogWydQVVQnLCAnUE9TVCcsICdHRVQnXSB9IH0pXHJcbmlvLm9uKCdjb25uZWN0aW9uJywgKCkgPT4geyBjb25zb2xlLmxvZygnY29ubmVjdGlvbicpIH0pXHJcbiJdLCJuYW1lcyI6WyJpbyIsInNlcnZlciIsInVzZXJMb2dnZWQiLCJkb3RlbnZTY2hlbWEiLCJ6Iiwib2JqZWN0IiwiREFUQUJBU0VfVVJMIiwic3RyaW5nIiwicmVxdWlyZWRfZXJyb3IiLCJMT0dfRElSRUNUT1JZIiwiVEtOX0VYUElSQVRJT04iLCJLRVlTX1BBVEgiLCJDTElFTlRJRCIsIkNBTExCQUNLVVJMIiwiQ0xJRU5UU0VDUkVUIiwiU0lNRVRSSUNLRVkiLCJGQUNFQk9PS19BUFBfSUQiLCJGQUNFQk9PS19BUFBfU0VDUkVUIiwiRkFDRUJPT0tfQVBQX0NCIiwiRkFDRUJPT0tfUEFHRSIsIkZCX1BBR0VfVE9LRU4iLCJORVdTUEFQRVJfVVJMIiwiQ0xJRU5USURfQlVDS0VUIiwiQ0xJRU5UU0VDUkVUX0JVQ0tFVCIsIkNBTExCQUNLX0JVQ0tFVCIsIllPVVRVQkVfQ0hBTk5FTCIsImludmFsaWRfdHlwZV9lcnJvciIsIm9wdGlvbmFsIiwiVFVSU09fQVVUSF9UT0tFTiIsIlRVUlNPX0RBVEFCQVNFX1VSTCIsInBhcnNlIiwicHJvY2VzcyIsImVudiIsImlzVmVyaWZpZWQiLCJsYXN0TmFtZSIsImlkIiwidXNlcm5hbWUiLCJuYW1lIiwicm9sIiwiYWNjZXNzVG9rZW4iLCJmYmlkIiwiUE9SVCIsInVuZGVmaW5lZCIsImFwcCIsInVzZSIsImZsYXNoIiwibGlzdGVuIiwibG9nZ2VyIiwiaW5mbyIsIlNlcnZlciIsImNvcnMiLCJvcmlnaW4iLCJtZXRob2RzIiwib24iLCJjb25zb2xlIiwibG9nIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBc0RhQSxFQUFFO2VBQUZBOztJQUpBQyxNQUFNO2VBQU5BOztJQWJBQyxVQUFVO2VBQVZBOzs7MEJBckNVOytCQUNBOytCQUNIO3FFQUNGO3FCQUNBOzs7Ozs7QUFFbEIsTUFBTUMsZUFBZUMsTUFBQyxDQUFDQyxNQUFNLENBQUM7SUFDNUJDLGNBQWNGLE1BQUMsQ0FBQ0csTUFBTSxDQUFDO1FBQUVDLGdCQUFnQjtJQUFpRDtJQUMxRkMsZUFBZUwsTUFBQyxDQUFDRyxNQUFNLENBQUM7UUFBRUMsZ0JBQWdCO0lBQTRDO0lBQ3RGRSxnQkFBZ0JOLE1BQUMsQ0FBQ0csTUFBTSxDQUFDO1FBQUVDLGdCQUFnQjtJQUEyQjtJQUN0RUcsV0FBV1AsTUFBQyxDQUFDRyxNQUFNLENBQUM7UUFBRUMsZ0JBQWdCO0lBQThDO0lBQ3BGSSxVQUFVUixNQUFDLENBQUNHLE1BQU0sQ0FBQztRQUFFQyxnQkFBZ0I7SUFBZ0M7SUFDckVLLGFBQWFULE1BQUMsQ0FBQ0csTUFBTSxDQUFDO1FBQUVDLGdCQUFnQjtJQUFnRDtJQUN4Rk0sY0FBY1YsTUFBQyxDQUFDRyxNQUFNLENBQUM7UUFBRUMsZ0JBQWdCO0lBQTRDO0lBQ3JGTyxhQUFhWCxNQUFDLENBQUNHLE1BQU0sQ0FBQztRQUFFQyxnQkFBZ0I7SUFBdUQ7SUFDL0ZRLGlCQUFpQlosTUFBQyxDQUFDRyxNQUFNLENBQUM7UUFBRUMsZ0JBQWdCO0lBQStCO0lBQzNFUyxxQkFBcUJiLE1BQUMsQ0FBQ0csTUFBTSxDQUFDO1FBQUVDLGdCQUFnQjtJQUFtQztJQUNuRlUsaUJBQWlCZCxNQUFDLENBQUNHLE1BQU0sQ0FBQztRQUFFQyxnQkFBZ0I7SUFBaUQ7SUFDN0ZXLGVBQWVmLE1BQUMsQ0FBQ0csTUFBTSxDQUFDO1FBQUVDLGdCQUFnQjtJQUErRDtJQUN6R1ksZUFBZWhCLE1BQUMsQ0FBQ0csTUFBTSxDQUFDO1FBQUVDLGdCQUFnQjtJQUE4QztJQUN4RmEsZUFBZWpCLE1BQUMsQ0FBQ0csTUFBTSxDQUFDO1FBQUVDLGdCQUFnQjtJQUFpQztJQUMzRWMsaUJBQWlCbEIsTUFBQyxDQUFDRyxNQUFNLENBQUM7UUFBRUMsZ0JBQWdCO0lBQStDO0lBQzNGZSxxQkFBcUJuQixNQUFDLENBQUNHLE1BQU0sQ0FBQztRQUFFQyxnQkFBZ0I7SUFBbUQ7SUFDbkdnQixpQkFBaUJwQixNQUFDLENBQUNHLE1BQU0sQ0FBQztRQUFFQyxnQkFBZ0I7SUFBdUQ7SUFDbkdpQixpQkFBaUJyQixNQUFDLENBQUNHLE1BQU0sQ0FBQztRQUFFbUIsb0JBQW9CO0lBQXdDLEdBQUdDLFFBQVE7SUFDbkdDLGtCQUFrQnhCLE1BQUMsQ0FBQ0csTUFBTSxDQUFDO1FBQUVDLGdCQUFnQjtJQUFpQztJQUM5RXFCLG9CQUFvQnpCLE1BQUMsQ0FBQ0csTUFBTSxDQUFDO1FBQUVtQixvQkFBb0I7SUFBOEI7QUFFbkY7QUFDQXZCLGFBQWEyQixLQUFLLENBQUNDLFFBQVFDLEdBQUc7QUFRdkIsTUFBTTlCLGFBU1Q7SUFBRStCLFlBQVk7SUFBT0MsVUFBVTtJQUFJQyxJQUFJO0lBQUlDLFVBQVU7SUFBSUMsTUFBTTtJQUFJQyxLQUFLO0lBQUlDLGFBQWE7SUFBSUMsTUFBTTtBQUFHO0FBQzFHLE1BQU1DLE9BQU9WLFFBQVFDLEdBQUcsQ0FBQ1MsSUFBSSxLQUFLQyxZQUFZWCxRQUFRQyxHQUFHLENBQUNTLElBQUksR0FBRztBQUNqRUUsa0JBQUcsQ0FBQ0MsR0FBRyxDQUFDQyxJQUFBQSxxQkFBSztBQUVOLE1BQU01QyxTQUFTMEMsa0JBQUcsQ0FBQ0csTUFBTSxDQUFDTCxNQUFNO0lBQ3JDTSxxQkFBTSxDQUFDQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsRUFBRVAsS0FBSyxDQUFDO0FBQ3pDO0FBRU8sTUFBTXpDLEtBQUssSUFBSWlELGdCQUFNLENBQUNoRCxRQUFRO0lBQUVpRCxNQUFNO1FBQUVDLFFBQVE7UUFBMEJDLFNBQVM7WUFBQztZQUFPO1lBQVE7U0FBTTtJQUFDO0FBQUU7QUFDbkhwRCxHQUFHcUQsRUFBRSxDQUFDLGNBQWM7SUFBUUMsUUFBUUMsR0FBRyxDQUFDO0FBQWMifQ==