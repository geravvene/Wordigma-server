import authors from './Wordigma.authors.json' assert { type: 'json' };
import users from './Wordigma.users.json' assert { type: 'json' };
import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb+srv://geravvene:Mhcv3lAti7HZWEnd@wordigma.rmxf6nd.mongodb.net/?retryWrites=true');

(async () => {
  try {
    await client.connect();
  } catch (err) {
    return console.log(err);
  }
})();

const db = client.db('Wordigma');

let quotes = [];

authors.forEach((obj) => {
  let index = 0;
  obj.quotes.forEach((quote) => {
    const quote2 = {
      _id: new ObjectId(quote._id.$oid),
      text: quote.text,
    };
    obj.quotes[index] = quote2;
    quotes.push({
      ...quote2,
      author: {
        _id: new ObjectId(obj._id.$oid),
        name: obj.name,
      },
    });
    index++;
  });
  obj._id = new ObjectId(obj._id.$oid);
});

users.forEach((obj) => (obj._id = new ObjectId(obj._id.$oid)));

await db.collection('authors').insertMany(authors);
await db.collection('quotes').insertMany(quotes);
await db.collection('users').insertMany(users);

console.log('База данных создана');
client.close();
process.exit();
