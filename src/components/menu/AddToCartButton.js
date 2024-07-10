import FlyingButton from "react-flying-item";

export default function AddToCartButton({
  hasSizesOrExtras,
  onClick,
  basePrice,
  image,
}) {
  if (!hasSizesOrExtras) {
    return (
      <div className="flying-button-parent mt-4">
        <FlyingButton
          className="mt-4 bg-primary text-white rounded-full px-8 py-2"
          targetTop="5%"
          targetLeft="95%"
          src={image}
        >
          <div onClick={onclick}>Add to cart ${basePrice}</div>
        </FlyingButton>
      </div>
    );
  }
  return (
    <button
      onClick={onClick}
      className="bg-primary mt-4  text-white rounded-full px-8 py-2 cursor-pointer"
    >
      {hasSizesOrExtras && <span>Add to cart (From ${basePrice})</span>}
    </button>
  );
}
