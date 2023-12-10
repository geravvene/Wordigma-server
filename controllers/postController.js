import * as fs from "fs";
import multer from "multer";

const host = "https://wordigma-server-al8a.vercel.app/";
const upload = multer();

export async function postController(app, db, ObjectId) {
  app.post("/quotes", async (req, res) => {
    try {
      const id = new ObjectId();
      await db.collection("authors").updateOne(
        { _id: new ObjectId(req.body.author._id) },
        {
          $addToSet: {
            quotes: { _id: id, text: req.body.text },
          },
        }
      );
      res.send(
        await db.collection("quotes").insertOne({
          _id: id,
          text: req.body.text,
          author: {
            _id: new ObjectId(req.body.author._id),
            name: req.body.author.name,
          },
        })
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
  
  app.post("/authors", upload.single("img"), async (req, res) => {
    try {
      const file = req.file;
      res.send(
        await db.collection("authors").insertOne({
          name: req.body.name,
          url: req.body.url,
          img: `${host}/public/images/authors/${
            req.body.name
          }.${file.mimetype.slice(6)}`,
          quotes: [],
        })
      );
      fs.writeFile(
        `./server/public/images/authors/${req.body.name}.${file.mimetype.slice(
          6
        )}`,
        file.buffer,
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Файл создан");
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  app.post("/:col", async (req, res) => {
    try {
      res.send(await db.collection(req.params.col).insertOne(req.body));
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
