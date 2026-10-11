import { useEffect, useState } from "react";
import { useAppData } from "../context/AppContext";
import axios from "axios";
import { restaurantService } from "../main";

interface IAddress {
  _id: string;
  formattedaddress: string;
  mobile: number;
}

const Checkout = () => {
  const [addressess, setAddressess] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [loadingRazorpay, setLoadingRazorPay] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [createOrder, setCreateOrder] = useState(false);
  const { cart, subTotal, quantity } = useAppData();

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!cart || cart.length === 0) {
        setLoadingAddress(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${restaurantService}/api/address/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setAddressess(data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchAddresses();

  }, [cart]);

  if (!cart || cart.length === 0) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
        </div>
      );
    }

  return <div>Checkout</div>;
};

export default Checkout;
