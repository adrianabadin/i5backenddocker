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
    decrypt: function() {
        return decrypt;
    },
    encrypt: function() {
        return encrypt;
    },
    genKeyPair: function() {
        return genKeyPair;
    },
    simetricKeyCreate: function() {
        return simetricKeyCreate;
    }
});
const _crypto = /*#__PURE__*/ _interop_require_default(require("crypto"));
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function genKeyPair(path) {
    // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
    const { privateKey, publicKey } = _crypto.default.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem' // Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem' // Most common formatting choice
        }
    });
    _fs.default.writeFileSync(`../${path}/publicKey.pem`, publicKey);
    _fs.default.writeFileSync(`../${path}/privateKey.pem`, privateKey);
}
function simetricKeyCreate(path) {
    const key = _crypto.default.randomBytes(32);
    _fs.default.writeFileSync(`../${path}/simetricKey.pem`, key.toString('base64'));
    console.log(key.toString('base64'));
}
function encrypt(value, simetricKey) {
    const iv = _crypto.default.randomBytes(16);
    const cipher = _crypto.default.createCipheriv('aes-256-cbc', Buffer.from(simetricKey, 'base64'), iv);
    cipher.setAutoPadding(true);
    let encriptedText = cipher.update(value, 'utf-8', 'hex');
    encriptedText += cipher.final('hex');
    console.log(iv);
    return iv.toString('hex') + 'bLoquE' + encriptedText;
}
function decrypt(value, simetricKey) {
    const iv = Buffer.from(value.split('bLoquE')[0], 'hex');
    const decipher = _crypto.default.createDecipheriv('aes-256-cbc', Buffer.from(simetricKey, 'base64'), iv);
    decipher.setAutoPadding(true);
    const encryptedText = value.split('bLoquE')[1];
    let decryptedToken = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedToken += decipher.final('utf8');
    return decryptedToken;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TZXJ2aWNlcy9rZXlwYWlyLnNlcnZpY2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nXHJcbmltcG9ydCBmcyBmcm9tICdmcydcclxuZXhwb3J0IGZ1bmN0aW9uIGdlbktleVBhaXIgKHBhdGg6IHN0cmluZyk6IHZvaWQge1xyXG4gIC8vIEdlbmVyYXRlcyBhbiBvYmplY3Qgd2hlcmUgdGhlIGtleXMgYXJlIHN0b3JlZCBpbiBwcm9wZXJ0aWVzIGBwcml2YXRlS2V5YCBhbmQgYHB1YmxpY0tleWBcclxuICBjb25zdCB7IHByaXZhdGVLZXksIHB1YmxpY0tleSB9ID0gY3J5cHRvLmdlbmVyYXRlS2V5UGFpclN5bmMoJ3JzYScsIHtcclxuICAgIG1vZHVsdXNMZW5ndGg6IDQwOTYsIC8vIGJpdHMgLSBzdGFuZGFyZCBmb3IgUlNBIGtleXNcclxuICAgIHB1YmxpY0tleUVuY29kaW5nOiB7XHJcbiAgICAgIHR5cGU6ICdwa2NzMScsIC8vIFwiUHVibGljIEtleSBDcnlwdG9ncmFwaHkgU3RhbmRhcmRzIDFcIlxyXG4gICAgICBmb3JtYXQ6ICdwZW0nIC8vIE1vc3QgY29tbW9uIGZvcm1hdHRpbmcgY2hvaWNlXHJcbiAgICB9LFxyXG4gICAgcHJpdmF0ZUtleUVuY29kaW5nOiB7XHJcbiAgICAgIHR5cGU6ICdwa2NzMScsIC8vIFwiUHVibGljIEtleSBDcnlwdG9ncmFwaHkgU3RhbmRhcmRzIDFcIlxyXG4gICAgICBmb3JtYXQ6ICdwZW0nIC8vIE1vc3QgY29tbW9uIGZvcm1hdHRpbmcgY2hvaWNlXHJcbiAgICB9XHJcbiAgfSlcclxuICBmcy53cml0ZUZpbGVTeW5jKGAuLi8ke3BhdGh9L3B1YmxpY0tleS5wZW1gLCBwdWJsaWNLZXkpXHJcbiAgZnMud3JpdGVGaWxlU3luYyhgLi4vJHtwYXRofS9wcml2YXRlS2V5LnBlbWAsIHByaXZhdGVLZXkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaW1ldHJpY0tleUNyZWF0ZSAocGF0aDogc3RyaW5nKTogdm9pZCB7XHJcbiAgY29uc3Qga2V5ID0gY3J5cHRvLnJhbmRvbUJ5dGVzKDMyKVxyXG4gIGZzLndyaXRlRmlsZVN5bmMoYC4uLyR7cGF0aH0vc2ltZXRyaWNLZXkucGVtYCwga2V5LnRvU3RyaW5nKCdiYXNlNjQnKSlcclxuICBjb25zb2xlLmxvZyhrZXkudG9TdHJpbmcoJ2Jhc2U2NCcpKVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBlbmNyeXB0ICh2YWx1ZTogc3RyaW5nLCBzaW1ldHJpY0tleTogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBpdiA9IGNyeXB0by5yYW5kb21CeXRlcygxNilcclxuICBjb25zdCBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgQnVmZmVyLmZyb20oc2ltZXRyaWNLZXksICdiYXNlNjQnKSwgaXYpXHJcbiAgY2lwaGVyLnNldEF1dG9QYWRkaW5nKHRydWUpXHJcbiAgbGV0IGVuY3JpcHRlZFRleHQgPSBjaXBoZXIudXBkYXRlKHZhbHVlLCAndXRmLTgnLCAnaGV4JylcclxuICBlbmNyaXB0ZWRUZXh0ICs9IGNpcGhlci5maW5hbCgnaGV4JylcclxuICBjb25zb2xlLmxvZyhpdilcclxuICByZXR1cm4gaXYudG9TdHJpbmcoJ2hleCcpICsgJ2JMb3F1RScgKyBlbmNyaXB0ZWRUZXh0XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGRlY3J5cHQgKHZhbHVlOiBzdHJpbmcsIHNpbWV0cmljS2V5OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGNvbnN0IGl2ID0gQnVmZmVyLmZyb20odmFsdWUuc3BsaXQoJ2JMb3F1RScpWzBdLCAnaGV4JylcclxuICBjb25zdCBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIEJ1ZmZlci5mcm9tKHNpbWV0cmljS2V5LCAnYmFzZTY0JyksIGl2KVxyXG4gIGRlY2lwaGVyLnNldEF1dG9QYWRkaW5nKHRydWUpXHJcbiAgY29uc3QgZW5jcnlwdGVkVGV4dCA9IHZhbHVlLnNwbGl0KCdiTG9xdUUnKVsxXVxyXG4gIGxldCBkZWNyeXB0ZWRUb2tlbiA9IGRlY2lwaGVyLnVwZGF0ZShlbmNyeXB0ZWRUZXh0LCAnaGV4JywgJ3V0ZjgnKVxyXG4gIGRlY3J5cHRlZFRva2VuICs9IGRlY2lwaGVyLmZpbmFsKCd1dGY4JylcclxuICByZXR1cm4gZGVjcnlwdGVkVG9rZW5cclxufVxyXG4iXSwibmFtZXMiOlsiZGVjcnlwdCIsImVuY3J5cHQiLCJnZW5LZXlQYWlyIiwic2ltZXRyaWNLZXlDcmVhdGUiLCJwYXRoIiwicHJpdmF0ZUtleSIsInB1YmxpY0tleSIsImNyeXB0byIsImdlbmVyYXRlS2V5UGFpclN5bmMiLCJtb2R1bHVzTGVuZ3RoIiwicHVibGljS2V5RW5jb2RpbmciLCJ0eXBlIiwiZm9ybWF0IiwicHJpdmF0ZUtleUVuY29kaW5nIiwiZnMiLCJ3cml0ZUZpbGVTeW5jIiwia2V5IiwicmFuZG9tQnl0ZXMiLCJ0b1N0cmluZyIsImNvbnNvbGUiLCJsb2ciLCJ2YWx1ZSIsInNpbWV0cmljS2V5IiwiaXYiLCJjaXBoZXIiLCJjcmVhdGVDaXBoZXJpdiIsIkJ1ZmZlciIsImZyb20iLCJzZXRBdXRvUGFkZGluZyIsImVuY3JpcHRlZFRleHQiLCJ1cGRhdGUiLCJmaW5hbCIsInNwbGl0IiwiZGVjaXBoZXIiLCJjcmVhdGVEZWNpcGhlcml2IiwiZW5jcnlwdGVkVGV4dCIsImRlY3J5cHRlZFRva2VuIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFpQ2dCQSxPQUFPO2VBQVBBOztJQVRBQyxPQUFPO2VBQVBBOztJQXRCQUMsVUFBVTtlQUFWQTs7SUFpQkFDLGlCQUFpQjtlQUFqQkE7OzsrREFuQkc7MkRBQ0o7Ozs7OztBQUNSLFNBQVNELFdBQVlFLElBQVk7SUFDdEMsMkZBQTJGO0lBQzNGLE1BQU0sRUFBRUMsVUFBVSxFQUFFQyxTQUFTLEVBQUUsR0FBR0MsZUFBTSxDQUFDQyxtQkFBbUIsQ0FBQyxPQUFPO1FBQ2xFQyxlQUFlO1FBQ2ZDLG1CQUFtQjtZQUNqQkMsTUFBTTtZQUNOQyxRQUFRLE1BQU0sZ0NBQWdDO1FBQ2hEO1FBQ0FDLG9CQUFvQjtZQUNsQkYsTUFBTTtZQUNOQyxRQUFRLE1BQU0sZ0NBQWdDO1FBQ2hEO0lBQ0Y7SUFDQUUsV0FBRSxDQUFDQyxhQUFhLENBQUMsQ0FBQyxHQUFHLEVBQUVYLEtBQUssY0FBYyxDQUFDLEVBQUVFO0lBQzdDUSxXQUFFLENBQUNDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsRUFBRVgsS0FBSyxlQUFlLENBQUMsRUFBRUM7QUFDaEQ7QUFFTyxTQUFTRixrQkFBbUJDLElBQVk7SUFDN0MsTUFBTVksTUFBTVQsZUFBTSxDQUFDVSxXQUFXLENBQUM7SUFDL0JILFdBQUUsQ0FBQ0MsYUFBYSxDQUFDLENBQUMsR0FBRyxFQUFFWCxLQUFLLGdCQUFnQixDQUFDLEVBQUVZLElBQUlFLFFBQVEsQ0FBQztJQUM1REMsUUFBUUMsR0FBRyxDQUFDSixJQUFJRSxRQUFRLENBQUM7QUFDM0I7QUFDTyxTQUFTakIsUUFBU29CLEtBQWEsRUFBRUMsV0FBbUI7SUFDekQsTUFBTUMsS0FBS2hCLGVBQU0sQ0FBQ1UsV0FBVyxDQUFDO0lBQzlCLE1BQU1PLFNBQVNqQixlQUFNLENBQUNrQixjQUFjLENBQUMsZUFBZUMsT0FBT0MsSUFBSSxDQUFDTCxhQUFhLFdBQVdDO0lBQ3hGQyxPQUFPSSxjQUFjLENBQUM7SUFDdEIsSUFBSUMsZ0JBQWdCTCxPQUFPTSxNQUFNLENBQUNULE9BQU8sU0FBUztJQUNsRFEsaUJBQWlCTCxPQUFPTyxLQUFLLENBQUM7SUFDOUJaLFFBQVFDLEdBQUcsQ0FBQ0c7SUFDWixPQUFPQSxHQUFHTCxRQUFRLENBQUMsU0FBUyxXQUFXVztBQUN6QztBQUNPLFNBQVM3QixRQUFTcUIsS0FBYSxFQUFFQyxXQUFtQjtJQUN6RCxNQUFNQyxLQUFLRyxPQUFPQyxJQUFJLENBQUNOLE1BQU1XLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFO0lBQ2pELE1BQU1DLFdBQVcxQixlQUFNLENBQUMyQixnQkFBZ0IsQ0FBQyxlQUFlUixPQUFPQyxJQUFJLENBQUNMLGFBQWEsV0FBV0M7SUFDNUZVLFNBQVNMLGNBQWMsQ0FBQztJQUN4QixNQUFNTyxnQkFBZ0JkLE1BQU1XLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRTtJQUM5QyxJQUFJSSxpQkFBaUJILFNBQVNILE1BQU0sQ0FBQ0ssZUFBZSxPQUFPO0lBQzNEQyxrQkFBa0JILFNBQVNGLEtBQUssQ0FBQztJQUNqQyxPQUFPSztBQUNUIn0=