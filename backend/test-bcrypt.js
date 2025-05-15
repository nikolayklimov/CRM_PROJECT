const bcrypt = require('bcrypt');

const password = 'admin123';
const hash = '$2b$10$WLjckF6s65usJIFf2RqHeOOI1t39UTeYTsbzDXgtt63tpxNL628yu';

bcrypt.compare(password, hash).then(result => {
  console.log('Пароль совпадает:', result);
});