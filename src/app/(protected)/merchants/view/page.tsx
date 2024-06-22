"use client";

import { useAuth } from "../../../../hooks/useAuth";
import { useLogout } from "../../../../hooks/useLogout";

export default function DashboardPage() {
  const authenticated = useAuth();
  const logout = useLogout();

  if (!authenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Merchants</h1>
      <p>Manage merchants</p>
    </div>
  );
}