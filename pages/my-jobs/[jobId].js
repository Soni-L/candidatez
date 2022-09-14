import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../lib/db";

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const client = await connectToDatabase();

  const usersCollection = await client.db().collection("users");
  let user = await usersCollection.findOne({ email: session.user.email });

  if (!user) {
    client.close();
    return { props: {} };
  }

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

export default function JobApplicationPage({ job }) {
  console.log(job);
  return (
    <div>
      {job && (
        <>
          <div>{JSON.parse(job).title}</div>
          <div>{JSON.parse(job).description}</div>
        </>
      )}
    </div>
  );
}
