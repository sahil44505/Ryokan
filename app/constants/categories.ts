import { 
  TbBeach, TbMountain, TbPool, TbTrees, TbBuildingHospital, 
  TbTicket, TbGasStation, TbCoffee, TbIceCream 
} from "react-icons/tb";
import { 
  MdOutlineVilla, MdOutlineRestaurant, MdOutlineLocalMall, 
  MdOutlineDirectionsBus 
} from "react-icons/md";
import { 
  GiIsland, GiBoatFishing, GiCastle, GiForestCamp, 
  GiPopcorn, GiWeightLiftingUp 
} from "react-icons/gi";
import { FaSkiing, FaUmbrellaBeach, FaUniversity } from "react-icons/fa";

export const categories = [
  // --- STAYS ---
  { label: "Hotels", icon: MdOutlineVilla, kindKey: "accommodation.hotel,accommodation.resort" },
  { label: "Camping", icon: GiForestCamp, kindKey: "camping.camp_site" },

  // --- NATURE ---
  { label: "Beach", icon: TbBeach, kindKey: "beach" },
  { label: "Countryside", icon: TbMountain, kindKey: "natural.mountain,natural.forest" },
  { label: "Islands", icon: GiIsland, kindKey: "natural.island" },
  { label: "Lake", icon: GiBoatFishing, kindKey: "natural.water" },
  { label: "Parks", icon: TbTrees, kindKey: "leisure.park,leisure.garden" },

  // --- FOOD & DRINK ---
  { label: "Dining", icon: MdOutlineRestaurant, kindKey: "catering.restaurant" },
  { label: "Cafes", icon: TbCoffee, kindKey: "catering.cafe" },
  { label: "Dessert", icon: TbIceCream, kindKey: "catering.ice_cream" },

  // --- ACTIVITIES ---
  { label: "Pools", icon: TbPool, kindKey: "amenity.swimming_pool" },
  { label: "Skiing", icon: FaSkiing, kindKey: "sport.skiing" },
  { label: "Gyms", icon: GiWeightLiftingUp, kindKey: "sport.fitness" },
  { label: "Sights", icon: GiCastle, kindKey: "tourism.attraction,tourism.sights" },
  { label: "Movies", icon: GiPopcorn, kindKey: "entertainment.cinema" },

  // --- SHOPPING & SERVICES ---
  { label: "Shopping", icon: MdOutlineLocalMall, kindKey: "commercial.shopping_mall,commercial.supermarket" },
  { label: "Gas", icon: TbGasStation, kindKey: "service.vehicle.gas" },
  { label: "Transport", icon: MdOutlineDirectionsBus, kindKey: "public_transport" },

  // --- HEALTH & EDUCATION ---
  { label: "Health", icon: TbBuildingHospital, kindKey: "healthcare.hospital" },
  { label: "Education", icon: FaUniversity, kindKey: "education.university,education.library" },
];