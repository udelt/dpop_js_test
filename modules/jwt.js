import * as Base64Url from './Base64Url.js';
import * as Crypto from './crypto.js'

export async function create(privateKey, header, payload) {
    const p = JSON.stringify(payload);
    const h = JSON.stringify(header);

    const partialToken = [
        Base64Url.ToBase64Url(Base64Url.utf8ToUint8Array(h)),
        Base64Url.ToBase64Url(Base64Url.utf8ToUint8Array(p)),
    ].join(".");

    const messageAsUint8Array = Base64Url.utf8ToUint8Array(partialToken);

    var signatureAsBase64 = await Crypto.Sign(privateKey, messageAsUint8Array);

    var token = `${partialToken}.${signatureAsBase64}`;
    
    return token;        
}

export function getParts(accessToken){    
    var parts = accessToken.split(".");

    var header = parts[0];
    var payload = parts[1];
    var signature = parts[2];

    return {header, payload, signature};
}

export function getPartsAsStrings(accessToken){
    var parts = getParts(accessToken);

    var headerString = prettyString(parts.header);
    var payloadString = prettyString(parts.payload);
    var signatureBase64Url = Base64Url.ToBase64UrlString(parts.signature);

    return {header: headerString, payload: payloadString, signature: signatureBase64Url}
}

function prettyString(section){
    var b64 = Base64Url.ToBase64UrlString(section);
    var str = atob(b64);
    var json = JSON.parse(str);
    var pretty = JSON.stringify(json, null, "    ");
    return pretty;

}

export function partToJson(section)
{
    var b64 = Base64Url.ToBase64UrlString(section);
    var str = atob(b64);
    var json = JSON.parse(str);
    return json;
}