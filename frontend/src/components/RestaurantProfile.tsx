import { useState } from "react";
import type { IRestaurant } from "../types";
import { restaurantService } from "../main";
import axios from "axios";
import toast from "react-hot-toast";
import { BiEdit, BiMapPin, BiSave } from "react-icons/bi";

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
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <BiMapPin className="h-4 w-4 text-red-500" />
                  {
                    restaurant.autoLocation.formattedAddress || "Location not set"
                  }
                </div>
            </div>
            <button className="text-gray-500 hover:text-black" onClick={() => setEditMode(!editMode)}>
                  <BiEdit size={18} />
            </button>
          </div>}
          {editMode ? (
            <textarea className="w-full rounded border px-3 py-2 text-sm" value={description} onChange={(e) => setDescription(e.target.value)} />
          ) : (
            <p className="text-gray-600 text-sm">{restaurant.description || "No description provided."}</p>
          )}
          <div className="flex items-center justify-between pt-3 border-t">
            <span className={`text-sm font-medium ${isOpen ? "text-green-600" : "text-red-500"}`}>
              {isOpen ? "Open" : "Closed"}
            </span>
            <div className="flex gap-3">
              {
                editMode && (
                  <button className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700" onClick={saveChanges} disabled={loading}>
                    <BiSave size={16} />
                    {loading ? "Saving..." : "Save"}
                  </button>
                )
              }
              {
                isSeller && (
                  <button className={`rounded-lg px-4 py-1.5 text-sm font-medium text-white ${isOpen ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`} onClick={toggleOpenStatus}>
                    {isOpen ? "Close Restaurant" : "Open Restaurant"}
                  </button>
                )
              }
            </div>
          </div>
          <p className="text-xs text-gray-400">Created on {new Date(restaurant.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default RestaurantProfile;
