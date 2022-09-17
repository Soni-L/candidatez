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
  const applicantsCollection = await client.db().collection("applicants");

  const jobId = new ObjectId(context.params.jobId);
  const job = await jobsCollection.findOne({
    _id: jobId,
  });

  const applicants = await applicantsCollection
    .find({
      jobId: context.params.jobId,
    })
    .toArray();

  client.close();

  return {
    props: { job: JSON.stringify(job), applicants: JSON.stringify(applicants) },
  };
}

export default function JobApplicationPage({ job, applicants }) {
  const [origin, setOrigin] = useState();

  useEffect(() => {
    setOrigin(window.origin);
  }, []);

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "60% auto", gap: "15px" }}
    >
      <div>
        {JSON.parse(applicants).map((applicant) => (
          <div
            key={applicant._id}
            style={{
              margin: "5px",
              padding: "5px",
              border: "1px solid black",
              borderRadius: "8px",
              boxShadow: "4px 4px lightgrey",
            }}
          >
            <p>Applicant Name: {applicant.fullName}</p>
            <p>Cover Letter: {applicant.coverLetter}</p>
          </div>
        ))}
      </div>

      {job && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "20% auto",
            maxWidth: "100%",
            backgroundColor: "lightgreen",
            padding: "5px",
            margin: "5px",
            borderRadius: "8px",
          }}
        >
          <p style={{ margin: 0 }}>
            <em>Job title</em>
          </p>
          <div>{JSON.parse(job).title}</div>

          <p style={{ margin: 0 }}>
            <em>Description</em>
          </p>
          <div>{JSON.parse(job).description}</div>

          <p style={{ margin: 0 }}>
            <em>Link</em>
          </p>
          <a
            style={{ color: "blue", lineBreak: "normal", fontSize: "14px" }}
            href={`/jobs/${JSON.parse(job)._id}`}
          >{`${origin}/jobs/${JSON.parse(job)._id}`}</a>
        </div>
      )}
    </div>
  );
}
