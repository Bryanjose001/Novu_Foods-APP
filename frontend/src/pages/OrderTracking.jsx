import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import LiveMap from '../components/LiveMap';

const STATUS_STEPS = [
  { key: 'preparing', label: 'Preparing' },
  { key: 'on_the_way', label: 'On the Way' },
  { key: 'delivered', label: 'Delivered' },
];

const statusIndex = (status) => {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
};

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
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
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-grey-full-light gap-3">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading your order…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-grey-full-light gap-4 p-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <p className="text-red-500 font-bold text-center">{error || 'Order not found'}</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const currentStep = isCancelled ? -1 : statusIndex(order.status);
  const isDelivered = order.status === 'delivered';

  return (
    <div className="bg-grey-full-light min-h-screen pb-24">

      {/* Live Map */}
      <div className="h-[42vh] min-h-[240px] w-full relative overflow-hidden bg-grey-light">
        <LiveMap deliveryAddress={order.delivery_address} status={order.status} />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md z-[1000] hover:bg-grey-light transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <Link
          to="/"
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md z-[1000] hover:bg-grey-light transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </Link>

        {/* Live badge */}
        {order.status === 'on_the_way' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-full px-3 py-1.5 shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
            <span className="text-xs font-bold text-blackc">Rider on the way</span>
          </div>
        )}
      </div>

      {/* Sheet */}
      <div className="-mt-6 relative z-10 bg-white rounded-t-3xl min-h-[60vh] p-6 shadow-[-4px_0_20px_rgba(0,0,0,0.07)]">
        <div className="w-10 h-1 bg-grey-light-dark rounded-full mx-auto mb-6"></div>

        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-blackc">
              {isDelivered ? 'Order Delivered!' : isCancelled ? 'Order Cancelled' : 'Order in Progress'}
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {isDelivered
                ? 'Enjoy your meal!'
                : isCancelled
                ? 'This order was cancelled.'
                : `Est. arrival: ${order.estimated_delivery || '25–35 min'}`}
            </p>
          </div>
          <span className="text-xs font-bold text-gray-400">
            #{String(order.id).slice(0, 8).toUpperCase()}
          </span>
        </div>

        {/* Progress steps */}
        {!isCancelled && (
          <div className="mb-8 px-2">
            <div className="flex items-center justify-between relative">
              {/* Track line */}
              <div className="absolute top-4 left-4 right-4 h-1 bg-grey-light-dark rounded-full z-0"></div>
              <div
                className="absolute top-4 left-4 h-1 bg-primary rounded-full z-0 transition-all duration-700"
                style={{ width: currentStep === 0 ? '0%' : currentStep === 1 ? '50%' : '100%' }}
              ></div>

              {STATUS_STEPS.map((step, index) => {
                const done = index < currentStep;
                const active = index === currentStep;
                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2
                      ${done ? 'bg-primary border-primary text-white' : active ? 'bg-white border-primary text-primary scale-110 shadow-md shadow-primary/30' : 'bg-white border-grey-light-dark text-gray-300'}`}>
                      {done ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : index + 1}
                    </div>
                    <span className={`text-[10px] font-bold mt-2 text-center w-20 ${active || done ? 'text-blackc' : 'text-gray-300'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-center">
            <p className="text-red-600 font-semibold text-sm">This order has been cancelled.</p>
          </div>
        )}

        {/* Delivery partner */}
        <div className="flex items-center py-4 border-t border-b border-grey-light-dark mb-6">
          <div className="w-11 h-11 gradient-primary rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-blackc text-sm">John Rider</h3>
            <p className="text-xs text-gray-400">Delivery Partner • ⭐ 4.9</p>
          </div>
          <div className="flex space-x-2">
            <button className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 hover:bg-primary/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.91 3.18 2 2 0 0 1 3.9 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </button>
            <button className="w-9 h-9 rounded-full bg-grey-light flex items-center justify-center border border-grey-light-dark hover:bg-grey-light-dark transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <h3 className="font-bold text-blackc mb-3 text-sm">Order Summary</h3>
          <div className="space-y-2">
            {(order.items || []).map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.quantity}× <span className="text-blackc font-medium">{item.item_name || item.name}</span></span>
                <span className="font-semibold text-blackc">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-grey-light-dark pt-3 mt-2 flex justify-between font-bold text-base">
              <span className="text-blackc">Total</span>
              <span className="text-primary">${parseFloat(order.total_amount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        {order.delivery_address && (
          <div className="mt-5 p-3 bg-grey-light rounded-xl flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p className="text-xs text-gray-600 leading-relaxed">{order.delivery_address}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
