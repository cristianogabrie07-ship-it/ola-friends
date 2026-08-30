import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const Route = createFileRoute('/auth')({
  component: AuthPage,
});

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        navigate({ to: '/' });
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        toast.success("Cadastro realizado! Verifique seu email.");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0D0D0D] p-8 border border-[#C9A84C22] rounded-xl">
        <h1 className="text-2xl font-bold uppercase mb-8 text-center text-[#C9A84C]">
          {isLogin ? 'Login' : 'Cadastro'}
        </h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-[#A0A0A0]">Email</label>
            <input
              required
              type="email"
              className="w-full bg-[#1A1A1A] border border-[#C9A84C22] text-white p-3 rounded-lg focus:border-[#C9A84C] focus:outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-[#A0A0A0]">Senha</label>
            <input
              required
              type="password"
              className="w-full bg-[#1A1A1A] border border-[#C9A84C22] text-white p-3 rounded-lg focus:border-[#C9A84C] focus:outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#C9A84C] text-[#050505] py-4 font-bold uppercase hover:brightness-110 disabled:opacity-50 rounded-lg"
          >
            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-[#A0A0A0] hover:text-[#C9A84C] transition-colors"
          >
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
}
