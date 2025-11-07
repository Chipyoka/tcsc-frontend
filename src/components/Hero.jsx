import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import Cleaning from '../assets/images/image_2.png';
import Tools from '../assets/images/image_3.png';

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
      md:h-[76dvh] overflow-hidden bg-[url('../assets/images/bg-hero-2.jpg')] bg-cover bg-bottom 
      bg-no-repeat flex flex-col md:flex-row items-center justify-between relative
    ">
      
      <div className="max-w-full md:max-w-[50%] space-y-4 md:space-y-8 px-6 py-12 md:px-10 z-10 relative">
        <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-white)]">
          Bulk Cleaning <span className="badge">Solutions</span> for Every Business.
        </h1>
        <button className="btn-primary-lg w-full md:w-fit" onClick={()=> {navigate(`/products/all`)}}>Get a Business Quote</button>
        {/* <button className="btn-primary-outlined-lg w-full md:w-fit" onClick={()=> {navigate(`/products/all`)}}>Get a Business Quote</button> */}
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
