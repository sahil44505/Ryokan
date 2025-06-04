<<<<<<< HEAD
"use client";

const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://static.tacdn.com/img2/branding/homepage/hotel-hero-default-4.jpg"
          alt="Hotel Hero"
          className="w-full h-full object-cover brightness-75"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/10 pointer-events-none"></div>

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 lg:p-16 text-white">
        {/* Top Content */}
        <div className="flex justify-between items-start mt-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-2xl">
            Discover Your Perfect Stay
          </h1>
        </div>

        {/* Bottom Content - Search Bar */}
        {/* <div className="relative mx-auto w-full max-w-4xl bg-white rounded-lg p-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Where are you going?"
              className="flex-1 p-3 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Search Hotels
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Hero;
=======

'use client'

const Hero = () => {
    return (<>
    <div className="h-10">Helo</div></>
        
//       <div className="relative w-full h-screen ">
//         {/* Background Video */}
//         {/* <video
//           autoPlay
//           loop
//           muted
//           playsInline
//           className="absolute top-0 left-0 w-full h-full object-cover"
//         >
//           <source src="/videos/stock-video.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//    */}
//         {/* Overlay for better readability (optional) */}
//         <div className="absolute inset-0 bg-black bg-opacity-20"></div>
  
//         {/* Text on Left and Right Corners */}
//         <div className="relative z-10 flex justify-between items-center w-full h-full px-12">
//           {/* Left Text - Ryokan */}
//           <h1 className="text-white text-6xl md:text-7xl font-bold">Ryokan</h1>
  
//           {/* Right Text - The right place for you */}
//           <p className="text-white text-2xl md:text-3xl font-semibold">
//             The right place for you
//           </p>
//         </div>
    //   </div>
    );
  };
  
  export default Hero;
>>>>>>> c1f6e38472162c852e5525e6a836b8248b68e0ca
