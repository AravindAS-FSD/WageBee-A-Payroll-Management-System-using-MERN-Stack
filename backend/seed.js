import bcrypt from 'bcrypt';

const hash = '$2b$10$kybn8NqFiTckA2GOFWKZVecvoh/6FeEE.c9J0B1GqpyZCzdoO1bVy';
const guess = 'priya@123'; // replace with your guess

const isMatch = await bcrypt.compare(guess, hash);

console.log(isMatch ? 'Password matched' : 'Wrong password');
