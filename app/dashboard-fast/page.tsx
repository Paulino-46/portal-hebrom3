﻿import DashboardContent from "./components/DashboardContent";

export default function DashboardPage({ searchParams }: { searchParams: { view?: string } }) {
  return <DashboardContent view={searchParams?.view} />;
}
