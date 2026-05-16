'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, CheckCircle, Clock, Smartphone, Wallet, CreditCard } from 'lucide-react';

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
      { id: 101, student_id: 4, items: 'Veg Biryani (1)', total_amount: 60, order_status: 'pending', pickup_code: 'A1B2', payment_method: 'wallet' },
      { id: 102, student_id: 2, items: 'Cold Coffee (2)', total_amount: 90, order_status: 'pending', pickup_code: 'C9Z4', payment_method: 'upi' }
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
            <div key={o.id} className="p-4 bg-black/40 rounded-xl mb-3 border border-white/5 group hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-slate-200">Order #{o.id} • {o.pickup_code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  o.order_status === 'pending' ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300'
                }`}>
                  {o.order_status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3 font-medium">{o.items}</p>
              
              <div className="flex items-center justify-between mb-4 bg-white/5 p-2 rounded-lg border border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                  {o.payment_method === 'wallet' ? <Wallet size={12} className="text-indigo-400" /> : 
                   o.payment_method === 'upi' ? <Smartphone size={12} className="text-emerald-400" /> : 
                   <CreditCard size={12} className="text-amber-400" />}
                  <span>{o.payment_method}</span>
                </div>
                <span className="text-xs font-bold text-white">₹{o.total_amount}</span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => updateOrder(o.id, 'preparing')} className="grow px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg text-[10px] font-black transition-all">PREP</button>
                <button onClick={() => updateOrder(o.id, 'ready')} className="grow px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-lg text-[10px] font-black transition-all">READY</button>
                <button onClick={() => updateOrder(o.id, 'completed')} className="grow px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-lg text-[10px] font-black transition-all">DONE</button>
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
