import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import React, { useEffect, useMemo, useState } from 'react';
import Hero from '../components/Hero';
import BestCategory from '../components/BestCategory';
import WhyUs from '../components/WhyUs';
import BestSelling from '../components/BestSelling';
import Starta from '../components/Starter';
import EcoFriendly from '../components/EcoFriendly';
import DiscountClub from '../components/DiscountClub';
import OurStory from '../components/OurStory';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

import {useReadyStore} from "../store/ready.store.js";
import axiosInstance from "../api/axiosInstance";

import { useProfileStore } from "../store/profile.store.js";



const Home = () => {

    const {bestSellersReady, startaParksReady} = useReadyStore();
      const {setIsDiscountMember} = useProfileStore()


  useEffect(() => {
    const fetchCatalog = async () => {
     try {
        const res = await axiosInstance.get('/memberships/me', {
          timeout: 15000,
        });

        console.log("[Home] Fetched user memberships: ", res.data);

        if (res.data.length > 0){
          console.log("[Home] Length is more than one");
          setIsDiscountMember(true);
        }
     } catch (error) {
        console.error("[HOME] Error loading user membership", error)
     }
    };

    fetchCatalog();
  }, []);





    // set window title
    window.document.title = "The Cleaning Supplies Co. | Smart solutions for everyday cleaning."


    return (
        <>
            <Topbar/>
            <Navbar/>
            <Hero/>
            <BestCategory/>
            <WhyUs/>
            {/* {bestSellersReady &&  <BestSelling/>}   */}
             <BestSelling/>
            {/* {startaParksReady &&   <Starta/>}   */}
           
            <DiscountClub/>
            <EcoFriendly/>
            <OurStory/>
            <Newsletter/>
            <Footer/>
            <ScrollToTop/>
        </>
    )
}

export default Home;
