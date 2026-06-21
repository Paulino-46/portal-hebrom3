"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  BsFileEarmarkBarGraph,
  BsCheck2Circle,
  BsEye,
  BsPeopleFill,
  BsPencilSquare,
  BsTrash,
  BsPlusLg,
  BsX,
  BsCheckCircleFill,
  BsExclamationTriangleFill,
  BsInfoCircleFill,
} from "react-icons/bs";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  image: string | null;
  createdAt: string;
}

interface NewsContentProps {
  news?: NewsItem[];
}

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Toast Component ─────────────────────────────────────────────────────────

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <BsCheckCircleFill className="text-emerald-400 shrink-0" size={18} />,
  error:   <BsExclamationTriangleFill className="text-red-400 shrink-0" size={18} />,
  info:    <BsInfoCircleFill className="text-blue-400 shrink-0" size={18} />,
};

const TOAST_BORDER: Record<ToastType, string> = {
  success: "border-emerald-500/40",
  error:   "border-red-500/40",
  info:    "border-blue-500/40",
};

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 w-80 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 bg-slate-900 border ${TOAST_BORDER[t.type]} rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-4 fade-in duration-300`}
        >
          {TOAST_ICONS[t.type]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{t.title}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{t.message}</p>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Fechar notificação"
            className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-white/10 transition-all shrink-0"
          >
            <BsX size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10">
            <BsExclamationTriangleFill className="text-red-400" size={20} />
          </div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NewsContent({ news: newsProp }: NewsContentProps) {
  const [news, setNews]       = useState<NewsItem[]>(Array.isArray(newsProp) ? newsProp : []);
  const [loading, setLoading] = useState(!newsProp);
  const [toasts, setToasts]   = useState<Toast[]>([]);
  const toastCounter          = useRef(0);

  // Filtros
  const [filterSearchTitle, setFilterSearchTitle] = useState("");
  const [filterAuthor, setFilterAuthor]           = useState("");
  const [filterDateFrom, setFilterDateFrom]       = useState("");
  const [filterDateTo, setFilterDateTo]           = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  // Confirm delete dialog
  const [confirmOpen, setConfirmOpen]       = useState(false);
  const [pendingDelete, setPendingDelete]   = useState<{ id: string; title: string } | null>(null);

  // Form
  const [formData, setFormData]           = useState({ title: "", summary: "", content: "", author: "" });
  const [selectedFile, setSelectedFile]   = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview]   = useState<string | null>(null);

  // ── Toast helpers ──────────────────────────────────────────────────────────

  const addToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Data loading ───────────────────────────────────────────────────────────

  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/news");
      const data = await response.json();
      if (response.ok && Array.isArray(data.news)) {
        setNews(data.news);
      } else {
        addToast("error", "Erro ao carregar", data.error ?? "Não foi possível carregar as notícias.");
      }
    } catch {
      addToast("error", "Erro de conexão", "Não foi possível comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (newsProp && newsProp.length > 0) {
      setNews(newsProp);
      setLoading(false);
      return;
    }
    loadNews();
  }, [newsProp, loadNews]);

  // ── Modal helpers ──────────────────────────────────────────────────────────

  function resetForm() {
    setFormData({ title: "", summary: "", content: "", author: "" });
    setSelectedFile(null);
    setImageUrl(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function setImageUrl(url: string | null) {
    setCurrentImageUrl(url);
  }

  function handleCreateOpen() {
    setEditingId(null);
    resetForm();
    setIsModalOpen(true);
  }

  function handleEditOpen(item: NewsItem) {
    setEditingId(item.id);
    setFormData({ title: item.title, summary: item.summary, content: item.content, author: item.author });
    setSelectedFile(null);
    setImageUrl(item.image);
    setImagePreview(item.image);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsModalOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  function handleDeleteRequest(id: string, title: string) {
    setPendingDelete({ id, title });
    setConfirmOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!pendingDelete) return;
    setConfirmOpen(false);
    try {
      const response = await fetch(`/api/news/${pendingDelete.id}`, { method: "DELETE" });
      if (response.ok) {
        addToast("success", "Notícia eliminada", `"${pendingDelete.title}" foi removida com sucesso.`);
        loadNews();
      } else {
        const err = await response.json().catch(() => ({ error: "Erro desconhecido." }));
        addToast("error", "Erro ao eliminar", err.error ?? "Não foi possível eliminar a notícia.");
      }
    } catch {
      addToast("error", "Erro de conexão", "Não foi possível comunicar com o servidor.");
    } finally {
      setPendingDelete(null);
    }
  }

  // ── Submit (create / edit) ─────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("title",     formData.title);
      data.append("summary", formData.summary);
      data.append("content", formData.content);
      data.append("author",  formData.author);

      if (selectedFile) {
        data.append("image", selectedFile);
      } else if (editingId && currentImageUrl) {
        data.append("keepOldImage", "true");
      } else if (!editingId) {
        addToast("error", "Imagem obrigatória", "Selecione uma imagem para a nova notícia.");
        setSubmitting(false);
        return;
      }

      const url    = editingId ? `/api/news/${editingId}` : "/api/news";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, { method, body: data });
      const result   = await response.json().catch(() => ({}));

      if (response.ok) {
        addToast(
          "success",
          editingId ? "Notícia atualizada" : "Notícia criada",
          editingId
            ? `"${formData.title}" foi atualizada com sucesso.`
            : `"${formData.title}" foi publicada com sucesso.`
        );
        resetForm();
        setIsModalOpen(false);
        loadNews();
      } else {
        addToast("error", "Erro ao salvar", result.error ?? "Não foi possível salvar a notícia.");
      }
    } catch {
      addToast("error", "Erro de conexão", "Não foi possível comunicar com o servidor.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Derived data ───────────────────────────────────────────────────────────

  const safeNews = useMemo(() => (Array.isArray(news) ? news : []), [news]);

  const filteredNews = useMemo(() => {
    return safeNews.filter((item) => {
      const matchesTitle  = item.title.toLowerCase().includes(filterSearchTitle.toLowerCase());
      const matchesAuthor = !filterAuthor || item.author.toLowerCase().includes(filterAuthor.toLowerCase());
      const itemDate      = new Date(item.createdAt).toISOString().split("T")[0];
      const matchesFrom   = !filterDateFrom || itemDate >= filterDateFrom;
      const matchesTo     = !filterDateTo   || itemDate <= filterDateTo;
      return matchesTitle && matchesAuthor && matchesFrom && matchesTo;
    });
  }, [safeNews, filterSearchTitle, filterAuthor, filterDateFrom, filterDateTo]);

  const stats = useMemo(() => {
    const publishedToday = safeNews.filter(
      (n) => new Date(n.createdAt).toDateString() === new Date().toDateString()
    ).length;
    const activeAuthors = new Set(safeNews.map((n) => n.author)).size;

    return [
      { label: "Notícias Totais",  value: safeNews.length.toString(), icon: <BsFileEarmarkBarGraph />, color: "text-blue-400",    barColor: "bg-blue-500",    glow: "shadow-blue-500/20"    },
      { label: "Publicadas Hoje",  value: publishedToday.toString(),   icon: <BsCheck2Circle />,        color: "text-emerald-400", barColor: "bg-emerald-500", glow: "shadow-emerald-500/20" },
      { label: "Autores Ativos",   value: activeAuthors.toString(),    icon: <BsPeopleFill />,          color: "text-cyan-400",    barColor: "bg-cyan-500",    glow: "shadow-cyan-500/20"    },
    ];
  }, [safeNews]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Toast container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar Notícia"
        message={`Tem certeza que deseja eliminar "${pendingDelete?.title}"? Esta acção não pode ser desfeita.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setConfirmOpen(false); setPendingDelete(null); }}
      />

      <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className={`relative group overflow-hidden bg-slate-900/50 border border-white/20 p-4 rounded-xl backdrop-blur-xl transition-all hover:bg-slate-800/60 hover:border-white/30 shadow-xl ${stat.glow}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>{stat.icon}</div>
                <p className="text-slate-400 text-[0.65rem] font-medium tracking-wide uppercase">{stat.label}</p>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">{stat.value}</h3>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.barColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <BsFileEarmarkBarGraph className="text-blue-400" />
              <h4 className="text-white font-semibold">Repositório de Notícias</h4>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
                {filteredNews.length} itens
              </span>
              <button
                type="button"
                onClick={handleCreateOpen}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                <BsPlusLg /> Nova Notícia
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid gap-4 p-6 border-b border-white/5 md:grid-cols-4">
            {[
              { id: "search-title",  label: "Buscar por título", value: filterSearchTitle, set: setFilterSearchTitle, placeholder: "Filtrar por título...",  type: "text" },
              { id: "search-author", label: "Filtrar por autor",  value: filterAuthor,      set: setFilterAuthor,      placeholder: "Filtrar por autor...",   type: "text" },
              { id: "date-from",     label: "Data de início",     value: filterDateFrom,    set: setFilterDateFrom,    placeholder: "DD/MM/AAAA",           type: "date" },
              { id: "date-to",       label: "Data final",         value: filterDateTo,      set: setFilterDateTo,      placeholder: "DD/MM/AAAA",           type: "date" },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="block text-xs font-semibold text-slate-300">{f.label}</label>
                <input
                  id={f.id}
                  type={f.type}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  title={f.label}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-4 font-bold w-20">Imagem</th>
                  <th className="px-6 py-4 font-bold w-auto">Título</th>
                  <th className="px-6 py-4 font-bold w-44">Autor</th>
                  <th className="px-6 py-4 font-bold w-44">Criado em</th>
                  <th className="px-6 py-4 font-bold w-36 text-right pr-8">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredNews.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-10 w-10 rounded-xl overflow-hidden bg-blue-500/10 flex items-center justify-center text-blue-400">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <BsFileEarmarkBarGraph size={18} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-1 block">
                        {item.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 truncate">{item.author}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono whitespace-nowrap">{formatDate(item.createdAt)}</td>
                    <td className="px-6 py-4 text-right pr-8">
                      <div className="flex items-center justify-end gap-1.5">
                        <button type="button" aria-label={`Visualizar notícia: ${item.title}`} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all inline-flex items-center justify-center">
                          <BsEye size={16} />
                        </button>
                        <button type="button" onClick={() => handleEditOpen(item)} aria-label={`Editar notícia: ${item.title}`} className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 rounded-lg transition-all inline-flex items-center justify-center">
                          <BsPencilSquare size={16} />
                        </button>
                        <button type="button" onClick={() => handleDeleteRequest(item.id, item.title)} aria-label={`Eliminar notícia: ${item.title}`} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all inline-flex items-center justify-center">
                          <BsTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
                        Carregando notícias...
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && filteredNews.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                      Nenhuma notícia encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">

            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/40 shrink-0">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <BsPlusLg className="text-emerald-400" />
                {editingId ? "Editar Notícia" : "Nova Notícia"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Fechar modal"
                className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
              >
                <BsX size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="form-title" className="block text-xs font-semibold text-slate-300">Título <span className="text-red-400">*</span></label>
                  <input
                    id="form-title"
                    type="text"
                    required
                    placeholder="Introduza o título da notícia"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="form-author" className="block text-xs font-semibold text-slate-300">Autor <span className="text-red-400">*</span></label>
                  <input
                    id="form-author"
                    type="text"
                    required
                    placeholder="Nome do autor"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="form-summary" className="block text-xs font-semibold text-slate-300">Resumo <span className="text-red-400">*</span></label>
                <textarea
                  id="form-summary"
                  required
                  rows={2}
                  placeholder="Escreva um breve resumo da notícia"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="form-content" className="block text-xs font-semibold text-slate-300">Conteúdo <span className="text-red-400">*</span></label>
                <textarea
                  id="form-content"
                  required
                  rows={4}
                  placeholder="Escreva o conteúdo principal aqui..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none transition-colors"
                />
              </div>

              {/* Image picker */}
              <div>
                <span className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Imagem {!editingId && <span className="text-red-400">*</span>}
                </span>
                <input
                  id="form-image"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  title="Selecionar imagem da notícia"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                  role="button"
                  tabIndex={0}
                  aria-label="Carregar imagem"
                  className="relative cursor-pointer group border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl overflow-hidden transition-colors"
                >
                  {imagePreview ? (
                    <div className="relative h-32">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs font-semibold">Clique para alterar</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 flex flex-col items-center justify-center gap-1.5 text-slate-500 group-hover:text-slate-300 transition-colors">
                      <BsFileEarmarkBarGraph size={24} />
                      <p className="text-xs">Clique para selecionar uma imagem</p>
                    </div>
                  )}
                </div>
                {selectedFile && (
                  <p className="mt-1 text-xs text-slate-500 truncate">{selectedFile.name}</p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/5 flex justify-end gap-3 sticky bottom-0 bg-slate-900 pb-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all"
                >
                  {submitting && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {submitting ? "Salvando..." : editingId ? "Atualizar Notícia" : "Publicar Notícia"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}