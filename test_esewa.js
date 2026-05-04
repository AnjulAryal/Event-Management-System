const crypto = require('crypto');

function generateSignatureNode(total_amount, transaction_uuid, product_code) {
    const secretKey = "8gBm/:&EnhH.1/q";
    const message = `${total_amount},${transaction_uuid},${product_code}`;
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(message);
    return hmac.digest('base64');
}

console.log(generateSignatureNode(100, "11-22-33", "EPAYTEST"));
