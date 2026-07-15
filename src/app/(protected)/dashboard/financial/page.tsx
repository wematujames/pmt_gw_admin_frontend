"use client";
import StatisticsCards from "./components/Statistics";
import Jumbotron from "./components/Jumbotron";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsOverall } from "@/actions/summary";

// Tip: Consider renaming these files in your directory to "Graph"
const CollectionsGrapgh = dynamic(
  () => import("./components/CollectionsGrapgh"),
  { ssr: false }
);

const DisbursementsGrapgh = dynamic(
  () => import("./components/DisbursementsGrapgh"),
  { ssr: false }
);

export default function Dashboard() {
  const dashboardSummary = useQuery({
    queryKey: ["txns-overall"],
    queryFn: () => getTransactionsOverall(),
  });

  const isInitialLoad = dashboardSummary.isLoading;

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <Jumbotron />

      <StatisticsCards
        loading={isInitialLoad}
        summaryStats={dashboardSummary.data?.stats || {}}
      />

      <CollectionsGrapgh
        loading={isInitialLoad}
        collectionsSummary={dashboardSummary.data?.collectionSummary || []}
      />

      <DisbursementsGrapgh
        loading={isInitialLoad}
        disbursementsSummary={dashboardSummary.data?.disbursementSummary || []}
      />
    </div>
  );
}