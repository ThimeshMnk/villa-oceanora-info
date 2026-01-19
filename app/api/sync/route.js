import ical from 'node-ical';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  // 1. YOUR BOOKING.COM ICAL URL
  const ICAL_URL = 'PASTE_YOUR_BOOKING_COM_ICAL_LINK_HERE';

  try {
    const events = await ical.fromURL(ICAL_URL);
    const newBookings = [];

    for (let k in events) {
      if (events.hasOwnProperty(k)) {
        const ev = events[k];
        if (ev.type === 'VEVENT') {
          
          // Format dates to YYYY-MM-DD
          const startDate = new Date(ev.start).toISOString().split('T')[0];
          const endDate = new Date(ev.end).toISOString().split('T')[0];

          newBookings.push({
            sync_id: ev.uid, 
            guest_name: 'Booking.com අමුත්තෙක්', 
            check_in: startDate,
            check_out: endDate,
            source: 'Booking.com',
            room_name: 'Main Room', 
            room_no: '01',
            price: 0 
          });
        }
      }
    }

    // 2. Insert into Supabase (Upsert avoids duplicates using sync_id)
    const { data, error } = await supabase
      .from('bookings')
      .upsert(newBookings, { onConflict: 'sync_id' });

    if (error) throw error;

    return Response.json({ message: "Sync Successful", count: newBookings.length });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}