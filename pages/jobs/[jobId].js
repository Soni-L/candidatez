import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../lib/db";

export async function getServerSideProps(context) {
  const client = await connectToDatabase();
  const jobsCollection = await client.db().collection("jobs");

  const jobId = new ObjectId(context.params.jobId);
  const job = await jobsCollection.findOne({
    _id: jobId,
  });

  client.close();

  return {
    props: { job: JSON.stringify(job) },
  };
}

export default function JobApplicationPage({job}) {
  return (
    <div>
      {job && (
        <div style={{ display: "grid" }}>
          <div>{JSON.parse(job).title}</div>
          <div>{JSON.parse(job).description}</div>
        </div>
      )}
    </div>
  );
}
