import * as Base64 from './Base64Url.js';

export async function exportJwk(publicKey) {
    var jwk = await crypto.subtle.exportKey("jwk", publicKey)
        .then(function(keydata) {
            return keydata;
        })
        .catch(function(err) {
            console.error(err);
        });
    return jwk;
}

export async function generateKey() {
    var key = await crypto.subtle.generateKey({
            name: "ECDSA",
            namedCurve: "P-384"
        }, true, ["sign", "verify"])
        .then(function(eckey) {           
            return eckey;
        })
        .catch(function(err) {
            console.error(err);
        });
    return key;
}

export async function Sign(privateKey, messageAsUint8Array){
    var signature = await crypto.subtle.sign({
            name: "ECDSA",
            hash: { name: "SHA-256" },
            },
            privateKey,
            messageAsUint8Array)
        .then(function(signature) {
            const signatureAsBase64 = Base64.ToBase64Url(new Uint8Array(signature));
            return signatureAsBase64;
        })
        .catch(function(err){
            console.log(err);
            throw(err);
        });
    return signature;
};

export async function createHash(accessToken, noPadding = false){
    var encodedAT = new TextEncoder().encode(accessToken);
    var atHash = await crypto.subtle.digest('SHA-256', encodedAT)
    .then(function(hash) {        
        var base = Base64.ToBase64Url(new Uint8Array(hash));
        if (noPadding){
            base = base.replace(/\=+$/, '');
        }    
        return base;
    })
    .catch(function(err){
        console.log(err);
        throw err;
    });
    return atHash;
}