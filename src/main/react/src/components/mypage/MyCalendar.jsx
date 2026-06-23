import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AxiosApi from "../../api/AxiosApi";
import dayjs from "dayjs";

const MyCalendar = () => {
  const [tickets, setTickets]   = useState([]);
  const [selected, setSelected] = useState(new Date());

  useEffect(() => {
    AxiosApi.getMyTickets()
      .then(({ data }) => setTickets(data.data ?? []))
      .catch(console.error);
  }, []);

  const reservedDates = new Set(tickets.map((t) => dayjs(t.eventDate).format("YYYY-MM-DD")));
  const selectedStr   = dayjs(selected).format("YYYY-MM-DD");
  const todayTickets  = tickets.filter((t) => dayjs(t.eventDate).format("YYYY-MM-DD") === selectedStr);

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    return reservedDates.has(dayjs(date).format("YYYY-MM-DD"))
      ? <div style={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6a5cff", display: "inline-block" }} />
        </div>
      : null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ background: "white", borderRadius: 20, border: "1px solid #e5e7eb", padding: 16, display: "inline-block" }}>
        <style>{`
          .react-calendar { border: none; font-family: "Pretendard", sans-serif; }
          .react-calendar__tile--active { background: #6a5cff !important; color: white !important; border-radius: 8px; }
          .react-calendar__tile:hover { background: #f1f0ff !important; border-radius: 8px; }
        `}</style>
        <Calendar onChange={setSelected} value={selected} tileContent={tileContent} locale="ko-KR" />
      </div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
          {dayjs(selected).format("YYYY년 MM월 DD일")} 예약
        </h3>
        {todayTickets.length === 0
          ? <p style={{ fontSize: 13, color: "#9ca3af" }}>예약된 일정이 없습니다.</p>
          : todayTickets.map((t) => (
              <div key={t.ticketId} style={{ display: "flex", alignItems: "center", gap: 12,
                                             padding: 14, background: "#f7f8fc", borderRadius: 14, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, background: "#f1f0ff", borderRadius: 10,
                               display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎟</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px" }}>{t.spotTitle}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                    {t.count}명 · {t.amount === 0 ? "무료" : `₩${t.amount?.toLocaleString()}`}
                  </p>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
};

export default MyCalendar;
