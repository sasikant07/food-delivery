import axios from "axios";
import { adminService } from "../main";
import toast from "react-hot-toast";

const AdminRestaurantCard = ({
  restaurant,
  onVerify,
}: {
  restaurant: any;
  onVerify: () => void;
}) => {
  const verify = async () => {
    try {
      await axios.patch(
        `${adminService}/api/v1/verify/restaurant/${restaurant._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("Restaurant verified successfully");
      onVerify();
    } catch (error) {
      console.log(error);
      toast.error("Failed to verify restaurant");
    }
  };
  return (
    <div className="rounded-xl bg-white p-4 shadow space-y-2">
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="text-lg font-bold">Restaurant Name: {restaurant.name}</h3>
      <p className="text-sm text-gray-500">Restaurant Phone: {restaurant.phone}</p>
      <p className="text-sm text-gray-500">Restaurant Address: {restaurant.autoLocation?.formattedAddress}</p>

      <button
        className="w-full rounded bg-green-500 py-2 text-white hover:bg-green-600"
        onClick={verify}
      >
        Verify Restaurant
      </button>
    </div>
  );
};

export default AdminRestaurantCard;
