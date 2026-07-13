"use client";
import StatisticsCards from "./components/Statistics";
import Jumbotron from "./components/Jumbotron";
import dynamic from "next/dynamic";
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

export default function Dashboard() {
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