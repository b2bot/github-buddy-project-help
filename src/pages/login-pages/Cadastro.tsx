
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Cadastro() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Erro no cadastro",
        description: "Você deve concordar com os termos e políticas",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Erro no cadastro",
            description: "Este email já está cadastrado",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta",
        });
        navigate("/login");
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Lado Esquerdo - Ilustração */}
      <div className="w-1/2 bg-[#F5F5F5] flex items-center justify-center">
        <div className="flex flex-col items-center justify-between h-[80%]">
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/ypsyubbj_expires_30_days.png"
            alt="Cadastro Illustration"
            className="max-h-[500px] object-contain"
          />
          <div className="flex items-center gap-2 mt-6">
            <div className="w-8 h-2 rounded-full bg-indigo-500" />
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <div className="w-2 h-2 rounded-full bg-gray-400" />
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-1/2 flex flex-col px-20 pt-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cadastro</h1>
        <p className="text-gray-600 text-sm mb-10 leading-relaxed">
          Vamos configurar tudo para você acessar sua conta pessoal. <br />
          Preencha os campos abaixo:
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              name="firstName"
              placeholder="Nome"
              value={formData.firstName}
              onChange={handleInputChange}
              className="flex-1 px-4 py-3 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Sobrenome"
              value={formData.lastName}
              onChange={handleInputChange}
              className="flex-1 px-4 py-3 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
              required
            />
          </div>
          
          <div className="flex gap-4 mb-6">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleInputChange}
              className="flex-1 px-4 py-3 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telefone"
              value={formData.phone}
              onChange={handleInputChange}
              className="flex-1 px-4 py-3 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
            />
          </div>

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 mb-6 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
            required
          />
          
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirme a senha"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 mb-6 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
            required
          />

          <div className="flex items-start gap-2 mb-8">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="w-4 h-4 mt-1"
              required
            />
            <span className="text-sm text-gray-700 leading-snug">
              Concordo com os{" "}
              <span className="text-red-500 font-medium">
                Termos e Políticas de Privacidade
              </span>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-bold py-3 rounded mb-4 disabled:opacity-50"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-800">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-purple-600 font-medium hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
