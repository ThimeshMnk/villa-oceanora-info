'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, ArrowLeft, Receipt, Calendar, Tag, Edit3, Trash2 } from 'lucide-react'; // Added Trash2
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    setLoading(true);
    const { data } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false });
    setExpenses(data || []);
    setLoading(false);
  }

  // --- NEW: Delete Function ---
  async function handleDelete(id) {
    if (confirm("මෙම වියදම ඉවත් කිරීමට ඔබට සහතිකද? (Are you sure you want to delete this?)")) {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) alert(error.message);
      else {
        // Update local state so the item disappears immediately
        setExpenses(expenses.filter(e => e.id !== id));
      }
    }
  }

  const dailyTotals = expenses.reduce((acc, curr) => {
    const date = curr.expense_date;
    acc[date] = (acc[date] || 0) + parseFloat(curr.amount);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 pb-20 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header (Same as before) */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight italic">Villa Expenses</h1>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">වියදම් කළමනාකරණය</p>
          </div>
          <Link href="/expenses/add" className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/40 hover:scale-105 transition-all">
            <Plus size={24} strokeWidth={3} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-slate-500 font-bold">දත්ත ලබා ගනිමින්...</div>
        ) : (
          <div className="space-y-10">
            <AnimatePresence>
              {Object.keys(dailyTotals).map((date) => (
                <div key={date} className="space-y-4">
                  <div className="flex justify-between items-end border-b border-white/10 pb-2 px-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={14} />
                      <span className="text-xs font-black uppercase tracking-widest">{date}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">දවසේ මුළු වියදම</p>
                      <p className="text-lg font-black text-red-400">රු. {dailyTotals[date].toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {expenses.filter(e => e.expense_date === date).map((item) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={item.id} 
                        className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 flex justify-between items-center"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-800 p-3 rounded-2xl text-blue-400">
                            <Receipt size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-200">{item.description}</h4>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase mt-1">
                              <Tag size={10} /> {item.expense_type}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                           <p className="text-lg font-black text-white italic leading-none mb-2">රු. {parseFloat(item.amount).toLocaleString()}</p>
                           
                           {/* Action Buttons */}
                           <div className="flex gap-3 justify-end items-center">
                             <Link href={`/expenses/edit/${item.id}`} className="text-blue-500 p-1.5 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all">
                                <Edit3 size={14} />
                             </Link>
                             <button 
                               onClick={() => handleDelete(item.id)}
                               className="text-red-500 p-1.5 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-all"
                             >
                                <Trash2 size={14} />
                             </button>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}