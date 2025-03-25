import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not signed in. Please sign in to view your profile.</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Your Profile</h1>
      <div style={{ marginBottom: "1rem" }}>
        <p>
          <strong>Username:</strong> {session.user.name}
        </p>
        <p>
          <strong>Email:</strong> {session.user.email}
        </p>
        {session.accessToken && (
          <p>
            <strong>Access Token:</strong> {session.accessToken}
          </p>
        )}
      </div>
      <button
        onClick={() => signOut()}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Sign out
      </button>
    </div>
  );
}
