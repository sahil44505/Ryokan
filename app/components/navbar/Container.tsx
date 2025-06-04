"use client";

interface ContainerProps{
    children: React.ReactNode
}
const Container :React.FC<ContainerProps>= ({
    children
}) => {
  return (
    <div className="max-w-[2520px] mx-auto
<<<<<<< HEAD
    xl:px-20 md:px-10 sm:px-2 px-4 ">
=======
    xl:px-20 md:px-10 sm:px-2 px-4">
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
      {children}
    </div>
  );
}

export default Container;
