import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useCartStore } from "../Store/cartStore";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingCart } from 'lucide-react';


import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/Dialog';

// Removed: const TAX_RATE = 0.08; // Tax rate removed as per request

const CheckoutPage = () => {
  const { cartItems, totalItems, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // --- Calculations using useMemo for accuracy and performance ---
  // Subtotal directly from cartStore, with defensive check
  const subtotal = useMemo(() => {
    // Ensure totalPrice is a number before using it, if it's not managed in store, it would be 0
    return typeof totalPrice === 'number' ? totalPrice : 0;
  }, [totalPrice]);

  // Removed: taxAmount calculation

  // Fixed shipping cost
  const shippingCost = 5.00;

  const finalTotal = useMemo(() => {
    return subtotal + shippingCost;
  }, [subtotal, shippingCost]); // Ensure all dependencies are listed

  // --- Effect for redirection ---
  useEffect(() => {
    if (totalItems === 0 && !showSuccessDialog) {
      navigate('/CartPage');
    }
  }, [totalItems, navigate, showSuccessDialog]);

  // --- Callback for placing order ---
  const handlePlaceOrder = useCallback(async (e) => {
    e.preventDefault(); // Prevent default form submission

    setIsProcessing(true);
    // Simulate an API call for placing an order
    await new Promise(resolve => setTimeout(resolve, 2000));

    // After successful "order placement"
    clearCart(); // Clear the cart using the Zustand action
    setIsProcessing(false);
    setShowSuccessDialog(true);

    // Redirect to home page after a short delay
    setTimeout(() => {
      setShowSuccessDialog(false);
      navigate('/');
    }, 3000);
  }, [clearCart, navigate, setShowSuccessDialog]);

  // --- Callback for image error handling ---
  const handleImageError = useCallback((e) => {
    e.target.onerror = null; // Prevent infinite loop if placeholder also fails
    e.target.src = `https://placehold.co/64x64/cccccc/333333?text=No+Image`;
  }, []);

  if (totalItems === 0 && !showSuccessDialog) {
    return null;
  }

  return (
    // 'justify-start' aligns content to the left within the available horizontal space
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 font-inter flex justify-start">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 flex flex-col md:flex-row gap-10">

        {/* Left Column: Customer Details Form */}
        <div className="md:w-1/2 w-full space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-600 dark:text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span>Customer Details</span>
          </h2>

          {/* Form fields are naturally left-aligned due to 'block' labels and 'w-full' inputs */}
          <form className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">Full Name</label>
              <input type="text" id="fullName" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left" placeholder="John Doe" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">Email Address</label>
              <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left" placeholder="john.doe@example.com" required />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">Shipping Address</label>
              <input type="text" id="address" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left" placeholder="123 Main St" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">City</label>
                <input type="text" id="city" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left" placeholder="New York" required />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">Zip Code</label>
                <input type="text" id="zipCode" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left" placeholder="10001" required />
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary Section */}
        <div className="md:w-1/2 w-full space-y-6 text-gray-800 dark:text-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-3">
            <ShoppingCart size={28} className="text-blue-600 dark:text-blue-400" />
            <span>Order Summary</span>
          </h2>

          <div className="space-y-4">
            {cartItems.map((item) => {
              // Defensive checks for item.price and item.quantity
              const itemPrice = typeof item.price === 'number' ? item.price : 0;
              const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
              const itemTotal = itemPrice * itemQuantity;

              return (
                <div key={item.id} className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3"> {/* This div groups image and text, keeping them left-aligned */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-contain rounded-md flex-shrink-0" // flex-shrink-0 to prevent image shrinking
                      onError={handleImageError}
                    />
                    <div className="text-left"> {/* Ensures text inside this div is left-aligned */}
                      <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {itemQuantity}</p>
                      {/* If you had 'reviews' here, they would naturally align left with the existing text */}
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">${itemTotal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6 space-y-3">
            <div className="flex justify-between text-lg text-gray-700 dark:text-gray-300">
              <span>Subtotal:</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span> {/* Displays memoized subtotal */}
            </div>
            {/* Removed: Tax line item */}
            <div className="flex justify-between text-lg text-gray-700 dark:text-gray-300">
              <span>Shipping:</span>
              <span className="font-semibold">${shippingCost.toFixed(2)}</span> {/* Displays fixed shipping cost */}
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span> {/* Displays memoized finalTotal */}
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:from-green-700 hover:to-green-900 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center space-x-2 mt-6"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>Place Order</span>
            )}
          </button>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px] font-inter">
          <DialogHeader className="text-center">
            <CheckCircle size={60} className="text-green-500 mx-auto mb-4 animate-bounce" />
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Order Placed Successfully!</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
              Thank you for your purchase. You will be redirected to the home page shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate("/");
              }}
              className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md
                          hover:bg-blue-700 transition duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(CheckoutPage);
