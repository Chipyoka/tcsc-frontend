// src/store/checkout.store.js
import { create } from "zustand";

const useCheckoutStore = create((set) => ({
  shipping: null,
  paymentMethod: null,
  order: null, // store order summary or confirmation

  setShipping: (data) => set({ shipping: data }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setOrder: (order) => set({ order }),
  clearCheckout: () => set({ shipping: null, paymentMethod: null, order: null }),
}));

export default useCheckoutStore;
