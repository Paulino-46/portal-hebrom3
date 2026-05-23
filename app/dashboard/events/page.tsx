"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type EventItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image: string;
};

type EventForm = {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image: string;
};

const initialForm: EventForm = {
  title: "",
  description: "",
  location: "",
  date: new Date().toISOString().split('T')[0], // Default to today's date
  time: "12:00", // Default time
  image: "",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function EventsManagementPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState<EventForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      if (response.ok && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setStatus(data.error || "Não foi possível carregar os eventos.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Não foi possível carregar os eventos.");
    }
  }

  function updateField(field: keyof EventForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Salvando...");

    try {
      const path = editingId ? `/api/events/${editingId}` : "/api/events";
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error || "Ocorreu um erro ao salvar o evento.");
        return;
      }

      const successMessage = editingId ? "Evento atualizado com sucesso." : "Evento criado com sucesso.";
      setStatus(successMessage);
      
      // Limpar formulário imediatamente após sucesso
      setForm(initialForm);
      setEditingId(null);
      
      // Recarregar eventos e limpar status após 2 segundos
      setTimeout(() => {
        loadEvents();
        setStatus("");
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus("Ocorreu um erro ao salvar o evento.");
    }
  }

  function handleDelete(id: string) {
    setDeleteModal({ open: true, id });
  }

  async function confirmDelete() {
    if (!deleteModal.id) return;
    try {
      const response = await fetch(`/api/events/${deleteModal.id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error || "Não foi possível excluir o evento.");
        return;
      }

      setStatus("Evento excluído com sucesso.");
      loadEvents();
    } catch (error) {
      console.error(error);
      setStatus("Não foi possível excluir o evento.");
    } finally {
      setDeleteModal({ open: false, id: null });
    }
  }

  function handleEdit(item: EventItem) {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, location: item.location, date: item.date.substring(0, 10), time: item.time, image: item.image });
    setStatus("Edição ativada. Atualize os campos e salve.");
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
    setStatus("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-orange-300">Administração</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Gerenciar Eventos</h1>
            <p className="mt-2 text-sm text-slate-400">
              Controle os eventos do portal com criação, edição e exclusão em uma única interface.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full border border-slate-800 bg-slate-900 px-5 py-3 text-sm text-white transition hover:bg-slate-800">
              Voltar ao painel
            </Link>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-sm text-orange-200 transition hover:bg-orange-500/15"
            >
              Novo registro
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-slate-950/20">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Lista de eventos</h2>
                <p className="mt-1 text-sm text-slate-400">Eventos cadastrados no portal.</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
                {events.length} itens
              </span>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/90">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-900 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Evento</th>
                      <th className="px-4 py-3">Imagem</th>
                    <th className="px-4 py-3">Data e Hora</th>
                    <th className="px-4 py-3">Local</th>
                    <th className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((item) => (
                    <tr key={item.id} className="border-b border-slate-800 transition hover:bg-slate-900/80">
                      <td className="px-4 py-4 text-white">{item.title}</td>
                      <td className="px-4 py-4">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="h-14 w-20 rounded-xl object-cover" />
                        ) : (
                          <span className="text-slate-500">Sem imagem</span>
                        )}
                      </td>
                      <td className="px-4 py-4">{formatDate(item.date)} às {item.time}</td>
                      <td className="px-4 py-4">{item.location}</td>
                      <td className="px-4 py-4 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 p-2 text-orange-200 transition hover:bg-orange-500/20"
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 p-2 text-red-200 transition hover:bg-red-500/20"
                          title="Excluir"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        Nenhum evento encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-slate-950/20">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">{editingId ? "Editar evento" : "Novo evento"}</h2>
              <p className="mt-1 text-sm text-slate-400">
                Defina título, descrição e horário para o evento.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-200">Título</label>
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="mt-2 min-h-[120px] w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-200">Local</label>
                  <input
                    value={form.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-200">Data</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                    value={form.date}
                    onChange={(event) => updateField("date", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-200">Hora</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(event) => updateField("time", event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-200">Imagem (URL)</label>
                  <input
                    value={form.image}
                    onChange={(event) => updateField("image", event.target.value)}
                    placeholder="https://..."
                    className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-row flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-slate-400">{status}</span>
                <div className="flex flex-wrap gap-3">
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-full border border-slate-700 bg-slate-800 px-5 py-3 text-sm text-slate-200 transition hover:bg-slate-700"
                    >
                      Cancelar edição
                    </button>
                  )}
                  <button
                    type="submit"
                    className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-orange-400"
                  >
                    {editingId ? "Salvar alterações" : "Criar evento"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-[2.5rem] border border-white/10 bg-slate-900 p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 9-6 6"/><path d="m9 9 6 6"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white">Confirmar exclusão</h3>
              <p className="mt-2 text-sm text-slate-400">
                Esta ação não pode ser desfeita. Tem certeza que deseja remover este evento permanentemente?
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="flex-1 rounded-full border border-slate-700 bg-slate-800 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-full bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600 shadow-lg shadow-red-950/20"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
