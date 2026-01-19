"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function Admin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    guest_name: "",
    check_in: "",
    check_out: "",
    phone_number: "",
    room_name: "Double Room 01",
    room_no: "01",
    price: "",
    source: "Booking.com",
    country: "",
    passport_no: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("bookings").insert([formData]);
    if (error) alert(error.message);
    else {
      alert("සාර්ථකයි! (Added successfully)");
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Booking</h1>
        <Link href="/" className="text-gray-400 text-sm">
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Guest Name</label>
          <input
            required
            type="text"
            className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700"
            onChange={(e) =>
              setFormData({ ...formData, guest_name: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Check-In</label>
            <input
              required
              type="date"
              className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700"
              onChange={(e) =>
                setFormData({ ...formData, check_in: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Check-Out
            </label>
            <input
              required
              type="date"
              className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700"
              onChange={(e) =>
                setFormData({ ...formData, check_out: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Room Select
          </label>
          <select
            className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700"
            onChange={(e) => {
              const val = e.target.value;
              let rNo = "01";
              if (val.includes("02")) rNo = "02";
              if (val.includes("03")) rNo = "03";
              setFormData({ ...formData, room_name: val, room_no: rNo });
            }}
          >
            <option>Double Room 01</option>
            <option>Double Room 02</option>
            <option>Double Room 03</option>
            <option>Family Room</option>
            <option>Balcony 01</option>
            <option>Balcony 02</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Price (LKR)
          </label>
          <input
            required
            type="number"
            step="0.01"
            className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700"
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Guest Phone
          </label>
          <input
            type="text"
            className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700"
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Guest Country (රට)
            </label>
            <input
              type="text"
              placeholder="e.g. Russia"
              className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 text-white"
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Booking No
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 text-white"
              onChange={(e) =>
                setFormData({ ...formData, passport_no: e.target.value })
              }
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 p-4 rounded-2xl font-bold mt-4 shadow-lg shadow-blue-900"
        >
          Save Booking
        </button>
      </form>
    </main>
  );
}
