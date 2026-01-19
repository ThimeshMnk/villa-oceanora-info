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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Edit3 } from "lucide-react";

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
    "Double Room 01": "සීයගේ කාමරය",
    "Double Room 03": "ගේ අතුලේ පොඩි කාමරය",
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
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

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await fetch("/api/sync");
    fetchBookings();
    setIsSyncing(false);
    alert("දත්ත අලුත් කරන ලදී! (Sync Complete)");
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={sliderImages[currentSlide]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40 backdrop-contrast-125" />
      </div>

      <div className="relative z-10 flex flex-col items-center pt-12 pb-20 px-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-black backdrop-blur-md p- rounded-full border border-white/30 shadow-2xl w-24 h-24 flex items-center justify-center">
                <img
                  src="/images/logo.png"
                  alt="Villa Oceanora Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">
            Villa Oceanora
          </h1>
          <p className="text-blue-100 font-medium tracking-[0.2em] uppercase text-xs mt-2 opacity-80">
            Luxury Management
          </p>

          <div className="flex justify-center gap-3 mt-4">
          <Link href="/admin" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/20 transition-all">
            <Plus size={14} /> අලුත් එකක් ඇතුලත් කරන්න (Add New)
          </Link>
        </div>
        </motion.div>
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-5 border border-white/20 shadow-2xl mb-8">
          <p className="text-[10px] font-bold text-white/60 mb-4 uppercase tracking-[0.2em] text-center">
            වෙන්කිරීම් සොයන්න (Search Bookings)
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {["today", "tomorrow", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-wider ${
                  filter === f
                    ? "bg-white text-blue-900 shadow-xl"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                {f === "today" ? "අද" : f === "tomorrow" ? "හෙට" : "සියල්ල"}
              </button>
            ))}

            {/* <button
              onClick={handleSync}
              disabled={isSyncing}
              className="mt-4 w-full bg-blue-600/20 border border-white/30 text-white py-3 rounded-2xl text-xs font-bold uppercase tracking-widest backdrop-blur-md"
            >
              {isSyncing
                ? "සමමුහුර්ත වෙමින්... (Syncing)"
                : "අලුත් දත්ත ලබාගන්න (Sync Booking.com)"}
            </button> */}
          </div>

          <div className="relative">
            <input
              type="date"
              onChange={(e) => {
                setCustomDate(e.target.value);
                setFilter("custom");
              }}
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-5 text-sm font-bold text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all cursor-pointer"
            />
            <CalIcon className="absolute right-5 top-4 text-white/50 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* BOOKING CARDS */}
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-between items-center px-4 mb-2">
            <h3 className="font-black text-white/80 uppercase text-[10px] tracking-[0.3em]">
              පැමිණීම් ලැයිස්තුව
            </h3>
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/10">
              {bookings.length} BOOKINGS
            </span>
          </div>

          <AnimatePresence>
            {loading ? (
              <div className="text-center py-20 text-white/50 font-bold animate-pulse">
                දත්ත ලබා ගනිමින්...
              </div>
            ) : (
              bookings.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={item.id}
                  className="bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white"
                >
                  <div className="p-7">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                          <User size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-slate-800 leading-tight tracking-tight">
                            {item.guest_name}
                          </h2>
                          <Link
                            href={`/admin/edit/${item.id}`}
                            className="text-[10px] text-blue-500 font-bold uppercase flex items-center gap-1 hover:underline"
                          >
                            <Edit3 size={10} /> සංස්කරණය කරන්න (Edit)
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            {/* Show Country if available */}
                            {item.country && (
                              <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                                🌍 {item.country}
                              </span>
                            )}
                            <div className="flex items-center gap-1.5 text-blue-600 text-[11px] font-black uppercase">
                              <RoomIcon size={14} /> {item.room_name}{" "}
                              {getSinhalaRoomName(item.room_name)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-100/50 rounded-3xl p-5 border border-slate-200/50 mb-6">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Check-In
                        </p>
                        <p className="text-sm font-black text-slate-700">
                          {item.check_in}
                        </p>
                      </div>
                      <div className="border-l border-slate-300 pl-5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Check-Out
                        </p>
                        <p className="text-sm font-black text-slate-700">
                          {item.check_out}
                        </p>
                      </div>
                      <div className="col-span-2 pt-3 border-t border-slate-200 border-dashed flex justify-between items-center">
                        <span className="text-[11px] font-black text-blue-700 flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full">
                          <CheckCircle2 size={14} /> දින{" "}
                          {calculateNights(item.check_in, item.check_out)} ක්
                          රැඳී සිටියි
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          මුළු මුදල
                        </p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">
                          <span className="text-sm font-bold mr-1 italic text-slate-400">
                            Rs.
                          </span>
                          {item.price?.toLocaleString()}
                        </p>
                      </div>
                      <a
                        href={`tel:${item.phone_number}`}
                        className="bg-slate-900 hover:bg-blue-700 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all active:scale-90"
                      >
                        <Phone size={24} fill="white" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {!loading && bookings.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-white/60 font-bold uppercase tracking-widest text-xs">
                දත්ත කිසිවක් හමු නොවීය
              </p>
            </motion.div>
          )}
        </div>

        <Link href="/admin">
      <motion.div 
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center border-2 border-white/20 shadow-blue-500/50"
      >
        <Plus size={32} strokeWidth={3} />
      </motion.div>
    </Link>
      </div>
    </main>
  );
}
