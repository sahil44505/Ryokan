import Reccomendation from "./Reccomendation";

import getCurrentUser from "../actions/getCurrentUser";
const page = async() => {
  const user = await getCurrentUser()
  const userId = user?.id
  return (
    <div className="mt-24">
      <Reccomendation userId={userId}/>
    </div>
  );
}

export default page;
