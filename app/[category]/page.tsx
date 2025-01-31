'use client';
import axios from 'axios';
import {useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';




const CategoryPage = () => {
 
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchPlaces = async () => {
      if (category) {
        const result:any = await axios.get(`/api/getlistings?category=${category}`)
        console.log(result.data)
        
        setLocations(result.data) 
        setLoading(false)   
      }
      
      
    };
    
    fetchPlaces();
  }, [category]);

  return (
    <div className="container mx-auto p-4 top-36 absolute pl-48">
      <h1 className="text-3xl font-bold mb-4">Dynamic Data Display</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((item:any, index) => (
            <div key={index} className="relative group">
              <img
                src={item.imageSrc}
                alt={item.title}
                
                
                
              />
              <div className="mt-2">
                {/* <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-gray-600">Rating: {item.rating}</p> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
