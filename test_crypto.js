const crypto = require('crypto');

function generateSignatureNode(total_amount, transaction_uuid, product_code) {
    const secretKey = "8gBm/:&EnhH.1/q";
    const message = `${total_amount},${transaction_uuid},${product_code}`;
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(message);
    return hmac.digest('base64');
}

async function webCryptoMock(total_amount, transaction_uuid, product_code) {
    const secretKey = "8gBm/:&EnhH.1/q";
    const message = `${total_amount},${transaction_uuid},${product_code}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const messageData = encoder.encode(message);

    const cryptoKey = await crypto.webcrypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signatureBuffer = await crypto.webcrypto.subtle.sign("HMAC", cryptoKey, messageData);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    return btoa(String.fromCharCode.apply(null, signatureArray));
}

async function run() {
    console.log("Node:", generateSignatureNode(100, "11-22-33", "EPAYTEST"));
    console.log("Web:", await webCryptoMock(100, "11-22-33", "EPAYTEST"));
}
run();
