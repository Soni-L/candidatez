import React, { useEffect, useRef, useState } from "react";
import { useSession, getSession } from "next-auth/react";

async function createJob(title, description) {
  const response = await fetch("/api/jobs/create", {
    method: "POST",
    body: JSON.stringify({ title, description }),
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

export default function CreateJob() {
  const [isLoading, setIsLoading] = useState(true);
  const title = useRef();
  const description = useRef();

  async function submitHandler(event) {
    event.preventDefault();
    await createJob(title.current.value, description.current.value);
  }

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        window.location.href = "/auth";
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="title">Job Title</label>
        <input type="text" id="title" required ref={title} />
      </div>
      <div>
        <label htmlFor="description">Job description</label>
        <input type="text-area" id="description" required ref={description} />
      </div>
      <button type="button" onClick={submitHandler}>
        Create Job
      </button>
    </form>
  );
}
