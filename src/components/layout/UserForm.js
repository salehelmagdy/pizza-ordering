"use client";
import AddressInputs from "@/components/layout/AddressInputs";
import EditableImage from "@/components/layout/EditableImage";
import { UseProfile } from "@/components/UseProfile";
import { useState } from "react";
export default function UserForm({ user, onSave }) {
  console.log(user);
  const [userName, setUserName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [city, setCity] = useState(user?.city || "");
  const [country, setCountry] = useState(user?.country || "");
  const [admin, setAdmin] = useState(user?.admin || false);
  const { data: loggedInUserData } = UseProfile();

  function handleAddressChange(propName, value) {
    if (propName === "phone") {
      setPhone(value);
    }
    if (propName === "streetAddress") {
      setStreetAddress(value);
    }
    if (propName === "postalCode") {
      setPostalCode(value);
    }
    if (propName === "city") {
      setCity(value);
    }
    if (propName === "country") {
      setCountry(value);
    }
  }
  return (
    <>
      <div className="md:flex gap-4">
        <div>
          <div className="p-2 rounded-lg relative max-w-[120px]">
            <EditableImage link={image} setLink={setImage} />
          </div>
        </div>
        <form
          onSubmit={(e) => {
            onSave(e, {
              name: userName,
              image,
              phone,
              streetAddress,
              city,
              country,
              postalCode,
              admin,
            });
          }}
          className="grow "
        >
          <label>First and last name </label>
          <input
            type="text"
            placeholder="First and last name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <label>Email</label>
          <input type="email" disabled={true} value={user?.email} />

          <AddressInputs
            addressProps={{ phone, streetAddress, city, postalCode, country }}
            setAddressProp={handleAddressChange}
          />
          {loggedInUserData.admin && (
            <div>
              <label
                htmlFor="adminCb"
                className="p-2 inline-flex items-center gap-2  mb-2 "
              >
                <input
                  type="checkbox"
                  id="adminCb"
                  value={"1"}
                  checked={admin}
                  onChange={(e) => setAdmin(e.target.checked)}
                />
                <span>Admin</span>
              </label>
            </div>
          )}
          <button type="submit">Save</button>
        </form>
      </div>
    </>
  );
}
