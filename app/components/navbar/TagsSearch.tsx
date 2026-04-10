'use client';

import { useRouter } from "next/navigation";

const Search = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-full md:w-auto py-2">
      <div className="flex flex-row items-center gap-6 justify-between">
        
        {/* Nearby Search Option */}
        <div 
          className="text-base font-semibold text-slate-700 hover:text-blue-600 cursor-pointer hover:underline px-2 transition-colors"
          onClick={() => navigateTo('/nearby')}
        >
          Nearby Search
        </div>

        {/* Bookings Option */}
        <div 
          className="text-base font-semibold text-slate-700 hover:text-blue-600 cursor-pointer hover:underline px-2 transition-colors"
          onClick={() => navigateTo('/bookings')}
        >
          Bookings
        </div>

      </div>
    </div>
  );
}

export default Search;