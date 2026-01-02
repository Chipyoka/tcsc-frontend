import { ShoppingCart, Heart } from 'lucide-react';
import { getProductSlug } from "../../utils/getProductSlug";
import { useNavigate } from 'react-router-dom';
import L from '../../assets/images/default_product.png';
import { useNavStore } from '../../store/nav.store.js';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { setProductId } = useNavStore();

  // Primary image from media array
  const primaryImage = product.media?.[0]?.storage_path || L;

  // Display name
  const productName = product.name || "Unnamed Product";

  // Price — pick first active variant if exists
  const firstVariant = product.variants?.find(v => v.active) || product.variants?.[0];
  const productPrice = firstVariant ? firstVariant.price_amount / 100 : 0; // Assuming backend sends pence

  const handleRedirect = (name, id) => {
    if (!name || !id) return;

    navigate(`/product/${getProductSlug(name)}`);
    setProductId(id);
  };

  return (
    <div
      onClick={() => handleRedirect(productName, product.id)}
      className="h-[400px] w-[260px] flex flex-col group cursor-pointer"
    >
      {/* Image container */}
      <div className="relative border border-gray-200 rounded-lg h-[50%] overflow-hidden flex items-center justify-center mb-4 bg-[var(--color-white)]">
        <img
            src={primaryImage ? primaryImage.replace('/upload/', '/upload/f_auto,q_auto,w_400,h_400,c_fit/') : L}
            alt={productName}
            className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = L; }}
        />
        </div>

      {/* Product info */}
      <div className="h-[50%] flex flex-col justify-between gap-2">
        <div className="text-[var(--color-primary)]">
          <h3 className="text-xl font-normal h-12 overflow-hidden mb-2">
            {productName}
          </h3>
          <p className="text-2xl font-bold mb-2">£{productPrice.toFixed(2)}</p>
        </div>

        <div className="text-sm flex justify-between items-center">
          <button className="btn-primary-sm w-full ">
            View Product
          </button>

          {/* <button className="text-[var(--color-primary)] mt-2 flex gap-x-2 items-center border-3 border-[var(--color-primary)] px-4 py-2 rounded-lg">
            <Heart className="w-7 h-7" />
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
