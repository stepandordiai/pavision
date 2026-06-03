// "use client";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";

// export default function AppointmentCalendar() {

//   if (success) {
//     return (
//       <div className="apt-success">
//         <div className="apt-success__icon">
//           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//             <polyline points="20 6 9 17 4 12"/>
//           </svg>
//         </div>
//         <h2 className="apt-success__title">Consultation booked</h2>
//         <p className="apt-success__date">
//           {selectedDate?.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} at {selectedSlot}
//         </p>
//         <p className="apt-success__sub">We will contact you at <strong>{form.phone}</strong></p>
//         <button
//           className="apt-success__reset"
//           onClick={() => { setSuccess(false); setSelectedDate(null); setSelectedSlot(null); setForm(EMPTY_FORM); }}
//         >
//           Book another
//         </button>
//       </div>
//     );
//   }

//   return (

//   );
// }
