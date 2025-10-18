import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import Cleaning from '../assets/images/cleaning.png';
import Tools from '../assets/images/tools.png';

const images = [Cleaning, Tools];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 10000); // change image every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header 
    className="
      h-fit
      md:h-[68dvh] overflow-hidden bg-[url('../assets/images/bg-hero-2.jpg')] bg-cover bg-bottom 
      bg-no-repeat flex flex-col md:flex-row items-center justify-between relative
    ">
      
      <div className="max-w-full md:max-w-[50%] space-y-4 px-6 py-12 md:px-10 z-10 relative">
        <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-white)]">
          Everything you <span className="badge">need</span> to maintain cleanliness.
        </h1>
        <button className="btn-primary-lg w-full md:w-fit" onClick={()=> {navigate(`/products/all`)}}>Explore Our Catalogue</button>
      </div>

      <div className="w-full md:w-[70%] h-[350px] md:h-[750px] relative">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Hero"
            className={`
              w-[1200px] h-auto object-contain absolute top-0 left-0 transition-opacity duration-5000 ease-in-out delay-200 rotate-y
              ${index === current ? "opacity-100" : "opacity-0"}
            `}
          />
        ))}
      </div>
    </header>
  );
};

export default Hero;
