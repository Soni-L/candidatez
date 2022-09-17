import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../lib/db";
import { useEffect, useState } from "react";

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const client = await connectToDatabase();

  const usersCollection = await client.db().collection("users");
  let user = await usersCollection.findOne({
    email: session.user.email,
  });

  if (!user) {
    client.close();
    return { props: {} };
  }

  client.close();

  return {
    props: {
      user: JSON.stringify(user),
    },
  };
}

export default function ProfilePage({ user }) {
  const [origin, setOrigin] = useState();

  useEffect(() => {
    setOrigin(window.origin);
  }, []);

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "60% auto", gap: "15px" }}
    >
      <div>
        <div>{JSON.parse(user)?.name}</div>
        <div>{JSON.parse(user).email}</div>
      </div>
    </div>
  );
}
