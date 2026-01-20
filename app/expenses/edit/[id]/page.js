'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function EditExpense() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    expense_type: '',
    amount: '',
    expense_date: ''
  });

  useEffect(() => {
    async function fetchExpense() {
      const { data } = await supabase.from('expenses').select('*').eq('id', params.id).single();
      if (data) {
        setFormData(data);
        setLoading(false);
      }
    }
    fetchExpense();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Remove ID before updating
    const { id, created_at, ...updateData } = formData;

    const { error } = await supabase.from('expenses').update(updateData).eq('id', params.id);
    
    if (error) alert(error.message);
    else {
      alert("වියදම යාවත්කාලීන කළා!");
      router.push('/expenses');
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-black mb-8 text-center">වියදම සංස්කරණය කරන්න</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700">
          <div>
            <label className="block text-xs font-bold text-blue-400 uppercase mb-2">විස්තරය</label>
            <input required type="text" value={formData.description} className="w-full bg-slate-900 p-4 rounded-2xl border border-slate-700 text-white outline-none" 
              onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-blue-400 uppercase mb-2">වියදම් වර්ගය</label>
            <select value={formData.expense_type} className="w-full bg-slate-900 p-4 rounded-2xl border border-slate-700 text-white outline-none"
              onChange={e => setFormData({...formData, expense_type: e.target.value})}>
              <option>නඩත්තු (Maintenance)</option>
              <option>සේවක වැටුප් (Staff Salaries)</option>
              <option>බිල්පත් (Bills - Light/Water)</option>
              <option>කෑම බීම (Grocery/Food)</option>
              <option>වෙනත් (Other)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-blue-400 uppercase mb-2">මුදල</label>
              <input required type="number" value={formData.amount} className="w-full bg-slate-900 p-4 rounded-2xl border border-slate-700 text-white outline-none" 
                onChange={e => setFormData({...formData, amount: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-400 uppercase mb-2">දිනය</label>
              <input required type="date" value={formData.expense_date} className="w-full bg-slate-900 p-4 rounded-2xl border border-slate-700 text-white outline-none" 
                onChange={e => setFormData({...formData, expense_date: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 p-5 rounded-2xl font-black text-lg">Update Save (යාවත්කාලීන කරන්න)</button>
          <Link href="/expenses" className="block text-center text-gray-500 text-sm font-bold uppercase mt-4">අවලංගු කරන්න</Link>
        </form>
      </div>
    </main>
  );
}