export async function getController(app, db, ObjectId) {
  app.get('/public/:dir/:cat/:id', async (req, res) => {
    try {
      res.sendFile(`/${req.params.dir}/${req.params.cat}/${req.params.id}`, {
        root: 'C:/Wordigma/server/public',
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  app.get('/quotes/:mode/:id', async (req, res) => {
    try {
      res.send(
        await db
          .collection('quotes')
          .find({
            _id: {
              [req.params.mode == 'fav' ? '$in' : '$nin']: (
                await db
                  .collection('users')
                  .find({ _id: new ObjectId(req.params.id) })
                  .toArray()
              )[0]['favorite'],
            },
          })
          .toArray()
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  app.get('/:col', async (req, res) => {
    try {
      res.send(
        await db.collection(req.params.col).find(req.params.filter).toArray()
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  app.get('/:col/:id', async (req, res) => {
    try {
      res.send(
        (
          await db
            .collection(req.params.col)
            .find({ _id: new ObjectId(req.params.id) })
            .toArray()
        )[0]
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  app.get('/filter/:col/:filter', async (req, res) => {
    try {
      res.send(
        await db
          .collection(req.params.col)
          .find(JSON.parse(req.params.filter))
          .toArray()
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
  
  app.get('/:col/:id/:property', async (req, res) => {
    try {
      res.send(
        (
          await db
            .collection(req.params.col)
            .find({ _id: new ObjectId(req.params.id) })
            .toArray()
        )[0][req.params.property]
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
