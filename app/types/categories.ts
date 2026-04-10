import { IconType } from "react-icons";

export interface Category {
  label: string;
  icon: IconType;
  description?: string;
  selected?: boolean;
  kindKey?: string
  setNearby?: (data: any[]) => void;
}

export interface CountrySelectValue {
  flag: string;
  label: string;
  latlng: number[];
  region: string;
  value: string;
}
