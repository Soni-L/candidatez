import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../lib/db";
import { useEffect, useState } from "react";

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
  const [origin, setOrigin] = useState();

  useEffect(() => {
    setOrigin(window.origin);
  }, []);

  return (
    <div>
      {job && (
        <div style={{ display: "grid" }}>
          <div>{JSON.parse(job).title}</div>
          <div>{JSON.parse(job).description}</div>
          <a
            style={{ color: "blue" }}
            href={`/jobs/${JSON.parse(job)._id}`}
          >{`${origin}/jobs/${JSON.parse(job)._id}`}</a>
        </div>
      )}
    </div>
  );
}
