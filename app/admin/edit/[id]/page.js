'use client';
import { useState, useEffect, React } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function EditBooking() {
  const router = useRouter();
  const params = useParams(); 
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    guest_name: "",
    check_in: "",
    check_out: "",
    phone_number: "",
    room_name: "",
    room_no: "",
    price: "",
    source: "Booking.com",
    country: "",
    passport_no: "",
  });

  useEffect(() => {
    async function fetchBooking() {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', params.id)
        .single();

      if (data) {
        setFormData(data);
        setLoading(false);
      } else {
        alert("Booking not found");
        router.push('/');
      }
    }
    fetchBooking();
  }, [params.id]);

const handleUpdate = async (e) => {
  e.preventDefault();

  const { id, created_at, ...updateData } = formData;

  const { error } = await supabase
    .from('bookings')
    .update(updateData) 
    .eq('id', params.id);

  if (error) {
    alert(error.message);
  } else {
    alert("දත්ත යාවත්කාලීන කරන ලදී! (Updated successfully)");
    router.push('/');
  }
};
  const handleDelete = async () => {
    if (confirm("මෙම වෙන්කිරීම ඉවත් කිරීමට ඔබට සහතිකද? (Are you sure you want to delete?)")) {
      const { error } = await supabase.from('bookings').delete().eq('id', params.id);
      if (!error) router.push('/');
    }
  };

  if (loading) return <div className="p-10 text-white bg-slate-900 min-h-screen">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Booking</h1>
          <button onClick={handleDelete} className="text-red-500 text-xs font-bold border border-red-500/30 px-3 py-1 rounded-lg">Delete</button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Guest Name</label>
            <input required type="text" value={formData.guest_name} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700" 
              onChange={e => setFormData({...formData, guest_name: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Check-In</label>
              <input required type="date" value={formData.check_in} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700" 
                onChange={e => setFormData({...formData, check_in: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Check-Out</label>
              <input required type="date" value={formData.check_out} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700" 
                onChange={e => setFormData({...formData, check_out: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Room Select</label>
            <select value={formData.room_name} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 text-white"
              onChange={(e) => {
                const val = e.target.value;
                let rNo = "01";
                if (val.includes("02")) rNo = "02";
                if (val.includes("03")) rNo = "03";
                setFormData({ ...formData, room_name: val, room_no: rNo });
              }}>
              <option>Double Room 01</option>
              <option>Double Room 02</option>
              <option>Double Room 03</option>
              <option>Family Room</option>
              <option>Balcony 01</option>
              <option>Balcony 02</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Price (LKR)</label>
            <input required type="number" value={formData.price} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700" 
              onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Guest Phone</label>
            <input type="text" value={formData.phone_number} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700" 
              onChange={e => setFormData({...formData, phone_number: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Guest Country</label>
              <input type="text" value={formData.country} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700" 
                onChange={e => setFormData({...formData, country: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Booking No</label>
              <input type="text" value={formData.passport_no} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700" 
                onChange={e => setFormData({...formData, passport_no: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-green-600 p-4 rounded-2xl font-bold mt-4 shadow-lg shadow-green-900">
            Save Changes
          </button>
          
          <button type="button" onClick={() => router.push('/')} className="w-full bg-slate-700 p-4 rounded-2xl font-bold">
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
}