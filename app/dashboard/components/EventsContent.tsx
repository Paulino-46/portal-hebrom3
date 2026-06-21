'use client';
import { useState, useEffect, useRef } from 'react';
import {
  BsCalendarEvent,
  BsPlusLg,
  BsMagic,
  BsActivity,
  BsClockHistory,
  BsTrash,
  BsPencilSquare,
  BsGeoAlt,
  BsClock,
  BsCheckCircleFill,
  BsExclamationTriangleFill,
  BsImage,
} from 'react-icons/bs';

interface Evento {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image: string;
}

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

export default function EventsDashboardContent() {
  const [events, setEvents] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Imagem: ficheiro escolhido pelo utilizador (novo) + preview + imagem atual (em edição)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [existingImage, setExistingImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Erro ao carregar eventos.');
      }
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      showToast('error', err instanceof Error ? err.message : 'Não foi possível carregar os eventos.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetImageState = () => {
    setImageFile(null);
    setImagePreview('');
    setExistingImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setDate('');
    setTime('');
    resetImageState();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: Evento) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setLocation(event.location);
    setDate(event.date.split('T')[0]);
    setTime(event.time);
    setImageFile(null);
    setImagePreview(event.image);
    setExistingImage(event.image);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = !!editingEvent;

    if (!isEditing && !imageFile) {
      showToast('error', 'Selecione uma imagem para o evento.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('date', date);
      formData.append('time', time);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (isEditing) {
        formData.append('currentImage', existingImage);
      }

      const url = isEditing ? `/api/events/${editingEvent!.id}` : '/api/events';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Não foi possível salvar o evento.');
      }

      await fetchEvents();
      setIsModalOpen(false);
      resetImageState();
      showToast('success', isEditing ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar evento:', err);
      showToast('error', err instanceof Error ? err.message : 'Não foi possível salvar o evento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || 'Não foi possível excluir o evento.');
      }

      await fetchEvents();
      showToast('success', 'Evento excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      showToast('error', err instanceof Error ? err.message : 'Não foi possível excluir o evento.');
    }
  };

  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).length;
  const activeLocations = Array.from(new Set(events.map((e) => e.location))).length;

  const stats = [
    { label: 'Total de Eventos', value: totalEvents.toString(), icon: <BsCalendarEvent />, color: 'text-blue-400', barColor: 'bg-blue-500', glow: 'shadow-blue-500/20' },
    { label: 'Próximos Eventos', value: upcomingEvents.toString(), icon: <BsClockHistory />, color: 'text-cyan-400', barColor: 'bg-cyan-500', glow: 'shadow-cyan-500/20' },
    { label: 'Locais Ativos', value: activeLocations.toString(), icon: <BsActivity />, color: 'text-emerald-400', barColor: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto text-slate-200">

      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <span className="mt-0.5">
              {toast.type === 'success' ? <BsCheckCircleFill /> : <BsExclamationTriangleFill />}
            </span>
            <p className="text-sm font-medium leading-snug">{toast.message}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`relative group overflow-hidden bg-slate-900/50 border border-white/10 p-5 rounded-2xl backdrop-blur-xl transition-all hover:bg-slate-800/60 hover:border-white/20 shadow-xl ${stat.glow}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <p className="text-slate-400 text-xs font-semibold tracking-wide uppercase">{stat.label}</p>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">{loading ? '...' : stat.value}</h3>
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.barColor} opacity-60 group-hover:opacity-100 transition-opacity`} />
          </div>
        ))}
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <BsActivity className="text-blue-400 animate-pulse" />
            <h4 className="text-white font-bold text-lg">Painel de Eventos</h4>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <BsPlusLg /> Adicionar Evento
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4 font-bold">Evento</th>
                <th className="px-6 py-4 font-bold">Localização</th>
                <th className="px-6 py-4 font-bold">Data &amp; Hora</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [1, 2, 3].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-5 bg-white/10 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-white/10 rounded-full w-16 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-white/10 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm font-medium">
                    Nenhum evento registrado no banco de dados.
                  </td>
                </tr>
              ) : (
                events.map((event) => {
                  const isPast = new Date(event.date) < new Date();
                  return (
                    <tr key={event.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {event.image ? (
                            <img src={event.image} alt={event.title} className="h-10 w-10 rounded-xl object-cover border border-white/10" />
                          ) : (
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                              <BsCalendarEvent size={16} />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{event.title}</span>
                            <span className="text-xs text-slate-400 line-clamp-1 max-w-[250px]">{event.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300 font-medium">
                        <span className="flex items-center gap-1.5"><BsGeoAlt className="text-slate-500" /> {event.location}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        <div className="flex flex-col">
                          <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                          <span className="text-slate-500 flex items-center gap-1"><BsClock size={10} /> {event.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {isPast ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 border border-slate-500/20 text-slate-400 uppercase">
                              Finalizado
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                              Agendado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(event)}
                            title="Editar Evento"
                            aria-label={`Editar ${event.title}`}
                            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                          >
                            <BsPencilSquare size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(event.id)}
                            title="Excluir Evento"
                            aria-label={`Excluir ${event.title}`}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                          >
                            <BsTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-white/5 text-center">
          <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em]">
            Database Sync Active // Engine: Prisma ORM // Status: Connected
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <BsMagic className="text-blue-400" /> {editingEvent ? 'Editar Evento' : 'Novo Evento'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Fechar modal"
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label htmlFor="event-title" className="block text-slate-400 text-xs font-bold uppercase mb-1.5">Título do Evento</label>
                <input
                  id="event-title"
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ex: Conferência de Tecnologia Luanda"
                />
              </div>

              <div>
                <label htmlFor="event-description" className="block text-slate-400 text-xs font-bold uppercase mb-1.5">Descrição</label>
                <textarea
                  id="event-description"
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Detalhes sobre o evento..."
                />
              </div>

              <div>
                <label htmlFor="event-location" className="block text-slate-400 text-xs font-bold uppercase mb-1.5">Localização</label>
                <input
                  id="event-location"
                  required
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ex: Reitoria da UAN, Luanda"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-date" className="block text-slate-400 text-xs font-bold uppercase mb-1.5">Data</label>
                  <input
                    id="event-date"
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors scheme-dark"
                  />
                </div>
                <div>
                  <label htmlFor="event-time" className="block text-slate-400 text-xs font-bold uppercase mb-1.5">Hora</label>
                  <input
                    id="event-time"
                    required
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Ex: 14:30"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="event-image" className="block text-slate-400 text-xs font-bold uppercase mb-1.5">
                  Imagem do Evento
                </label>
                <div className="flex items-center gap-3">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Pré-visualização"
                      className="h-14 w-14 rounded-xl object-cover border border-white/10 flex-shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 flex-shrink-0">
                      <BsImage size={18} />
                    </div>
                  )}
                  <label
                    htmlFor="event-image"
                    className="flex-1 cursor-pointer bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 hover:border-blue-500 transition-colors text-center"
                  >
                    {imageFile ? imageFile.name : 'Escolher imagem do computador...'}
                  </label>
                  <input
                    id="event-image"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                {editingEvent && (
                  <p className="text-[10px] text-slate-500 mt-1.5">
                    Deixe em branco para manter a imagem atual.
                  </p>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-600/10 transition-colors"
                >
                  {submitting ? 'Salvando...' : editingEvent ? 'Salvar Alterações' : 'Criar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}