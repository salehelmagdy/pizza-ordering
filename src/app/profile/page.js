"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserTabs from "@/components/layout/UserTaps";
import UserForm from "@/components/layout/UserForm";

export default function ProfilePage() {
  const session = useSession();
  console.log(session);

  const { status } = session;
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile").then((response) =>
        response.json().then((data) => {
          setUser(data);
          setIsAdmin(data.admin);
          setProfileFetched(true);
        })
      );
    }
  }, [status, session]);

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
        body: JSON.stringify(data),
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(savingPromise, {
      loading: "Saving...",
      success: "Profile saved!",
      error: "Error",
    });
  }

  // async function handleFileChange(e) {
  //   const files = e.target.files;
  //   // console.log(files);
  //   if (files?.length === 1) {
  //     const data = new FormData();
  //     // console.log(data);
  //     data.set("files", files[0]);

  //     const uploadPromise = fetch("/api/upload", {
  //       method: "POST",
  //       body: data,
  //     }).then((response) => {
  //       if (response.ok) {
  //         return response.json().then((link) => {
  //           setImage(link);
  //         });
  //       }
  //       throw new Error("Something went wrong");
  //     });

  //     await toast.promise(uploadPromise, {
  //       loading: "Uploading...",
  //       success: "Uploading complete",
  //       error: "Upload error",
  //     });
  //   }
  // }

  if (status === "loading" || !profileFetched) {
    return "Loading...";
  }

  if (status === "unauthenticated") {
    return redirect("/login");
  }

  // console.log(userImage);
  return (
    <section className="mt-8">
      <UserTabs isAdmin={isAdmin} />
      <div className="mx-auto max-w-2xl mt-8">
        <UserForm user={user} onSave={handleProfileInfoUpdate} />
      </div>
    </section>
  );
}
