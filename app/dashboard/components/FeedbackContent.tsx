'use client';

import { useState } from 'react';
import {
  BsChatSquareQuote,
  BsEnvelope,
  BsPerson,
  BsTag,
  BsPencilSquare,
  BsSend,
  BsCheckCircleFill,
  BsExclamationTriangleFill,
  BsLightbulb,
  BsBug,
  BsQuestionCircle,
  BsHeart,
} from 'react-icons/bs';

export default function FeedbackContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Sugestão',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    // Simulação de chamada à API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Aqui iria a lógica para enviar os dados para uma API, por exemplo:
    // const response = await fetch('/api/feedback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });

    // Simulando uma resposta de sucesso
    const success = true;

    if (success) {
      showToast('success', 'O seu feedback foi enviado com sucesso. Agradecemos a sua contribuição!');
      setFormData({ name: '', email: '', type: 'Sugestão', subject: '', message: '' });
    } else {
      showToast('error', 'Ocorreu um erro ao enviar o seu feedback. Por favor, tente novamente.');
    }

    setSubmitting(false);
  };

  const feedbackTypes = [
    { value: 'Sugestão', icon: <BsLightbulb /> },
    { value: 'Reportar Erro', icon: <BsBug /> },
    { value: 'Dúvida', icon: <BsQuestionCircle /> },
    { value: 'Elogio', icon: <BsHeart /> },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-20 right-8 z-50 flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300 ${
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
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BsChatSquareQuote className="text-blue-400 shrink-0" />
            Partilhe o seu Feedback
          </h1>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm">
            A sua opinião é fundamental para melhorarmos o nosso portal.
          </p>
        </div>
      </div>

      {/* Formulário de Feedback */}
      <div className="bg-slate-900/40 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-400 uppercase mb-2">Nome (Opcional)</label>
              <div className="relative"><BsPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="O seu nome" /></div>
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase mb-2">Email (Opcional)</label>
              <div className="relative"><BsEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="O seu email" /></div>
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-xs font-bold text-slate-400 uppercase mb-2">Tipo de Feedback</label>
            <div className="relative"><BsTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><select id="type" name="type" required value={formData.type} onChange={handleChange} className="w-full appearance-none bg-slate-950 border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"><option disabled>Selecione um tipo...</option>{feedbackTypes.map(ft => (<option key={ft.value} value={ft.value}>{ft.value}</option>))}</select></div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs font-bold text-slate-400 uppercase mb-2">Assunto</label>
            <div className="relative"><BsPencilSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange} className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Sobre o que é o seu feedback?" /></div>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-bold text-slate-400 uppercase mb-2">Mensagem</label>
            <textarea id="message" name="message" required value={formData.message} onChange={handleChange} rows={5} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-y" placeholder="Escreva aqui a sua mensagem detalhada..."></textarea>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20">
              {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />A Enviar...</> : <><BsSend /> Enviar Feedback</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}