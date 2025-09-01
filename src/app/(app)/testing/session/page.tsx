"use client";
import { authClient } from "@/lib/auth-client";

/*
 ** sample code only
 */

export default function TestingPage() {
  // ito tatawagin para makuha yung session (info about currently logged in na user)
  const { data: session, isPending } = authClient.useSession();

  if (!session) {
    return <p>No session found. Please log in.</p>;
  }

  return (
    <div>
      {/*nasa loob ng session.user yung user info, nandon yung role, name, email, etc*/}
      {isPending ? (
        <p>Loading session...</p>
      ) : (
        <>
          <h1>Welcome {JSON.stringify(session.user.name)}</h1>
          <div className="mt-4 text-xl">{JSON.stringify(session.user)}</div>
        </>
      )}
    </div>
  );
}
