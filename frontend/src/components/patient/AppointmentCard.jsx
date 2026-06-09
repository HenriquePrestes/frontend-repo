import React from "react";

export default function AppointmentCard({ appointment, onCancel }) {
  const { id, date, time, name, specialty, crm, status } = appointment;
  const apptDate = new Date(date + "T00:00:00");
  const isFuture = apptDate >= new Date() && status !== "cancelada";
  const formattedDate = apptDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const statusColors = {
    agendada: "bg-emerald-100 text-emerald-800",
    realizada: "bg-slate-100 text-slate-700",
    cancelada: "bg-rose-100 text-rose-700",
  };

  return (
    <article
      className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg transition ${
        isFuture ? "bg-white hover:shadow-md" : "bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center justify-center min-w-[86px] text-center">
          <span className="text-sm font-medium">{formattedDate}</span>
          <span className="text-xs text-slate-500">{time}</span>
        </div>
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-slate-600">{specialty} • {crm}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 md:mt-0">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-slate-100 text-slate-700"}`}>
          {status}
        </span>
        {isFuture && status !== "cancelada" && (
          <button
            onClick={() => {
              if (confirm("Deseja realmente cancelar esta consulta?")) {
                onCancel(id);
              }
            }}
            className="px-3 py-2 bg-rose-500 text-white rounded-md text-sm hover:bg-rose-600 transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </article>
  );
}
