"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NewsItem = {
  id: string;
  title: string;
  author: string;
  image?: string;
  createdAt: string;
};

type NewsForm = {
  title: string;
  summary: string;
  content: string;
  author: string;
  image: string;
};

const initialForm: NewsForm = {
  title: "",
  summary: "",
  content: "",
  author: "",
  image: "",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function NewsManagementPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [status, setStatus] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<NewsForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      const response = await fetch("/api/news");
      const data = await response.json();
      if (response.ok && Array.isArray(data.news)) {
        setNews(data.news);
      } else {
        setStatus(data.error || "Não foi possível carregar as notícias.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Não foi possível carregar as notícias.");
    }
  }

  function updateField(field: keyof NewsForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreate() {
    setEditingId(null);
    setForm(initialForm);
    setDialogOpen(true);
  }

  function openEdit(item: NewsItem & { summary?: string; content?: string }) {
    setEditingId(item.id);
    setForm({ title: item.title, summary: item.summary || "", content: item.content || "", author: item.author, image: item.image || "" });
    setDialogOpen(true);
  }

  async function handleSave() {
    setStatus("Salvando...");
    try {
      const path = editingId ? `/api/news/${editingId}` : "/api/news";
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error || "Ocorreu um erro ao salvar a notícia.");
        return;
      }
      setStatus(editingId ? "Notícia atualizada." : "Notícia criada.");
      setDialogOpen(false);
      setForm(initialForm);
      setEditingId(null);
      await loadNews();
      setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      console.error(error);
      setStatus("Ocorreu um erro ao salvar a notícia.");
    }
  }

  function handleDelete(id: string) {
    setDeleteModal({ open: true, id });
  }

  async function confirmDelete() {
    if (!deleteModal.id) return;
    try {
      const response = await fetch(`/api/news/${deleteModal.id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error || "Não foi possível excluir a notícia.");
        return;
      }

      setStatus("Notícia excluída com sucesso.");
      loadNews();
    } catch (error) {
      console.error(error);
      setStatus("Não foi possível excluir a notícia.");
    } finally {
      setDeleteModal({ open: false, id: null });
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sky-300">Administração</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Gerenciar Notícias</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full border border-slate-800 bg-slate-900 px-5 py-3 text-sm text-white transition hover:bg-slate-800">
              Voltar
            </Link>
            <button onClick={openCreate} className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-sky-400">
              Criar notícia
            </button>
          </div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Lista de notícias</h2>
              <p className="mt-1 text-sm text-slate-400">Todas as notícias cadastradas no sistema.</p>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
              {news.length} itens
            </span>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/90">
            <table className="min-w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Resumo</th>
                  <th className="px-4 py-3">Conteúdo</th>
                  <th className="px-4 py-3">Imagem</th>
                  <th className="px-4 py-3">Autor</th>
                  <th className="px-4 py-3">Criado em</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.id} className="border-b border-slate-800 transition hover:bg-slate-900/80">
                    <td className="px-4 py-4 text-white">{item.title}</td>
                    <td className="px-4 py-4 text-slate-300">{(item as any).summary ? ((item as any).summary.length > 80 ? (item as any).summary.slice(0, 80) + '...' : (item as any).summary) : <span className="text-slate-500">—</span>}</td>
                    <td className="px-4 py-4 text-slate-300">{(item as any).content ? ((item as any).content.length > 100 ? (item as any).content.slice(0, 100) + '...' : (item as any).content) : <span className="text-slate-500">—</span>}</td>
                    <td className="px-4 py-4">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-14 w-20 rounded-xl object-cover" />
                      ) : (
                        <span className="text-slate-500">Sem imagem</span>
                      )}
                    </td>
                    <td className="px-4 py-4">{item.author}</td>
                    <td className="px-4 py-4">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-4 space-x-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/10 p-2 text-sky-200 transition hover:bg-sky-500/20"
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
                {news.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      Nenhuma notícia encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
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
                Esta ação não pode ser desfeita. Tem certeza que deseja remover esta notícia permanentemente?
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
      {/* Modal de Criar / Editar */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">{editingId ? "Editar notícia" : "Nova notícia"}</h3>
              <button onClick={() => setDialogOpen(false)} className="text-slate-400 hover:text-slate-200">Fechar</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-200">Título</label>
                <input value={form.title} onChange={(e) => updateField("title", e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">Resumo</label>
                <textarea value={form.summary} onChange={(e) => updateField("summary", e.target.value)} className="mt-2 w-full min-h-[90px] rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">Conteúdo</label>
                <textarea value={form.content} onChange={(e) => updateField("content", e.target.value)} className="mt-2 w-full min-h-[140px] rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-200">Autor</label>
                  <input value={form.author} onChange={(e) => updateField("author", e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-200">Imagem (URL)</label>
                  <input value={form.image} onChange={(e) => updateField("image", e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <span className="text-sm text-slate-400">{status}</span>
                <button onClick={() => setDialogOpen(false)} className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300">Cancelar</button>
                <button onClick={handleSave} className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950">{editingId ? "Salvar" : "Criar"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
