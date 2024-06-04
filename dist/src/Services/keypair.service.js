"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.simetricKeyCreate = exports.genKeyPair = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
function genKeyPair(path) {
    // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
    const { privateKey, publicKey } = crypto_1.default.generateKeyPairSync('rsa', {
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
    fs_1.default.writeFileSync(`../${path}/publicKey.pem`, publicKey);
    fs_1.default.writeFileSync(`../${path}/privateKey.pem`, privateKey);
}
exports.genKeyPair = genKeyPair;
function simetricKeyCreate(path) {
    const key = crypto_1.default.randomBytes(32);
    fs_1.default.writeFileSync(`../${path}/simetricKey.pem`, key.toString('base64'));
    console.log(key.toString('base64'));
}
exports.simetricKeyCreate = simetricKeyCreate;
function encrypt(value, simetricKey) {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(simetricKey, 'base64'), iv);
    cipher.setAutoPadding(true);
    let encriptedText = cipher.update(value, 'utf-8', 'hex');
    encriptedText += cipher.final('hex');
    console.log(iv);
    return iv.toString('hex') + 'bLoquE' + encriptedText;
}
exports.encrypt = encrypt;
function decrypt(value, simetricKey) {
    const iv = Buffer.from(value.split('bLoquE')[0], 'hex');
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(simetricKey, 'base64'), iv);
    decipher.setAutoPadding(true);
    const encryptedText = value.split('bLoquE')[1];
    let decryptedToken = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedToken += decipher.final('utf8');
    return decryptedToken;
}
exports.decrypt = decrypt;
