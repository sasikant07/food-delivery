import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import type { IRestaurant } from "../types";
import axios from "axios";
import { restaurantService } from "../main";

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

  return <div>Home</div>;
};

export default Home;
