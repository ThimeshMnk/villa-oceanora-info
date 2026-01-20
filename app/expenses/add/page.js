'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function AddExpense() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: '',
    expense_type: 'නඩත්තු (Maintenance)',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('expenses').insert([formData]);
    if (error) alert(error.message);
    else {
      alert("වියදම සාර්ථකව ඇතුළත් කළා!");
      router.push('/expenses');
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black">වියදම් ඇතුළත් කරන්න</h1>
          <Link href="/expenses" className="text-gray-400 text-sm italic underline">ලැයිස්තුවට යන්න</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-8 rounded-4xl border border-slate-700 shadow-2xl">
          <div>
            <label className="block text-xs text-blue-400 font-bold mb-2 uppercase tracking-widest">වියදම් විස්තරය (Description)</label>
            <input required type="text" placeholder="උදා: විදුලි බිල, පිරිසිදු කිරීම්" className="w-full bg-slate-900 p-4 rounded-2xl border border-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500" 
              onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs text-blue-400 font-bold mb-2 uppercase tracking-widest">වියදම් වර්ගය (Type)</label>
            <select className="w-full bg-slate-900 p-4 rounded-2xl border border-slate-700 text-white outline-none"
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
              <label className="block text-xs text-blue-400 font-bold mb-2 uppercase tracking-widest">මුදල (Amount)</label>
              <input required type="number" placeholder="රු." className="w-full bg-slate-900 p-4 rounded-2xl border border-slate-700 text-white outline-none" 
                onChange={e => setFormData({...formData, amount: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-blue-400 font-bold mb-2 uppercase tracking-widest">දිනය (Date)</label>
              <input required type="date" value={formData.expense_date} className="w-full bg-slate-900 p-4 rounded-2xl border border-slate-700 text-white outline-none" 
                onChange={e => setFormData({...formData, expense_date: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/50 transition-all">
            වියදම සේව් කරන්න (Save)
          </button>
        </form>
      </div>
    </main>
  );
}