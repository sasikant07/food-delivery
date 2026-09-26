import { useState } from "react";
import { useAppData } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { restaurantService } from "../main";
import { BiMapPin, BiUpload } from "react-icons/bi";

interface AddRestaurantProps {
  fetchMyRestaurant: () => Promise<void>;
}

const AddRestaurant = ({ fetchMyRestaurant }: AddRestaurantProps) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const {loadingLocation, location} = useAppData();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!name || !phone || !image || !location) {
            alert("Please fill all the fields");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("phone", phone);
        formData.append("file", image);
        formData.append("latitude", location.latitude.toString());
        formData.append("longitude", location.longitude.toString());
        formData.append("formattedAddress", location.formattedAddress);

        try {
            setSubmitting(true);
            await axios.post(`${restaurantService}/api/restaurant/new`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Restaurant created successfully!");
            await fetchMyRestaurant();
        } catch (error: any) {
            toast.error(error.response?.data?.message);
        } finally {
            setSubmitting(false);
        }
    }
  return (
    <div className="min-h-screen bg-gray-50 px4 py-6">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-sm space-y-5">
            <h1 className="text-xl font-semibold text-gray-700">Add Your Restaurant</h1>
            <input type="text" className="w-full rounded-lg border px-4 py-2 text-sm outline-none" placeholder="Restaurant name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="number" className="w-full rounded-lg border px-4 py-2 text-sm outline-none" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <textarea className="w-full rounded-lg border px-4 py-2 text-sm outline-none" placeholder="Restaurant Description" value={description} onChange={(e) => setDescription(e.target.value)} />
             <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm text-gray-600 hover:bg-gray-50">
                <BiUpload className="h-5 w-5 text-red-500" />
                {image ? image.name : "Upload Restaurant Image"}
                <input type="file" accept="image/*" hidden className="w-full rounded-lg border px-4 py-2 text-sm outline-none" onChange={(e) => setImage(e.target.files?.[0] || null)} />
             </label>
             <div className="flex items-start gap-3 rounded-lg border p-4">
                <BiMapPin className="mt-0.5 h-5 w-5 text-red-500" />
                <div className="text-sm">
                    {loadingLocation ? "Fetching your location..." : location?.formattedAddress || "Location not available"}
                </div>
             </div>
             <button className="w-full rounded-lg py-3 text-sm font-semibold text-white bg-[#E23744]" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Add Restaurant"}
             </button>
        </div>
    </div>
  )
}

export default AddRestaurant;