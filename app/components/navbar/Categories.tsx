"use client";

import { categories } from "@/app/constants/categories";
import { usePathname, useSearchParams } from "next/navigation";
import CategoryBox from "../CategoryBox";
import Container from "./Container";

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();

  const isMainPage = pathname === "/";

  if (!isMainPage) {
    return null;
  }
  return (
    <Container>
<<<<<<< HEAD
      <div className="flex flex-row items-center justify-between pt-4 overflow-x-auto mt-10 ">
=======
      <div className="flex flex-row items-center justify-between pt-4 overflow-x-auto ">
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={item.label === category}
          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;
