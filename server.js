const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
  console.log(err);
  console.log('UNHANDLED REJECTION!  💥 Shutting down.... ');
  process.exit(1);
});

const app = require('./app');

//console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(DB, options).then(conn => {
  console.log('Database Connected Successfully!😀😀');
});

const port = process.env.PORT || 3000;
hostname = '127.0.0.1';

//4) START OF SERVER
const server = app.listen(port, hostname, () => {
  console.log(`App is running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!  💥 Shutting down.... ');
  server.close(() => {
    process.exit(1);
  });
});
