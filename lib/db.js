import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://sl828:pGzjQo0bi3WqFEF0@cluster0.n7jtn.mongodb.net/?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
    }
  );

  return client;
}
