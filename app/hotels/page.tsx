
import Hotelfirst from "./Hotelfirst";
import { Suspense } from 'react'
export default function SearchResults() {
  return (
    <div className="mt-28">
      <Suspense fallback={<div>Loading hotels...</div>}>
        <Hotelfirst />
        </Suspense>
     
    </div>
  );
}
