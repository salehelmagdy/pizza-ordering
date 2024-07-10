"use client";
import UserTaps from "@/components/layout/UserTaps";
import { UseProfile } from "@/components/UseProfile";
import UserForm from "@/components/layout/UserForm";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EditUserPage() {
  // const session = useSession();
  // console.log(session);
  // const { status } = session;

  const [user, setUser] = useState(null);
  const { loading, data } = UseProfile();
  const { id } = useParams();

  useEffect(() => {
    fetch("/api/profile?_id=" + id).then((response) =>
      response.json().then((user) => {
        setUser(user);
      })
    );
  }, []);

  async function handleProfileInfoUpdate(e, data) {
    e.preventDefault();

    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({
        //   name: userName,
        //   image,
        //   streetAddress,
        //   phone,
        //   postalCode,
        //   city,
        //   country,
        // }),
        body: JSON.stringify({ ...data, _id: id }),
      });
      if (response.ok) resolve();
      else reject();
    });

    await toast.promise(savingPromise, {
      loading: "Saving User...",
      success: "User saved!",
      error: "An error has occurred while saving the user",
    });
  }

  if (loading) {
    return "Loading user info...";
  }

  if (!data.admin) {
    return "Not an admin";
  }
  return (
    <div className="mt-8 mx-auto max-w-2xl">
      <UserTaps isAdmin={true} />
      <div className="mt-8">
        <UserForm user={user} onSave={handleProfileInfoUpdate} />
      </div>
    </div>
  );
}
