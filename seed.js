const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/collegeEventDB')
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));

const registrationSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String
});

const Registration = mongoose.model('Registration', registrationSchema);

async function seed() {
  await Registration.deleteMany({});

  await Registration.insertMany([
    { email: 'admin@gmail.com', password: 'admin123', role: 'admin' },
    { email: 'org@gmail.com', password: 'org123', role: 'organizer' },
    { email: 'user@gmail.com', password: 'user123', role: 'user' }
  ]);

  console.log('USERS INSERTED SUCCESSFULLY');
  mongoose.connection.close();
}

seed();
