import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useEffect, useState } from "react";
import type { IOrder } from "../types";
import axios from "axios";
import { restaurantService } from "../main";

const OrderPage = () => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const { socket } = useSocket();

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`${restaurantService}/api/order/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrder(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    const onOrderUpdate = () => {
      fetchOrder();
    };

    socket.on("order:update", onOrderUpdate);

    return () => {
      socket.off("order:update", onOrderUpdate);
    };
  }, [socket]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading Order...</p>;
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">No order found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold">Order #{order._id.slice(-6)}</h1>
      <div className="rounded-lg bg-blue-50 p-3 text-sm font-medium">
        Status: <span className="capitalize">{order.status.replaceAll("_", " ")}</span>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm space-y-2">
        <h2 className="font-semibold">Items</h2>
        {order.items.map((item, i) => (
          <div className="flex justify-between text-sm" key={i}>
            <span className="">
              {item.name} X {item.quantity}
            </span>
            <span className="">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm space-y-1">
        <h2 className="font-semibold">Delivery Address</h2>
        <p className="text-sm text-gray-600">
          {order.deliveryAddress.formattedAddress}
        </p>
        <p className="text-sm text-gray-600">
          Mobile: {order.deliveryAddress.mobile}
        </p>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm space-y-2">
        <div className="flex justify-between text-sm">
          <span className="">SubTotal</span>
          <span className="">₹{order.subTotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="">Delivery Fee</span>
          <span className="">₹{order.deliveryFee}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="">Platform Fee</span>
          <span className="">₹{order.platformFee}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="">Total</span>
          <span className="">₹{order.totalAmount}</span>
        </div>
        <p className="text-xs text-gray-500">Payment Method: {order.paymentMethod}</p>
        <p className="text-xs text-gray-500">Payment Status: {order.paymentStatus}</p>
      </div>
    </div>
  );
};

export default OrderPage;
