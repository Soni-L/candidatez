import { connectToDatabase } from "../../../lib/db";
import { getSession } from "next-auth/react";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const userEmail = session.user.email;
  const title = req.body.title;
  const description = req.body.description;

  const client = await connectToDatabase();

  const usersCollection = await client.db().collection("users");
  let user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404);
    client.close();
    return;
  }

  const result = await client.db().collection("jobs").insertOne({
    userEmail: userEmail,
    title: title,
    description: description,
  });

  res.status(200).json({ message: `job ${title} created` });
  client.close();
}

export default handler;
