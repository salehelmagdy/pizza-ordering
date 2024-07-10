"use client";
import { UseProfile } from "@/components/UseProfile";
import { useEffect, useState } from "react";
import UserTaps from "@/components/layout/UserTaps";
import EditableImage from "@/components/layout/EditableImage";
import toast from "react-hot-toast";
import Link from "next/link";
import Left from "@/components/icons/Left";
import { redirect, useParams } from "next/navigation";
import MenuItemForm from "@/components/layout/MenuItemForm";
import DeleteButton from "@/components/DeleteButton";

export default function EditMenuItemPage() {
  const [menuItem, setMenuItem] = useState(null);
  const [redirectToItems, setRedirectToItems] = useState("");
  const { loading, data } = UseProfile();

  // const params = useParams();
  // console.log(params)

  const { id } = useParams();

  useEffect(() => {
    fetch("api/menu-items").then((res) =>
      res.json().then((items) => {
        const item = items.find((i) => i._id === id);
        setMenuItem(item);
      })
    );
  }, []);

  async function handleFormSubmit(e, data) {
    e.preventDefault();
    data = { ...data, _id: id };
    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/menu-items", {
        method: "PUT",
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

  async function handleDeleteClick() {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/menu-items?_id=" + id, {
        method: "DELETE",
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: "Deleting...",
      success: "Deleted",
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
    <section className="mt-8">
      <UserTaps isAdmin={true} />
      <div className="max-w-2xl mx-auto mt-8 ">
        <Link href={"/menu-items"} className="button">
          <Left />
          <span> Show all menu items</span>
        </Link>
      </div>
      <MenuItemForm onSubmit={handleFormSubmit} menuItem={menuItem} />
      <div className="max-w-md mx-auto mt-2 ">
        <div className="max-w-xs ml-auto pl-4">
          <DeleteButton
            label={"Delete this menu item"}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>
    </section>
  );
}
