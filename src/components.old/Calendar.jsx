import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import itLocale from '@fullcalendar/core/locales/it';

export default function Calendar() {
  const [bookings, setBookings] = useState([]);
  const [courts, setCourts] = useState([]);

  const userId = "0ddd5775-5146-45c6-a4dd-858c0f742d24";
  const hours = [14, 15, 16, 17, 18, 19];
  const today = new Date();

  useEffect(() => {
    const fetchData = async () => {
      const { data: courtsData } = await supabase.from("courts").select("*");
      setCourts(courtsData || []);

      const { data: bookingsData } = await supabase.from("bookings").select("*");
      setBookings(bookingsData || []);
    };
    fetchData();
  }, []);

  // Eventi prenotati (rossi)
  const fcEvents = bookings.map((b) => ({
    id: b.id,
    title: `Campo ${b.court_id}`,
    start: new Date(b.start_time),
    end: new Date(b.end_time),
    backgroundColor: "#ff4d4d",
    borderColor: "#ff4d4d",
    textColor: "#fff",
  }));

  // Eventi liberi (verdi)
  const freeEvents = [];
  courts.forEach((court) => {
    hours.forEach((hour) => {
      const start = new Date(today);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(today);
      end.setHours(hour + 1, 0, 0, 0);

      const isBooked = bookings.some(
        (b) =>
          b.court_id === court.id &&
          new Date(b.start_time).getHours() === hour &&
          new Date(b.start_time).getDate() === today.getDate()
      );

      if (!isBooked) {
        freeEvents.push({
          id: `free-${court.id}-${hour}`,
          title: `Campo ${court.id} libero`,
          start,
          end,
          backgroundColor: "#4CAF50",
          borderColor: "#4CAF50",
          textColor: "#fff",
          extendedProps: { court_id: court.id },
        });
      }
    });
  });

  const handleEventClick = async (clickInfo) => {
    const { court_id } = clickInfo.event.extendedProps;
    if (!court_id) return;

    const start_time = clickInfo.event.start.toISOString();
    const end_time = clickInfo.event.end.toISOString();

    const { error } = await supabase.from("bookings").insert([
      {
        court_id,
        user_id: userId,
        start_time,
        end_time,
        status: "confirmed",
      },
    ]);

    if (!error) {
      alert(`Prenotazione confermata per Campo ${court_id}`);
      window.location.reload();
    } else {
      alert("Errore durante la prenotazione: " + error.message);
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek" // 📌 mostra subito la settimana
        locale={itLocale} // lingua italiana
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay", // consente switch mese/giorno/settimana
        }}
        events={[...fcEvents, ...freeEvents]}
        eventClick={handleEventClick}
        height="auto"
      />
    </div>
  );
}
