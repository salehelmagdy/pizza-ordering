"use client";
import Right from "@/components/icons/Right";
import UserTaps from "@/components/layout/UserTaps";
import { UseProfile } from "@/components/UseProfile";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const { loading, data } = UseProfile();

  useEffect(() => {
    fetch("api/menu-items").then((res) => {
      res.json().then((menuItems) => {
        setMenuItems(menuItems);
      });
    });
  });

  if (loading) {
    return "Loading user info...";
  }

  if (!data.admin) {
    return "Not an admin.";
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTaps isAdmin={true} />
      <div className="mt-8">
        <Link className="button flex" href={"/menu-items/new"}>
          <span>Create new menu item</span>
          <Right />
        </Link>
      </div>
      <div>
        <h1 className="text-sm text-gray-500 mt-8">Edit menu item:</h1>
        <div className="grid grid-cols-3 gap-2">
          {menuItems.length > 0 &&
            menuItems.map((item) => (
              <Link
                href={"/menu-items/edit/" + item._id}
                className="bg-gray-200 rounded-lg p-4"
                key={item._id}
              >
                <div className="relative">
                  <Image
                    className="rounded-md"
                    src={item.image}
                    width={200}
                    height={200}
                    alt="menu_item_image"
                  />
                </div>
                <div className="text-center">{item.name}</div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
