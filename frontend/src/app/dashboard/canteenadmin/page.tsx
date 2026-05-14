'use client';

import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  LogOut, 
  CheckCircle2, 
  Search, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  UserCheck, 
  PlusCircle, 
  BellRing,
  ShoppingBag,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  getUsers, 
  saveUsers,
  getCurrentUser, 
  UserRecord, 
  createAlert 
} from '@/lib/store';
import { useWebSocket } from '@/components/WebSocketProvider';

export default function CanteenAdminDashboard() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ready' | 'preparing'>('all');
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  const { broadcastRefresh } = useWebSocket();

  const refreshData = () => {
    const u = getCurrentUser();
    if (u) setCurrent(u);
    setUsers(getUsers());
  };

  useEffect(() => {
    refreshData();
    // Refresh periodically or wait for web sockets
    const interval = setInterval(() => {
      setUsers(getUsers());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const allOrders = users.flatMap(u => 
    (u.canteenTransactions || [])
      .filter(t => t.type === 'debit' && t.orderNo)
      .map(tx => ({ student: u, tx }))
  ).reverse();

  const grossRevenue = allOrders.reduce((sum, o) => sum + o.tx.amount, 0);
  const readyCount = allOrders.filter(o => o.tx.pickupTime && o.tx.pickupTime.includes('Ready')).length;
  const pendingCount = allOrders.length - readyCount;

  const filteredOrders = allOrders.filter(o => {
    const matchesSearch = o.student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.tx.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.tx.orderNo && o.tx.orderNo.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (filterType === 'ready') return o.tx.pickupTime && o.tx.pickupTime.includes('Ready');
    if (filterType === 'preparing') return !o.tx.pickupTime || !o.tx.pickupTime.includes('Ready');
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#190019] text-[#FBE4D8] flex flex-col font-sans selection:bg-[#854F6C] selection:text-[#FFDFC3]">
      {/* Top Banner Navigation */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-bold shadow-lg shadow-emerald-500/10">
              <Coffee size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-emerald-400 uppercase font-mono">
                  Fulfillment Central
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  LIVE POS Node
                </span>
              </div>
              <h1 className="text-lg font-extrabold text-white tracking-tight">
                Canteen Administrator View
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-3 pl-4 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                <div className="text-right">
                  <span className="text-[10px] block text-slate-400 font-medium">{currentUser.name}</span>
                  <span className="text-[9px] block text-emerald-400 font-mono tracking-wider font-bold">Role: {currentUser.role.toUpperCase()}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase">
                  {currentUser.name.charAt(0)}
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer flex items-center gap-2"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="text-xs font-bold hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {notificationStatus && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="animate-spin text-emerald-400" />
              <span>{notificationStatus}</span>
            </div>
            <button onClick={() => setNotificationStatus(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Global Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden flex flex-col justify-between space-y-3 hover:border-emerald-500/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Transaction Vol</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp size={16} />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight">₹{grossRevenue}</span>
              <span className="text-[10px] text-emerald-400 block mt-1 font-mono">⚡ Real-time LAN stream synced</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden flex flex-col justify-between space-y-3 hover:border-cyan-500/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Received Orders</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <ShoppingBag size={16} />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight">{allOrders.length}</span>
              <span className="text-[10px] text-cyan-400 block mt-1 font-mono">Completed payment pre-orders</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden flex flex-col justify-between space-y-3 hover:border-amber-500/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preparing Queue</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock size={16} />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight">{pendingCount}</span>
              <span className="text-[10px] text-amber-400 block mt-1 font-mono">Awaiting fulfillment trigger</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden flex flex-col justify-between space-y-3 hover:border-blue-500/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ready for Dispatch</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight">{readyCount}</span>
              <span className="text-[10px] text-blue-400 block mt-1 font-mono">Notified via socket hub</span>
            </div>
          </div>
        </div>

        {/* Live Filter Strip & Search Panel */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Search size={16} className="text-slate-500 ml-2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by item, order hash, or student identity..."
              className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white text-xs mr-2">✕</button>
            )}
          </div>

          <div className="flex items-center gap-1.5 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 mr-2 shrink-0">Queue States:</span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterType === 'all' 
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/10' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              All Orders ({allOrders.length})
            </button>
            <button
              onClick={() => setFilterType('preparing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterType === 'preparing' 
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              Preparing ({pendingCount})
            </button>
            <button
              onClick={() => setFilterType('ready')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterType === 'ready' 
                  ? 'bg-blue-500 text-black shadow-md shadow-blue-500/10' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              Ready Queue ({readyCount})
            </button>
          </div>
        </div>

        {/* Live Orders Grid Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Zap size={16} className="text-emerald-400" />
              <span>Point-of-Sale Order Processing Stream</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">Showing {filteredOrders.length} items</span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-black/20 border border-white/5 text-center space-y-3">
              <Coffee size={32} className="mx-auto text-slate-600 animate-bounce" />
              <p className="text-xs text-slate-400 font-bold">No order transaction streams match your filter parameters.</p>
              <p className="text-[10px] text-slate-600 font-mono max-w-md mx-auto">
                Incoming debit requests submitted via the student viewport module will be caught via LAN WebSocket triggers and broadcast below instantaneously.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredOrders.map(({ student, tx }, idx) => {
                const isReady = tx.pickupTime && tx.pickupTime.includes('Ready');
                return (
                  <div 
                    key={`${tx.id}-${idx}`} 
                    className={`p-5 rounded-2xl bg-black/40 border transition-all space-y-4 relative flex flex-col justify-between ${
                      isReady 
                        ? 'border-blue-500/20 bg-gradient-to-b from-blue-500/[0.02] to-transparent' 
                        : 'border-white/5 hover:border-emerald-500/30'
                    }`}
                  >
                    {/* Status corner chip */}
                    <div className="absolute top-3 right-3">
                      {isReady ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                          Ready for Pickup
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          Preparing
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <span className="text-xs text-slate-400 font-mono block">Order ID: {tx.orderNo}</span>
                        <h3 className="text-base font-black text-white tracking-tight mt-0.5">{tx.item}</h3>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs">
                        <span className="text-slate-400">Price Charged:</span>
                        <span className="font-mono font-bold text-emerald-400">₹{tx.amount}</span>
                      </div>

                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-mono block font-bold">Ordered By:</span>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-200">{student.name}</span>
                          <span className="font-mono text-slate-400">{student.rollNo || 'ID: ' + student.id}</span>
                        </div>
                        {student.phone && (
                          <span className="text-[10px] text-slate-500 font-mono block">📞 {student.phone}</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock size={10} />
                        <span>{tx.date}</span>
                      </span>

                      {!isReady ? (
                        <button
                          type="button"
                          onClick={() => {
                            // Update transaction object to mark ready
                            const updatedUsers = users.map(u => {
                              if (u.id === student.id) {
                                const txs = (u.canteenTransactions || []).map(t => {
                                  if (t.id === tx.id) {
                                    return { ...t, pickupTime: 'Ready at Counter #2' };
                                  }
                                  return t;
                                });
                                return { ...u, canteenTransactions: txs };
                              }
                              return u;
                            });
                            
                            // Save payload
                            saveUsers(updatedUsers);
                            setUsers(updatedUsers);

                            // Push persistent WebSocket UI notification
                            createAlert(
                              student.id, 
                              'general', 
                              '🍔 Canteen Pre-Order Ready!', 
                              `Your ordered fulfillment item (${tx.item}, Order Hash #${tx.orderNo}) is packed and prepared for immediate turnaround at primary serving counter #2.`
                            );
                            
                            broadcastRefresh('REFRESH_ALERTS');
                            setNotificationStatus(`Successfully broadcast "Order Ready" ping to ${student.name}'s dynamic client tabs.`);
                            setTimeout(() => setNotificationStatus(null), 5000);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                        >
                          <BellRing size={12} />
                          <span>Trigger Ready Ping</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-blue-400 font-mono bg-blue-500/5 px-2 py-1 rounded">
                          ✓ Notification Dispatched
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
