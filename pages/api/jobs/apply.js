import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const client = await connectToDatabase();

  const result = await client.db().collection("applicants").insertOne({
    jobId: req.body.jobId,
    fullName: req.body.fullName,
    coverLetter: req.body.coverLetter,
  });

  console.log(result);

  res.status(200).json({ message: `aplication sent` });
  client.close();
}

export default handler;
