import Bookings from "./Bookings";
import getCurrentUser from "../actions/getCurrentUser";

const Page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Login Required</h1>
          <p className="text-slate-500 mb-6">Please sign in to view your upcoming trips and bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">My Bookings</h1>
        <p className="text-slate-500 mt-2">Manage your upcoming stays and travel history.</p>
      </div>
      <Bookings />
    </div>
  );
}

export default Page;