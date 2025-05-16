"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskPhone = maskPhone;
function maskPhone(phone) {
    if (!phone || phone.length < 4)
        return phone;
    const visiblePart = phone.slice(0, 4);
    const maskedPart = '*'.repeat(phone.length - 4);
    return visiblePart + maskedPart;
}
//# sourceMappingURL=phone-mask.js.map