"use client";
import UserTaps from "@/components/layout/UserTaps";
import { useEffect, useState } from "react";
import { UseProfile } from "@/components/UseProfile";
import toast from "react-hot-toast";
import DeleteButton from "@/components/DeleteButton";
export default function CategoriesPage() {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const { loading: profileLoading, data: profileData } = UseProfile();

  function fetchCategories() {
    fetch("api/categories").then((res) =>
      res.json().then((categories) => setCategories(categories))
    );
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleNewCategory(e) {
    e.preventDefault();

    const creatingPromise = new Promise(async (resolve, reject) => {
      const data = { name: categoryName };

      if (editCategory) {
        data._id = editCategory._id;
      }
      const response = await fetch("/api/categories", {
        method: editCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setCategoryName("");
      fetchCategories();
      setEditCategory(null);
      if (response.ok) {
        resolve();
      } else reject();
    });
    await toast.promise(creatingPromise, {
      loading: editCategory
        ? "Updating category..."
        : "Creating your new category...",
      success: editCategory ? "Category updated" : "Category created",
      error: "Error, sorry...",
    });
  }

  async function handleDeleteClick(_id) {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/categories?_id=" + _id, {
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

    fetchCategories();
  }

  if (profileLoading) {
    return "Loading user info...";
  }

  if (!profileData.admin) {
    return "Not an admin";
  }
  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTaps isAdmin={true} />
      <form className="mt-8" onSubmit={handleNewCategory}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {editCategory ? "Update category" : "New category name"}
              {editCategory && (
                <>
                  : <b>{editCategory.name}</b>
                </>
              )}
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="pb-2 flex gap-2">
            <button className="border border-primary" type="submit">
              {editCategory ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditCategory(null);
                setCategoryName("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      <div>
        <h2 className="mt-8 text-sm text-gray-500">Existing categories</h2>
        {categories?.length > 0 &&
          categories.map((c) => (
            <div
              key={c._id}
              className="bg-gray-100 rounded-xl p-2 px-4 flex gap-1 mb-1 items-center"
            >
              <span className="grow hover:underline cursor-pointer">
                {c.name}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditCategory(c);
                    setCategoryName(c.name);
                  }}
                  type="button"
                >
                  Edit
                </button>
                <DeleteButton
                  label={"Delete"}
                  onDelete={() => handleDeleteClick(c._id)}
                />
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
