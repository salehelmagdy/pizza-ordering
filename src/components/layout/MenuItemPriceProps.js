import Trash from "@/components/icons/Trash";
import Plus from "@/components/icons/Plus";
import CheveronDown from "@/components/icons/ChevronDown";
import CheveronUp from "@/components/icons/ChevronUp";
import { useState } from "react";
export default function MenuItemPriceProps({
  name,
  addLabel,
  props,
  setProps,
}) {
  const [isOpen, setIsOpen] = useState(false);

  function addProp() {
    setProps((oldSizes) => {
      return [...oldSizes, { name: "", price: 0 }];
    });
  }

  function editProp(e, index, prop) {
    const newValue = e.target.value;
    setProps((prevSizes) => {
      const newSizes = [...prevSizes];
      newSizes[index][prop] = newValue;
      return newValue;
    });
  }

  function removeProp(indexToRemove) {
    setProps((prev) => prev.filter((v, i) => i !== indexToRemove));
  }
  return (
    <div className="bg-gray-200 rounded-md mb-2 p-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex p-1 border-0 justify-start"
        type="button"
      >
        {isOpen ? <CheveronUp /> : <CheveronDown />}

        <span>{name}</span>
        <span>({props?.length})</span>
      </button>
      <div className={isOpen ? "block" : "hidden"}>
        {props?.length > 0 &&
          props.map((size, index) => (
            <div key={index} className="flex items-end gap-2">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Size name"
                  value={size.name}
                  onChange={(e) => editProp(e, index, "name")}
                />
              </div>
              <div>
                <label>Extra price</label>
                <input
                  type="text"
                  placeholder="Extra price"
                  value={size.price}
                  onChange={(e) => editProp(e, index, "price")}
                />
              </div>
              <div>
                <button
                  type="button"
                  className="bg-white mb-2 px-2"
                  onClick={() => {
                    removeProp(index);
                  }}
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}

        <button
          className=" bg-white items-center"
          type="button"
          onClick={addProp}
        >
          <Plus className="w-4 h-4" />

          <span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
}
