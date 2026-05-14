'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, CheckCircle, Clock } from 'lucide-react';

export default function CanteenDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for token saving
    setItems([
      { id: 1, name: 'Veg Biryani', price: 60, is_available: true },
      { id: 2, name: 'Cold Coffee', price: 45, is_available: true }
    ]);
    setOrders([
      { id: 101, student_id: 4, items: '[{"name":"Veg Biryani","qty":1}]', total_amount: 60, order_status: 'pending', pickup_code: 'A1B2' }
    ]);
  }, []);

  const updateOrder = (id: number, status: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, order_status: status } : o));
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
        <Coffee /> Canteen Admin Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h2 className="text-lg font-bold mb-4">Live Order Queue</h2>
          {orders.map(o => (
            <div key={o.id} className="p-4 bg-black/40 rounded-xl mb-3 border border-white/5">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold">Order #{o.id} - {o.pickup_code}</span>
                <span className="text-emerald-400 font-bold uppercase">{o.order_status}</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">{o.items}</p>
              <div className="flex gap-2">
                <button onClick={() => updateOrder(o.id, 'preparing')} className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded text-xs font-bold">Prep</button>
                <button onClick={() => updateOrder(o.id, 'ready')} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs font-bold">Ready</button>
                <button onClick={() => updateOrder(o.id, 'completed')} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs font-bold">Complete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5">
          <h2 className="text-lg font-bold mb-4">Menu Manager</h2>
          {items.map(i => (
            <div key={i.id} className="p-3 bg-black/40 rounded-xl mb-2 flex justify-between items-center text-sm border border-white/5">
              <span>{i.name}</span>
              <span className="text-emerald-400 font-bold">₹{i.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
