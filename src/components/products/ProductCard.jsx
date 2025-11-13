import { ShoppingCart, Heart } from 'lucide-react';
import { getProductSlug } from "../../utils/getProductSlug";
import {useNavigate} from 'react-router-dom';
import L from '../../assets/images/default_product.png'
import {useNavStore} from '../../store/nav.store.js';

const ProductCard = ({ product }) => {

    const navigate = useNavigate();
    const {setProductId} = useNavStore();

    const handleRedirect = (name,id) =>{
        if(!name || !id) return;

  
        navigate(`/product/${getProductSlug(name)}`)
        setProductId(id);
    }
    return (
        <div 
        onClick={()=>{handleRedirect(product.name, product.id)}}
        className="h-[400px] w-[260px] flex flex-col group cursor-pointer">
            {/* Image container */}
            <div 
                
                className="relative border border-gray-200 rounded-lg h-[50%] overflow-hidden flex items-center justify-center mb-4 bg-[var(--color-white)]"
            >
                <img
                    src={product.image || L}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-96 group-hover:scale-105"
                />

                {/* Overlay button on hover */}
                {/* <button className="absolute bottom-0 left-0 right-0 w-full py-3 bg-[var(--color-primary)] text-white font-medium opacity-0 translate-y-full transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    View Product
                </button> */}
            </div>

            {/* Product info */}
            <div className="h-[50%] flex flex-col justify-between gap-2">
                <div className="text-[var(--color-primary)]">
                    <h3 className="text-xl font-normal h-12 overflow-hidden mb-2">
                        {product.name}
                    </h3>
                    <p className="text-2xl font-bold mb-2">£{product.price.toFixed(2)}</p>
                </div>

                <div className="text-sm flex justify-between items-center">
                    <button className="btn-primary-sm flex gap-x-2 items-center">
                        {/* <ShoppingCart /> */}
                        {/* Add to Cart */}
                        View Product
                    </button>

                    <button className="text-[var(--color-primary)] mt-2 flex gap-x-2 items-center border-3 border-[var(--color-primary)] px-4 py-2 rounded-lg">
                        <Heart className="w-7 h-7" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
