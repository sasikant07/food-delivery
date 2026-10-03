import { useParams } from "react-router-dom";
import type { IMenuItem, IRestaurant } from "../types";
import { useEffect, useState } from "react";
import axios from "axios";
import { restaurantService } from "../main";
import RestaurantProfile from "../components/RestaurantProfile";
import MenuItems from "../components/MenuItems";

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${restaurantService}/api/restaurant/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setRestaurant(data || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const { data } = await axios.get(
        `${restaurantService}/api/item/all/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setMenuItems(data);
    } catch (error: any) {
      console.error("Error fetching menu items:", error.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRestaurant();
      fetchMenuItems();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500 text-lg">Loading restaurant...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500 text-lg">Restaurant not found.</p>
      </div>
    );
  }

  return <div className="min-h-screen bg-gray-50 px-4 py-6 space-y-6">
    <RestaurantProfile restaurant={restaurant} onUpdate={setRestaurant} isSeller={false} />
    <div className="rounded-xl bg-white shadow-sm p-4">
        <MenuItems items={menuItems} onItemsDelete={() => {}} isSeller={false} />
    </div>
  </div>;
};

export default RestaurantPage;
