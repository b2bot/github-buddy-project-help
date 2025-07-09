
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Verifica se há um hash na URL indicando que é um reset de senha
    const hash = window.location.hash;
    if (!hash.includes('access_token')) {
      // Se não há token de reset, redireciona para login
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Erro na redefinição",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast({
        title: "Erro na redefinição",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(passwords.newPassword);
      
      if (error) {
        toast({
          title: "Erro na redefinição",
          description: "Não foi possível alterar a senha",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Senha alterada com sucesso!",
          description: "Redirecionando para o login...",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Erro na redefinição",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Formulário à esquerda */}
      <div className="w-1/2 flex flex-col justify-center px-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Crie uma nova senha
        </h1>
        <p className="text-gray-700 text-sm mb-10 max-w-md">
          Sua senha anterior foi redefinida. <br />
          Agora defina uma nova senha para sua conta.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Campo: Nova senha */}
          <div className="relative mb-6">
            <label className="block text-sm text-gray-700 mb-1">Nova senha</label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Nova senha"
              value={passwords.newPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pr-10 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-10"
            >
              <img
                src={showNewPassword 
                  ? "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/e3rujnx3_expires_30_days.png"
                  : "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/m3ue2v6q_expires_30_days.png"
                }
                alt="ver senha"
                className="w-5 h-5 cursor-pointer"
              />
            </button>
          </div>

          {/* Campo: Confirmar senha */}
          <div className="relative mb-8">
            <label className="block text-sm text-gray-700 mb-1">
              Confirmar nova senha
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirme a nova senha"
              value={passwords.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pr-10 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10"
            >
              <img
                src={showConfirmPassword 
                  ? "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/e3rujnx3_expires_30_days.png"
                  : "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/m3ue2v6q_expires_30_days.png"
                }
                alt="ver senha"
                className="w-5 h-5 cursor-pointer"
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-bold py-3 rounded disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      </div>

      {/* Imagem à direita */}
      <div className="w-1/2 bg-[#F5F5F5] flex items-center justify-center relative">
        <div className="flex flex-col items-center justify-between h-[80%]">
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/banqgnb9_expires_30_days.png"
            alt="Ilustração segurança"
            className="max-h-[500px] object-contain"
          />
          <div className="flex items-center gap-2 mt-6">
            <div className="w-8 h-2 rounded-full bg-[#8DD3BB]" />
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/r4w9593g_expires_30_days.png"
              alt=""
              className="w-2 h-2"
            />
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/kb89azn2_expires_30_days.png"
              alt=""
              className="w-2 h-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
