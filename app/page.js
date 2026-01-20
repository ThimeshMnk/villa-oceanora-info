"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Phone,
  Calendar as CalIcon,
  User,
  Home as RoomIcon,
  CheckCircle2,
  Plus,
  RefreshCw,
  Receipt,
  Edit3,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const sliderImages = [
  "/images/oceanora-1.webp",
  "/images/image-2.png",
  "/images/image-3.png",
  "/images/image-4.png",
  "/images/image-5.png",
];

const getSinhalaRoomName = (engName) => {
  const roomNames = {
    "Family Room": "පවුලේ කාමරය",
    "Balcony 01": "බැල්කනි 01",
    "Balcony 02": "බැල්කනි 02",
    "Double Room 01": "අංකල්ගේ කාමරය",
    "Double Room 02": "සීයගේ කාමරය",
    "Double Room 03": "ගේ අතුලේ පොඩි කාමරය",
  };
  const siName = roomNames[engName];
  return siName ? `(${siName})` : "";
};

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lkrRate, setLkrRate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchRate() {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();
        setLkrRate(data.rates.LKR);
      } catch (error) {
        setLkrRate(300);
      }
    }
    fetchRate();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [filter, customDate]);

  async function fetchBookings() {
    setLoading(true);
    let query = supabase
      .from("bookings")
      .select("*")
      .order("check_in", { ascending: true });
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0];
    if (filter === "today") query = query.eq("check_in", today);
    if (filter === "tomorrow") query = query.eq("check_in", tomorrow);
    if (filter === "custom" && customDate)
      query = query.eq("check_in", customDate);
    const { data } = await query;
    setBookings(data || []);
    setLoading(false);
  }

  const calculateNights = (inD, outD) => {
    const diff = Math.ceil(
      Math.abs(new Date(outD) - new Date(inD)) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  const totalUsdRevenue = bookings.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0),
    0,
  );
  const totalLkrRevenue = totalUsdRevenue * lkrRate;

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-slate-950">
      {/* BACKGROUND SLIDER */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={sliderImages[currentSlide]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50 backdrop-contrast-125" />
      </div>

      {/* REVENUE WIDGET (Top Right on Desktop) */}
      <div className="relative lg:absolute lg:top-8 lg:right-8 z-50 p-4 lg:p-0 w-full lg:w-auto flex justify-center lg:block">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-emerald-950/80 backdrop-blur-xl border border-emerald-500/40 rounded-[2rem] p-5 shadow-2xl min-w-[280px]"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-500/20 p-2 rounded-xl">
              <TrendingUp className="text-emerald-400 w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">
              මුළු ආදායම
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-2xl font-black text-white italic leading-none">
             

              <span className="text-[10px] mr-1">රු.</span>
              {totalLkrRevenue.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}

            </p>
            <p className="text-sm font-bold text-emerald-400 italic">
           <span className="text-xs text-emerald-500 mr-1">$</span>
              {totalUsdRevenue.toLocaleString()}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-emerald-500/20 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <RefreshCw
                size={10}
                className="text-emerald-500 animate-spin-slow"
              />
              <span className="text-[13px] text-emerald-500/70 font-bold uppercase tracking-tighter italic">
                Rate: {lkrRate.toFixed(2)}
              </span>
            </div>
            <span className="text-[13px] text-white/40 font-black">
              Total Bookings: {bookings.length}
            </span>
          </div>
        </motion.div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center pt-12 pb-24 px-4">
        {/* BRANDING */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-black/60 backdrop-blur-xl p-1 rounded-full border-2 border-white/30 shadow-2xl w-28 h-28 flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl italic">
            Villa Oceanora
          </h1>
          <p className="text-blue-200 font-bold tracking-[0.3em] uppercase text-[10px] mt-2 opacity-90 drop-shadow-md">
            Premium Management Dashboard
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/admin"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-[14px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-95"
            >
              <Plus size={18} strokeWidth={3} />
              <span>Add New Booking</span>
            </Link>
            <Link
              href="/expenses"
              className="bg-slate-900/90 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-2xl text-[14px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-95"
            >
              <Receipt size={18} />
              <span>වියදම් (Expenses)</span>
            </Link>
          </div>
        </motion.div>

        {/* SEARCH BOX */}
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/20 shadow-2xl mb-12">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {["today", "tomorrow", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-white text-slate-900 shadow-lg" : "bg-white/5 text-white border border-white/10"}`}
              >
                {f === "today" ? "අද" : f === "tomorrow" ? "හෙට" : "සියල්ල"}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="date"
              onChange={(e) => {
                setCustomDate(e.target.value);
                setFilter("custom");
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none"
              style={{ colorScheme: "dark" }}
            />
            <CalIcon
              className="absolute right-5 top-4 text-white/40 pointer-events-none"
              size={20}
            />
          </div>
        </div>

        {/* BOOKING GRID */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-6 mb-8 max-w-md mx-auto lg:max-w-none border-b border-white/5 pb-4 text-white/80">
            <h3 className="font-black uppercase text-[12px] tracking-[0.4em]">
              පැමිණීම් ලැයිස්තුව
            </h3>
            <span className="bg-white/20 text-[12px] font-black px-4 py-1.5 rounded-full border border-white/10">
              {bookings.length} BOOKINGS
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <AnimatePresence>
              {loading ? (
                <div className="text-center py-20 text-white/50 font-bold animate-pulse uppercase tracking-widest">
                  දත්ත ලබා ගනිමින්...
                </div>
              ) : (
                bookings.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={item.id}
                    className="bg-white/95 backdrop-blur-md rounded-[3rem] shadow-2xl overflow-hidden border border-white w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.33%-2rem)] max-w-md flex flex-col"
                  >
                    <div className="p-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-xl shadow-blue-200">
                            <User size={28} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-slate-800 leading-tight tracking-tight">
                              {item.guest_name}
                            </h2>
                            <Link
                              href={`/admin/edit/${item.id}`}
                              className="text-[11px] text-blue-600 font-extrabold uppercase flex items-center gap-1 hover:underline mt-1"
                            >
                              <Edit3 size={12} /> Edit සංස්කරණය
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-blue-600 text-[13px] font-black uppercase">
                          <RoomIcon size={16} /> {item.room_name}{" "}
                          <span className="text-blue-900 lowercase font-bold italic">
                            {getSinhalaRoomName(item.room_name)}
                          </span>
                        </div>
                        {item.country && (
                          <div className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-xl border border-slate-200">
                            🌍 {item.country}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-6 bg-slate-50 rounded-[2rem] p-6 border border-slate-100 mb-8 mt-auto">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Check-In
                          </p>
                          <p className="text-sm font-black text-slate-700">
                            {item.check_in}
                          </p>
                        </div>
                        <div className="border-l border-slate-200 pl-6">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Check-Out
                          </p>
                          <p className="text-sm font-black text-slate-700">
                            {item.check_out}
                          </p>
                        </div>
                        <div className="col-span-2 pt-3 border-t border-slate-200 border-dashed flex items-center gap-2 text-blue-700 font-bold text-[12px]">
                          <CheckCircle2 size={16} /> දින{" "}
                          {calculateNights(item.check_in, item.check_out)} ක්
                          රැඳී සිටියි
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-auto">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                              මුළු මුදල
                            </p>
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">
                              ${item.price}
                            </span>
                          </div>
                          <p className="text-4xl font-black text-slate-900 tracking-tighter">
                            <span className="text-sm font-bold mr-1 italic text-slate-400 text-[18px]">
                              රු.
                            </span>
                            {lkrRate > 0
                              ? (item.price * lkrRate).toLocaleString(
                                  undefined,
                                  { maximumFractionDigits: 0 },
                                )
                              : "..."}
                          </p>
                        </div>
                        <a
                          href={`tel:${item.phone_number}`}
                          className="bg-slate-900 hover:bg-blue-700 text-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all active:scale-90"
                        >
                          <Phone size={28} fill="currentColor" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
