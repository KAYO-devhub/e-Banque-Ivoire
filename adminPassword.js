import bcrypt from 'bcrypt';

const hash = await bcrypt.hash('Admin123#', 10);

const user = JSON.parse(localStorage.getItem('userData'))
console.log(user)