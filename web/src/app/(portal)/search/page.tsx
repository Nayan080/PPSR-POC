import { Suspense } from "react";
import Screen from "./screen";

// Rendered client-side once the session is restored (see AppShell), so it opts out of
// instant-navigation validation, which needs a server-rendered page.
export const instant = false;

export default function Page() {
  return (
    <Suspense>
      <Screen />
    </Suspense>
  );
}
