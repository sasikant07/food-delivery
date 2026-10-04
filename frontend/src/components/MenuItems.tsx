import { useState } from "react";
import type { IMenuItem } from "../types";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { BiTrash } from "react-icons/bi";
import { BsCartPlus } from "react-icons/bs";
import { VscLoading } from "react-icons/vsc";
import axios from "axios";
import { restaurantService } from "../main";
import toast from "react-hot-toast";
import { useAppData } from "../context/AppContext";

interface MenuItemsProps {
  items: IMenuItem[];
  onItemsDelete: () => void;
  isSeller: boolean;
}

const MenuItems = ({ items, onItemsDelete, isSeller }: MenuItemsProps) => {
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
   const {fetchCart} = useAppData();

  const handleDeleteItem = async (itemId: string) => {
    const confirrmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirrmDelete) return;

    try {
      await axios.delete(`${restaurantService}/api/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Item deleted successfully");
      onItemsDelete();
    } catch (error: any) {
      console.error("Error deleting item:", error.message);
      toast.error(error.message || "Failed to delete item");
    }
  }

  const handleToggleAvailability = async (itemId: string) => {
    try {
      const {data} = await axios.put(`${restaurantService}/api/item/status/${itemId}`, {}, {
          headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success(data.message);
      onItemsDelete();
    } catch (error: any) {
      console.error("Error updating item availability:", error.message);
      toast.error(error.message || "Failed to update item status");
    }
  };

  const addTCart = async (restaurantId: string, itemId: string) => {
    try {
      setLoadingItemId(itemId);
      const {data} = await axios.post(`${restaurantService}/api/cart/add`, {
        restaurantId,
        itemId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success(data.message);
      fetchCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      console.error(error);      
    } finally {
      setLoadingItemId(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const isLoading = loadingItemId === item._id;
        return (
          <div
            key={item._id}
            className={`relative flex gap-4 rounded-lg bg-white p-4 shadow-sm transition ${!item.isAvailable ? "opacity-70" : ""}`}
          >
            <div className="relative shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className={`w-20 h-26 object-cover rounded ${!item.isAvailable ? "grayscale brightness-75" : ""}`}
              />
              {!item.isAvailable && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white">
                  Unavailable
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="">
                <h3 className="font-semibold">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">₹ {item.price}</p>
                {isSeller && (
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                      disabled={isLoading}
                      onClick={() => handleToggleAvailability(item._id)}
                    >
                      {isLoading ? <VscLoading className="animate-spin" size={18} /> : item.isAvailable ? (
                        <FiEye size={18} />
                      ) : (
                        <FiEyeOff size={18} />
                      )}
                    </button>
                    <button
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      <BiTrash size={18} />
                    </button>
                  </div>
                )}
                {!isSeller && (
                  <button
                    className={`flex items-center justify-center rounded-lg p-2 ${!item.isAvailable || isLoading ? "cursor-not-allowed text-gray-400" : "cursor-pointer bg-gray-200 text-red-500 hover:bg-red-50"}`}
                    disabled={!item.isAvailable || isLoading}
                    onClick={() => addTCart(item.restaurantId, item._id)}
                  >
                    {isLoading ? <VscLoading className="animate-spin" size={18} /> : <BsCartPlus size={18} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuItems;
