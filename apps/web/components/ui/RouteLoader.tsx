"use client";

import { usePathname, useSearchParams } from "next/navigation";
import SiteLoader from "@/components/ui/SiteLoader";

export default function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  return <SiteLoader key={routeKey} />;
}
