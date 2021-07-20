export function ToBase64Url(input) {
    const base64string = btoa(String.fromCharCode.apply(0, input));
    return base64string.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function Base64UrlToString(input) {
    input = input.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
    return new Uint8Array(
        Array.prototype.map.call(atob(input), (c) => c.charCodeAt(0))
    );
}