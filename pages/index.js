import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

async function fetchAllJobs() {
  const response = await fetch("/api/jobs/alljobs", {
    method: "GET",
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

export default function Home() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchAllJobs().then((jobs) => setJobs(jobs));
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Simple applicant tracking system</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "5px",
        }}
      >
        {jobs?.length &&
          jobs?.map((job) => (
            <div
              key={job._id}
              style={{ backgroundColor: "pink" }}
              onClick={() => router.replace(`/my-jobs/${job._id}`)}
            >
              {job.title}
            </div>
          ))}
      </div>

      <button
        style={{
          position: "fixed",
          margin: 0,
          padding: 0,
          fontSize: "50px",
          bottom: "50px",
          right: "20px",
          borderRadius: "50%",
          border: "1px solid black",
          height: "50px",
          width: "50px",
          backgroundColor: "green",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => router.replace("/create-job")}
      >
        +
      </button>
    </div>
  );
}
