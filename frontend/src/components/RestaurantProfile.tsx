import { useState } from "react";
import type { IRestaurant } from "../types";
import { restaurantService } from "../main";
import axios from "axios";
import toast from "react-hot-toast";

interface RestaurantProfileProps {
  restaurant: IRestaurant;
  isSeller: boolean;
  onUpdate: (restaurant: IRestaurant) => void;
}

const RestaurantProfile = ({
  restaurant,
  isSeller,
  onUpdate
}: RestaurantProfileProps) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>(restaurant.name);
  const [description, setDescription] = useState<string>(
    restaurant.description || "",
  );
  const [phone, setPhone] = useState<string>(restaurant.phone.toString());
//   const [image, setImage] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(restaurant.isOpen);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleOpenStatus = async () => {
    try {
      const { data } = await axios.put(
        `${restaurantService}/api/restaurant/status`,
        {
          status: !isOpen,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success(data.message);
      setIsOpen(data.restaurant.isOpen);

    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  };

  const saveChanges = async () => {
    try {
        setLoading(true);
        const {data} = await axios.put(`${restaurantService}/api/restaurant/edit`, {
          name,
          description,
          phone,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        onUpdate(data.restaurant);
        toast.success(data.message);
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
  }

  return (
    <div className="mx-auto max-w-xl rounded-xl bg-white shadow-sm overflow-hidden">
      {restaurant.image && (
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-5 space-y-4">
        {isSeller && <div className="flex items-start justify-between">
            <div className="">
                {editMode ? (
                    <input type="text" className="w-full rounded border px-2 py-1 text-lg font-semibold" value={name} onChange={(e) => setName(e.target.value)} />
                ) : (
                    <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                )}
            </div>
          </div>}
      </div>
    </div>
  );
};

export default RestaurantProfile;
