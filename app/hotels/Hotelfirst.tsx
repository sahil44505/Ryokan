// ✅ app/hotels/Hotelfirst.tsx
"use client";

import { useSearchParams } from "next/navigation";
import HotelSearchResults from "./HotelSearchResults";

export default function Hotelfirst() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  return (
    <div className="mt-1">
      <HotelSearchResults title={query} />
    </div>
  );
}
