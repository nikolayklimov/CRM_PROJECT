const bcrypt = require('bcrypt');

const password = 'owner123';
const hash = '$2b$10$misP29feIJ5UZwVkAaAOXuxLsLndmruxtKw34.6jMyny9Mrs3qbXq';

bcrypt.compare(password, hash).then(result => {
  console.log('Пароль совпадает:', result);
});

// const bcrypt = require('bcrypt');
// bcrypt.hash('owner123', 10).then(console.log)