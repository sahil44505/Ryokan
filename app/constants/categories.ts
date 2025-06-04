
import { FaSkiing } from "react-icons/fa";
import {

  GiBoatFishing,
 
<<<<<<< HEAD

=======
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
  GiIsland,
 
} from "react-icons/gi";

import { MdOutlineVilla } from "react-icons/md";
import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import { Category } from "../types/categories";

export const categories = [
  {
    label: "Beach",
    icon: TbBeach,
    description: "This property is close to the beach!",
  },
  {
    label: "Modern",
    icon: MdOutlineVilla,
    description: "This property is modern!",
  },
  {
    label: "Countryside",
    icon: TbMountain,
    description: "This property is in the countryside!",
  },
  {
    label: "Pools",
    icon: TbPool,
    description: "This property has a pool!",
  },
  {
    label: "Islands",
    icon: GiIsland,
    description: "This property is on an island!",
  },
  {
    label: "Lake",
    icon: GiBoatFishing,
    description: "This property is close to a lake!",
  },
  {
    label: "Skiing",
    icon: FaSkiing,
    description: "This property has skiing activies!",
  },
<<<<<<< HEAD
 
=======
  {
    label: "Castles",
    icon: GiCastle,
    description: "This property is in a castle!",
  },
  {
    label: "Camping",
    icon: GiForestCamp,
    description: "This property has camping activities!",
  },
  
  {
    label: "Cave",
    icon: GiCaveEntrance,
    description: "This property is in a cave!",
  },
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
  
] as Category[];
