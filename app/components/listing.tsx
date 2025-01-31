'use client'

const AddListing = () => {

  const handleAddListing = async () => {

    try {
      const listingData = {
        title: "Atlantis Paradise Island Bahamas",
        description: "Atlantis Paradise Island is an ocean-themed casino resort located on Paradise Island in the Bahamas. The resort spans 154-acre and includes a waterpark, marine habitat, and other recreational facilities",


        category: "Hotel",
        type: 'Pools',
        roomCount: 10,
        price: 180,
        currency: "US",
        amenities: [
          "Ocean-themed casino",
    "Waterpark",
    "Marine habitat",
    "Recreational facilities",
    "Multiple swimming pools",
    "Private beaches",
    "Luxury accommodations",
    "Fitness center",
    "Golf course",
    "Kids' club",
    "Shopping boutiques",
    "Live entertainment",
    "Nightlife venues",
    "Conference and event spaces",
    "Dolphin and marine animal encounters"
      
          
          
        ],
        gps_coordinates: {
          latitude:
            '25.083781899999998',
          longitude:
            '-77.321198'
        },
        imageSrc: "/images/z3.jpg",
        guestsCount: 12,
        bedrooms: 8,
        beds: 8,
        bathroomCount: 10
      };

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Listing created:", data);
        alert('Listing added successfully!');
      } else {
        console.error("Failed to add listing:", response.statusText);
        alert('Failed to add listing');
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert('An error occurred');
    }
  };

  return (
    <div>
      <button onClick={handleAddListing}>Add Listing</button>
    </div>
  );
};

export default AddListing;
