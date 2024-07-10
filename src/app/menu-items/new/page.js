"use client";
import { UseProfile } from "@/components/UseProfile";
import { useState } from "react";
import UserTaps from "@/components/layout/UserTaps";
import EditableImage from "@/components/layout/EditableImage";
import toast from "react-hot-toast";
import Link from "next/link";
import Left from "@/components/icons/Left";
import { redirect } from "next/navigation";
import MenuItemForm from "@/components/layout/MenuItemForm";

export default function NewMenuItemPage() {
  const [redirectToItems, setRedirectToItems] = useState("");
  const { loading, data } = UseProfile();

  async function handleFormSubmit(e, data) {
    e.preventDefault();
    // const data = { image, name, description, basePrice };
    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        body: JSON.stringify({ data }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(savingPromise, {
      loading: "Saving this tasty item",
      success: "Saved",
      error: "Error",
    });

    setRedirectToItems(true);
  }

  if (redirectToItems) {
    return redirect("/menu-items");
  }

  if (loading) {
    return "Loading user info...";
  }

  if (!data.admin) {
    return "Not an admin.";
  }

  return (
    <section className="mt-8 ">
      <UserTaps isAdmin={true} />
      <div className="max-w-2xl mx-auto mt-8 ">
        <Link href={"/menu-items"} className="button">
          <Left />
          <span> Show all menu items</span>
        </Link>
      </div>
      <MenuItemForm onSubmit={handleFormSubmit} menuItem={null} />
    </section>
  );
}
