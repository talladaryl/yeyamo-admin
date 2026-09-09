import { Suspense } from "react";
import { ExplorerPage } from "@/features/explorer/components/explorer-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ExplorerPage />
    </Suspense>
  );
}
