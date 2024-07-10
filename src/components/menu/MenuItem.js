import { CartContext } from "@/components/AppContext";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/image";
import FlyingButton from "react-flying-item";
export default function MenuItem(menuItem) {
  const { image, name, description, basePrice, sizes, extraIngredientPrices } =
    menuItem;
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const { addToCart } = useContext(CartContext);

  async function handleAddToCartButtonClick() {
    console.log("add to cart");
    const hasOptions = sizes.length > 0 || extraIngredientPrices.length > 0;
    console.log(hasOptions);
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(menuItem, selectedSize, selectedExtras);

    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("hiding popup");

    setShowPopup(false);
  }

  function handleExtraThingClick(e, extraThing) {
    const checked = e.target.checked;
    if (checked) {
      setSelectedExtras((prev) => [...prev, extraThing]);
    } else {
      setSelectedExtras((prev) => {
        return prev.filter((e) => e.name !== extraThing.name);
      });
    }
  }

  let selectedPrice = basePrice;

  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }
  return (
    <>
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
          onClick={() => {
            setShowPopup(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="my-8 bg-white p-2 rounded-lg max-w-md"
          >
            <div
              className="overflow-y-scroll p-2"
              style={{ maxHeight: "calc(100vh - 100px)" }}
            >
              <Image
                src={image}
                className="mx-auto"
                alt={name}
                width={300}
                height={200}
              />
              <h2 className="text-lg bold text-center mb-2">{name}</h2>
              <p className="text-center text-gray-500 text-sm mb-2">
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="p-2">
                  <h3 className="text-center text-gray-700">Pick your size</h3>
                  {sizes.map((size) => {
                    <label
                      key={size._id}
                      className="flex items-center gap-2 p-4 border rounded-md mb-1"
                    >
                      <input
                        type="radio"
                        onChange={() => setSelectedSize(size)}
                        checked={selectedSize?.name === size.name}
                        name="size"
                      />
                      {size.name} ${basePrice + size.price}
                    </label>;
                  })}
                  {extraIngredientPrices?.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-center text-gray-700">Any extras?</h3>
                      {extraIngredientPrices.map((extraThing) => (
                        <label
                          key={extraThing._id}
                          className="flex items-center gap-2 p-4 border rounded-md mb-1"
                        >
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              handleExtraThingClick(e, extraThing)
                            }
                            checked={selectedExtras
                              .map((e) => e._id)
                              .includes(extraThing._id)}
                            name={extraThing.name}
                          />
                          {extraThing.name} ${extraThing.price}
                        </label>
                      ))}
                    </div>
                  )}
                  <FlyingButton targetTop="5%" targetLeft="95%" src={image}>
                    <div
                      className="primary sticky bottom-2"
                      onClick={handleAddToCartButtonClick}
                    >
                      Add to cart {selectedPrice}
                    </div>
                  </FlyingButton>
                  <button className="mt-2" onClick={() => setShowPopup(false)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <MenuItemTile onAddToCart={handleAddToCartButtonClick} {...menuItem} />
    </>
  );
}
