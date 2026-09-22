import { useState } from "react";
import { useAppData } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../main";

type Role = "customer" | "rider" | "seller" | null;

const SelectRole = () => {
    const [role, setRole] = useState<Role>(null);
    const {setUser} = useAppData();
    const navigate = useNavigate();

    const roles: Role[] = ["customer", "rider", "seller"];

    const addRole = async () => {
        try {
            const {data} = await axios.put(`${authService}/api/auth/add/role`, {role}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }); 
            localStorage.setItem("token", data.token);
            setUser(data.user);
            navigate("/", { replace: true });
        } catch (error) {
            alert("Failed to add role. Please try again.");
            console.error("Error adding role:", error);
        }
    }
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm space-y-6">
            <h1 className="text-2xl font-bold text-center">Choose Your Role</h1>
            <div className="space-y-4">
                {roles.map((r) => (
                    <button
                        key={r}
                        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium capitalize trasition cursor-pointer ${role === r ? "border-[#E23744] bg-[#E23744] text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
                        onClick={() => {
                            setRole(r);
                        }}
                    >
                        Continue as {r}
                    </button>
                ))}
            </div>
            <button
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold capitalize transition cursor-pointer ${role ? "border-[#E23744] bg-[#E23744] text-white hover:bg[#d32f3a]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                onClick={addRole}
                disabled={!role}
            >
                Next
            </button>
        </div>
    </div>
  )
}

export default SelectRole;