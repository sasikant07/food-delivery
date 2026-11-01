import { useEffect, useState } from "react";
import axios from "axios";
import { adminService } from "../main";
import AdminRestaurantCard from "../components/AdminRestaurantCard";
import AdminRiderCard from "../components/AdminRiderCard";

const Admin = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [riders, setRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"restaurants" | "riders">("restaurants");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${adminService}/api/v1/admin/restaurant/pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const { data } = await axios.get(
        `${adminService}/api/v1/admin/rider/pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setRestaurants(response.data.restaurants);
      setRiders(data.riders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${tab === "restaurants" ? "bg-red-500 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("restaurants")}
        >
          Restaurants
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "riders" ? "bg-red-500 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("riders")}
        >
          Riders
        </button>
      </div>
      {tab === "restaurants" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurants.length === 0 ? (<p>No pending restaurants</p>) : restaurants.map((restaurant) => (
              <AdminRestaurantCard key={restaurant._id} restaurant={restaurant} onVerify={fetchData} />
            ))}
        </div>
      )}
      {tab === "riders" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {riders.length === 0 ? (<p>No pending riders</p>) : riders.map((rider) => (
                <AdminRiderCard key={rider._id} rider={rider} onVerify={fetchData} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
