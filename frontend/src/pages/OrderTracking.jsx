import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/api';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderService.getById(orderId);
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-grey-full-light"><div className="animate-spin text-4xl">🥘</div></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-grey-full-light text-red-500">{error}</div>;

  const steps = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStep = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0;

  return (
    <div className="bg-grey-full-light min-h-screen pb-24">
      
      <div className="h-1/2 min-h-[40vh] bg-grey-light-dark w-full relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <span className="text-6xl block mb-2">🗺️</span>
            <span>Map View Placeholder</span>
          </div>
        </div>
        <Link to="/" className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md z-10">
          <span className="text-xl">🏠</span>
        </Link>
      </div>

      <div className="-mt-6 relative z-10 bg-white rounded-t-3xl min-h-[50vh] p-6 shadow-[-4px_0_10px_rgba(0,0,0,0.05)]">
        <div className="w-12 h-1.5 bg-grey-light-dark rounded-full mx-auto mb-6"></div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blackc mb-1">
            {order.status === 'Delivered' ? 'Order Delivered!' : `Estimated Arrival`}
          </h2>
          <p className="text-gray-500">
            {order.status === 'Delivered' ? 'Enjoy your meal!' : '25-30 Minutes'}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-grey-light -translate-y-1/2 z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, index) => {
              const isActive = index <= currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/40 scale-110' : 'bg-white border-2 border-grey-light-dark text-gray-300'}`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="absolute top-10 w-20 text-center">
                    <span className={`text-[10px] font-bold ${isActive ? 'text-blackc' : 'text-gray-300'}`}>
                      {step}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-grey-light-dark">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-grey-light rounded-full flex items-center justify-center text-xl mr-4">
              🛵
            </div>
            <div>
              <h3 className="font-bold text-blackc">John Rider</h3>
              <p className="text-xs text-gray-500">Delivery Partner</p>
            </div>
            <div className="ml-auto flex space-x-2">
              <button className="w-10 h-10 rounded-full bg-grey-light text-primary flex items-center justify-center border border-grey-light-dark">
                📞
              </button>
              <button className="w-10 h-10 rounded-full bg-grey-light text-gray-600 flex items-center justify-center border border-grey-light-dark">
                ✉️
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-bold text-blackc mb-2">Order Summary</h3>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.quantity}x {item.name}</span>
                <span className="font-medium text-blackc">${parseFloat(item.price).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-grey-light-dark pt-2 mt-2 flex justify-between font-bold">
              <span className="text-blackc">Total</span>
              <span className="text-blackc">${parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
