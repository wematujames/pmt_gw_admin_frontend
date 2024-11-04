"use client";
import StatisticsCards from "./components/Statistics";
import Jumbotron from "./components/Jumbotron";
import { useAuth } from "../../../../hooks/useAuth";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import PageLoader from "../../PageLoader";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsOverall } from "@/actions/summary";

const CollectionsGrapgh = dynamic(
  () => import("./components/CollectionsGrapgh"),
  { ssr: false }
);

const DisbursementsGrapgh = dynamic(
  () => import("./components/DisbursementsGrapgh"),
  { ssr: false }
);

function Dashboard() {
  const dashboardSummary = useQuery({
    queryKey: ["txns-overall"],
    queryFn: () => getTransactionsOverall(),
  });

  return (
    <>
      <Jumbotron />
      <StatisticsCards
        summaryStats={dashboardSummary.data?.stats || {}}
        loading={dashboardSummary.isLoading}
      />
      <CollectionsGrapgh
        loading={dashboardSummary.isFetching}
        collectionsSummary={dashboardSummary.data?.collectionSummary || {}}
      />
      <DisbursementsGrapgh
        loading={dashboardSummary.isLoading}
        disbursmentsSummary={dashboardSummary.data?.disbursementSummary || {}}
      />
    </>
  );
}

export default function DashboardSuspended() {
  const authenticated = useAuth("nerasol");

  if (!authenticated) return <PageLoader />;

  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}
