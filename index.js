import express from 'express';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'bson';
import { getController } from './controllers/getController.js';
import { putController } from './controllers/putController.js';
import { postController } from './controllers/postController.js';

const client = new MongoClient(
  'mongodb+srv://geravvene:NJxN8XPdTKMe84YF@wordigma.rmxf6nd.mongodb.net/'
);

const db = client.db('Wordigma');

const app = express();

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://geravvene.github.io'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers'
  );
  next();
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    return console.log(err);
  }
})();

getController(app, db, ObjectId);
putController(app, db, ObjectId);
postController(app, db, ObjectId);

app.listen(5172);

process.on('SIGINT', async () => {
  await client.close();
  console.log('Приложение завершило работу');
  process.exit();
});

export default app;
