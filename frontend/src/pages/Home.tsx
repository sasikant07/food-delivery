import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import type { IRestaurant } from "../types";
import axios from "axios";
import { restaurantService } from "../main";
import RestaurantCard from "../components/RestaurantCard";

const Home = () => {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const { location } = useAppData();
  const [ searchParams ] = useSearchParams();

  const search = searchParams.get("search") || "";

  //Haversine formula to calculate distance between two coordinates
  const getDistanceInKM = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return +(R * c).toFixed(2) as unknown as number; // Distance in kilometers
  };

  const fetchRestaurants = async () => {
    if (!location?.latitude || !location?.longitude) {
      // alert("Location permission is required.");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${restaurantService}/api/restaurant/all`,
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            search,
          },
          headers: {
            "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setRestaurants(data.restaurants ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [location, search]);

  if (loading || !location) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500">Finding restaurants near you...</p>
      </div>
    );
  }

  return <div className="mx-auto max-w-7xl px-4 py-6">
    {restaurants.length > 0 ? (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {restaurants.map((restaurant) => {
          const [resLng, resLat] = restaurant.autoLocation.coordinates;
          const distance = getDistanceInKM(
            location.latitude,
            location.longitude,
            resLat,
            resLng,
          );
          return <RestaurantCard key={restaurant._id} id={restaurant._id} name={restaurant.name} image={restaurant.image ?? ""} distance={`${distance}`} isOpen={restaurant.isOpen} />;
        })}
      </div>
    ) : (<div className="text-gray-500 text-center">No restaurants found.</div>)}
  </div>;
};

export default Home;
