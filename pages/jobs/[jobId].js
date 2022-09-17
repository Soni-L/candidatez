import React, { useEffect, useRef, useState } from "react";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../lib/db";
import { useRouter } from "next/router";

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

async function applyToJob(jobId, fullName, coverLetter) {
  const response = await fetch("/api/jobs/apply", {
    method: "POST",
    body: JSON.stringify({ jobId, fullName, coverLetter }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  // if (!response?.ok) {
  //   throw new Error(data.message || "Something went wrong!");
  // }

  return data;
}

export default function JobApplicationPage({ job }) {
  const router = useRouter();
  const fullName = useRef();
  const coverLetter = useRef();

  async function submitHandler(event) {
    event.preventDefault();
    await applyToJob(
      router.query.jobId,
      fullName.current.value,
      coverLetter.current.value,
    );
  }

  return (
    <div>
      {job && (
        <div style={{ display: "grid" }}>
          <div>{JSON.parse(job).title}</div>
          <div>{JSON.parse(job).description}</div>
        </div>
      )}

      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" required ref={fullName} />
        </div>
        <div>
          <label htmlFor="coverLetter">Cover Letter</label>
          <input type="text-area" id="coverLetter" required ref={coverLetter} />
        </div>
        <button type="button" onClick={submitHandler}>
          Send Application
        </button>
      </form>
    </div>
  );
}
