import { useEffect, useState } from "react";
import { useAppData } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { riderService } from "../main";
import toast from "react-hot-toast";
import { BiUpload } from "react-icons/bi";

interface IRider {
  _id: string;
  phoneNumber: string;
  aadharNumber: string;
  drivingLicenseNumber: string;
  picture: string;
  isVerified: boolean;
  isAvailable: boolean;
}

const RiderDashboard = () => {
  const [profile, setProfile] = useState<IRider | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [aadharNumber, setAadharNumber] = useState<string>("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { user } = useAppData();
  const { socket } = useSocket();

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${riderService}/api/rider/myprofile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfile(data || null);
    } catch (error) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "rider") {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const toggleAvailability = async () => {
    if (!navigator.geolocation) {
      toast.error("Location access required");
      return;
    }

    setToggling(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await axios.patch(
          `${riderService}/api/rider/toggle`,
          {
            isAvailable: !profile?.isAvailable,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        toast.success(
          profile?.isAvailable ? "You are offline" : "You are online",
        );
        fetchProfile();
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setToggling(false);
      }
    });
  };

  const handleSubmit = async () => {
    if (!navigator.geolocation) {
      toast.error("Location access required");
      return;
    }

    setSubmitting(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const formData = new FormData();
      formData.append("aadharNumber", aadharNumber);
      formData.append("phoneNumber", phoneNumber);
      formData.append("drivingLicenseNumber", drivingLicenseNumber);
      formData.append("latitude", pos.coords.latitude.toString());
      formData.append("longitude", pos.coords.longitude.toString());
      if (image) {
        formData.append("file", image);
      }

      try {
        const { data } = await axios.post(
          `${riderService}/api/rider/new`,
          {
            formData,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        toast.success(data.message);
        fetchProfile();
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setSubmitting(false);
      }
    });
  };

  if (user?.role !== "rider") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        You are not registered as a rider
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        Loading rider details...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 px4 py-6">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-sm space-y-5">
          <h1 className="text-xl font-semibold text-gray-700">
            Add Your Profile
          </h1>
          <input
            type="number"
            className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
            placeholder="Aadhar Number"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
          />
          <input
            type="number"
            className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
            placeholder="Contact Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            type="text"
            className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
            placeholder="Driving License Number"
            value={drivingLicenseNumber}
            onChange={(e) => setDrivingLicenseNumber(e.target.value)}
          />
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm text-gray-600 hover:bg-gray-50">
            <BiUpload className="h-5 w-5 text-red-500" />
            {image ? image.name : "Upload your Image"}
            <input
              type="file"
              accept="image/*"
              hidden
              className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>
          <button
            className="w-full rounded-lg py-3 text-sm font-semibold text-white bg-[#E23744]"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Add Profile"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-md px-4 py-4">
        <div className="rounded-xl bg-white p-4 shadow space-y-3">
          <img
            src={profile.picture}
            alt="profile picture"
            className="mx-auto h-24 w-24 rounded-full object-cover"
          />
          <p className="text-center font-semibold ">{user?.name}</p>
          <p className="text-center text-sm text-gray-500">
            {profile.phoneNumber}
          </p>
          <div className="flex justify-center gap-2">
            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
              {profile.isVerified ? "Verified" : "Pending"}
            </span>

            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
              {profile.isAvailable ? "Online" : "Offline"}
            </span>
          </div>
          <div className="">
            <p className="text-blue-400">
              Please be within a 500 m radius of any restaurant (which we call a
              hotspot) before going online as a rider to receive orders.
            </p>
          </div>
          {profile.isVerified && (
            <button
              className={`w-full py-2 rounded-lg text-white font-semibold ${toggling ? "bg-gray-400" : profile.isAvailable ? "bg-gray-600" : "bg-[#E23744]"}`}
              onClick={toggleAvailability}
              disabled={toggling}
            >
              {toggling ? "Updating" : profile.isAvailable ? "Go Offline" : "Go Online"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
