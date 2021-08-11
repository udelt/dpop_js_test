import * as DPOP from './modules/dpopProof.js'
import * as TokenClient from './modules/tokenClient.js';
import * as API from './modules/apiClient.js';
import * as Crypto from './modules/crypto.js';
import * as Jwt from './modules/jwt.js';
import * as JwtRenderer from './modules/jwtRender.js'

const tokenEndpointUrl = "https://dpopidentityserver.azurewebsites.net/connect/token"; //"https://localhost:5001/connect/token";

var base64DpopProof = undefined;

export async function start()
{
    var dpop_proof_for_as = await DPOP.createDpopProof();
    base64DpopProof = dpop_proof_for_as;

    var accessToken = await TokenClient.getAccessToken(tokenEndpointUrl, dpop_proof_for_as.dpopProof);

    var parts = Jwt.getParts(accessToken);
    var partsAsString = Jwt.getPartsAsStrings(accessToken);

    var encodedAT = `${parts.header}.${parts.payload}.${parts.signature}`;
    var ATasString = `${partsAsString.header}.${partsAsString.payload}.${partsAsString.signature}`;

    var atHash = await Crypto.createHash(accessToken, true);
    console.log(atHash);

    var dpop_proof_for_resource = await DPOP.createDpopProof(atHash, dpop_proof_for_as.jwk, dpop_proof_for_as.key);
    console.log(dpop_proof_for_resource);

    var apiResult = await API.callAPI(accessToken, dpop_proof_for_resource.dpopProof);

    console.log(apiResult);

    return {enc: encodedAT, str: ATasString};
}

export async function generateDpopProof(resourceUrl){
    var dpop_proof_for_as = await DPOP.createDpopProof(null, null, null, resourceUrl);
    return dpop_proof_for_as;
}

export async function getAccessToken(tokenEndpointUri, dpopProof){
    var accessToken = await TokenClient.getAccessToken(tokenEndpointUri, dpopProof);
    return accessToken;
}

export async function getAccessTokenHash(accessToken){
    var atHash = await Crypto.createHash(accessToken, true);
    return atHash;
}

export async function generateDpopProofForResource(accessTokenHash, dpop_proof_for_as, resourceUrl){
    var dpop_proof_for_resource = await DPOP.createDpopProof(accessTokenHash, dpop_proof_for_as.jwk, dpop_proof_for_as.key, resourceUrl);
    return dpop_proof_for_resource;
}

export async function callAPI(accessToken, dpop_proof_for_resource){
    var apiResult = await API.callAPI(accessToken, dpop_proof_for_resource.dpopProof);
    return apiResult;
}

export function getAccessTokenParts(accessToken)
{
    var encodedAT = `${parts.header}.${parts.payload}.${parts.signature}`;
    var ATasString = `${partsAsString.header}.${partsAsString.payload}.${partsAsString.signature}`;

    return {encoded: encodedAT, asString: ATasString};
}

export function renderBase64DpopProof(document, element, token){
    
    var parts = token.split(".");

    var headerTextNode = document.createTextNode(parts[0]);
    var payloadTextNode = document.createTextNode(parts[1]);
    var signatureTextNode = document.createTextNode(parts[2]);

    var headerSpan = document.createElement("span");
    var payloadSpan = document.createElement("span");
    var signatureSpan = document.createElement("span");
    var separatorSpan1 = document.createElement("span");
    var separatorSpan2 = document.createElement("span");

    headerSpan.classList.add("jwt-header");
    payloadSpan.classList.add("jwt-payload");
    signatureSpan.classList.add("jwt-signature");
    separatorSpan1.classList.add("jwt-part-separator")
    separatorSpan2.classList.add("jwt-part-separator")

    headerSpan.appendChild(headerTextNode);
    payloadSpan.appendChild(payloadTextNode);
    signatureSpan.appendChild(signatureTextNode);
    separatorSpan1.appendChild(document.createTextNode("."));
    separatorSpan2.appendChild(document.createTextNode("."));


    element.appendChild(headerSpan);
    element.appendChild(separatorSpan1);
    element.appendChild(payloadSpan);
    element.appendChild(separatorSpan2);
    element.appendChild(signatureSpan);
}

export function renderJwt(document, token, headerElement, payloadElement, signatureElement){
    var parts = Jwt.getParts(token);

    var header = Jwt.partToJson(parts.header);
    var payload = Jwt.partToJson(parts.payload);
    var signature = parts.signature;

    JwtRenderer.renderJwtPart(document, header, headerElement);
    JwtRenderer.renderJwtPart(document, payload, payloadElement);

    var jwtSignature = renderJwtSignature(document, signature);
    signatureElement.appendChild(jwtSignature);
}

function renderJwtSignature(document, signature){
    var container = document.createElement("div");
    container.appendChild(document.createTextNode(signature));
    return container;
}


