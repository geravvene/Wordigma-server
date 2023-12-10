export async function putController(app, db, ObjectId) {
  app.put("/users/:id/clear/favorite", async (req, res) => {
    try {
      res.send(
        await db.collection("users").updateOne(
          { _id: new ObjectId(req.params.id) },
          {
            $set: {
              favorite: [],
            },
          }
        )
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
  
  app.put("/users/:id/favorite/:mode", async (req, res) => {
    try {
      res.send(
        await db.collection("users").updateOne(
          { _id: new ObjectId(req.params.id) },
          {
            [`${req.params.mode == "add" ? "$addToSet" : "$pull"}`]: {
              favorite: new ObjectId(req.body.id),
            },
          }
        )
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
