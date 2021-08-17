import * as cryptoModule from "./crypto.js";
import * as Jwt from "./jwt.js";
import * as uuid from './uuid.js';
import * as tokenClient from './tokenClient.js'

export async function createDpopProof(atHash, jwk, key, resourceUrl) {
    var dpopProof = {
        key: undefined,
        jwk: undefined,
        thumbprint: undefined
    };
    
    var dpop_proof_payload = {
        jti: await uuid.generate(),
        htm: "POST",
        htu: resourceUrl,
        iat: Math.floor(Date.now() / 1000)
    };
    
    if (atHash)
        dpop_proof_payload["ath"] = atHash;

    var header = {
        typ: "dpop+jwt",
        alg: "ES256",
        jwk: undefined
    };

    if (!key){
        key = await cryptoModule.generateKey();
    }

    if (!jwk){
        jwk = await cryptoModule.exportJwk(key.publicKey);
        delete jwk.ext;
        delete jwk.key_ops;
    }        

    header.jwk = jwk;
    
    var dpopProof = await Jwt.create(key.privateKey, header, dpop_proof_payload);

    return { dpopProof: dpopProof, key: key, jwk: jwk};
    
}