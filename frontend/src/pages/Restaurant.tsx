import { useEffect, useState } from "react";
import { type IMenuItem, type IRestaurant } from "../types";
import axios from "axios";
import { restaurantService } from "../main";
import AddRestaurant from "../components/AddRestaurant";
import RestaurantProfile from "../components/RestaurantProfile";
import MenuItems from "../components/MenuItems";
import AddMenuItem from "../components/AddMenuItem";

type SellerTab = "menu" | "add-item" | "sales";

const Restaurant = () => {
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [tab, setTab] = useState<SellerTab>("menu");
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);

    const fetchMyRestaurant = async () => {
        try {
            const {data} = await axios.get(`${restaurantService}/api/restaurant/my`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setRestaurant(data.restaurant || null);

            if (data.token) {
                localStorage.setItem("token", data.token);
                window.location.reload();
            }
        } catch (error) {
            console.error("Error fetching restaurant:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchMenuItems = async (restaurantId: string) => {
        try {
            const {data} = await axios.get(`${restaurantService}/api/item/all/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setMenuItems(data);
        } catch (error: any) {
            console.error("Error fetching menu items:", error.message);
        }
    };

    useEffect(() => {
        fetchMyRestaurant();
    }, []);

    useEffect(() => {
        if (restaurant) {
            fetchMenuItems(restaurant._id);
        }
    }, [restaurant]);

    if (loading) {
        return <div className="flex h-[60vh] items-center justify-center"><p className="text-gray-500 text-lg">Loading your restaurant...</p></div>;
    }

    if (!restaurant) {
        return <AddRestaurant fetchMyRestaurant={fetchMyRestaurant} />;
    }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 space-y-6">
      <RestaurantProfile restaurant={restaurant} onUpdate={setRestaurant} isSeller={true} />


      <div className="rounded-xl bg-white shadow-sm">
        <div className="flex border-b">
            {[
                {key: "menu", label: "Menu Items"},
                {key: "add-item", label: "Add Item"},
                {key: "sales", label: "Sales"},
            ].map((tabOption) => (
                <button
                    key={tabOption.key}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${tab === tabOption.key ? "border-b-2 border-red-500 text-red-500" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setTab(tabOption.key as SellerTab)}
                >
                    {tabOption.label}
                </button>
            ))}
        </div>
        <div className="p-5">
            {tab === "menu" && <MenuItems items={menuItems} onItemsChanged={() => fetchMenuItems(restaurant._id)} isSeller={true} />}
            {tab === "add-item" && <AddMenuItem onItemAdded={() => fetchMenuItems(restaurant._id)}/>}
            {tab === "sales" && <p>Sales Page</p>}
        </div>
      </div>
    </div>
  )
}

export default Restaurant;