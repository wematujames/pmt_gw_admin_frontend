"use client";

import { useAuth } from "../../hooks/useAuth";

export default function DashboardPage() {
  const authenticated = useAuth("nerasol");

  if (!authenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome User</h1>
      <p>This is your financial dashboard</p>
    </div>
  );
}
