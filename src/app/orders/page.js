"use client";
import UserTaps from "@/components/layout/UserTaps";
import { UseProfile } from "@/components/UseProfile";
import { useEffect, useState } from "react";
import dbTimeForHuman from "@/libs/datetime";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const { loading, data: profile } = UseProfile();
  const [loadingOrders, setLoadingOrders] = useState(true);
  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch("/api/orders").then((res) =>
      res.json().then((orders) => setOrders(orders.reverse()))
    );
    setLoadingOrders(false);
  }

  console.log(orders);
  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTaps isAdmin={profile.admin} />
      <div className="mt-8">
        {loadingOrders && <div>Loading orders...</div>}
        {orders?.length > 0 &&
          orders.map((order) => (
            <div
              className="bg-gray-200 mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6"
              key={order._id}
            >
              <div className="grow flex flex-col md:flex-row items-center gap-6">
                <div>
                  <div
                    className={
                      (order.paid ? "bg-green-500 " : "bg-red-500 ") +
                      "p-2 rounded-md text-white w-24 text-center"
                    }
                  >
                    {order.paid ? "Paid" : "Not paid"}
                  </div>
                </div>
                <div className="grow">
                  <div className="flex gap-2 items-center mb-1">
                    <div className="grow">{order.userEmail}</div>
                    <div className="text-gray-500 text-sm">
                      {dbTimeForHuman(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {order.cartProducts.map((p) => p.name).join(", ")}
                  </div>
                </div>
              </div>
              <div className="justify-end flex gap-2 items-center whitespace-nowrap ">
                <Link className="button" href={"/orders/" + order._id}>
                  Show order
                </Link>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
