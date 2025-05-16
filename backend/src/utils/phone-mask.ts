export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;

  const visiblePart = phone.slice(0, 4); // первые 4 символа
  const maskedPart = '*'.repeat(phone.length - 4); // замена остальных

  return visiblePart + maskedPart;
}