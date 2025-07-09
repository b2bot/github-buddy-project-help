
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function EsqueciSenha() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: "Verifique se o email está correto",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email enviado!",
          description: "Confira seu e-mail para redefinir sua senha",
        });
        // Aguarda um pouco para o usuário ver a mensagem antes de redirecionar
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar email",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Lado Esquerdo - Formulário */}
      <div className="w-1/2 flex flex-col justify-center px-20">
        {/* Voltar */}
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm text-gray-600 hover:underline mb-8"
        >
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/ib7jh2ge_expires_30_days.png"
            alt="Voltar"
            className="w-5 h-5"
          />
          login
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Esqueceu sua senha?
        </h1>
        <p className="text-gray-700 text-sm mb-10 max-w-md">
          Sem problema, acontece com todo mundo. <br />
          Digite seu e-mail para receber as instruções de recuperação.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-bold py-3 rounded disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar instruções"}
          </button>
        </form>
      </div>

      {/* Lado Direito - Ilustração */}
      <div className="w-1/2 bg-[#F5F5F5] flex items-center justify-center relative">
        <div className="flex flex-col items-center justify-between h-[80%]">
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/5xkfapvr_expires_30_days.png"
            alt="Imagem segurança"
            className="max-h-[500px] object-contain"
          />

          <div className="flex items-center gap-2 mt-6">
            <div className="w-8 h-2 rounded-full bg-[#8DD3BB]" />
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/836qv4j0_expires_30_days.png"
              className="w-2 h-2"
              alt=""
            />
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/hsfmjqce_expires_30_days.png"
              className="w-2 h-2"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
