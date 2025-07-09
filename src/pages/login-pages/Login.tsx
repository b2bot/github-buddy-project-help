
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Erro no login",
          description: "Email ou senha inválidos",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* BLOCO ESQUERDA - LOGIN */}
      <div className="w-1/2 flex flex-col justify-center items-center px-24 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-600 mb-8">
            Acesse sua conta e continue otimizando com IA.
          </p>

          <form onSubmit={handleLogin}>
            <label className="text-sm text-gray-800">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 mb-6 px-4 py-2 border border-gray-400 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <label className="text-sm text-gray-800">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 mb-2 px-4 py-2 border border-gray-400 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <div className="flex items-center justify-between text-sm mb-6">
              <label className="flex items-center gap-2 text-gray-700">
                <input type="checkbox" />
                Lembrar
              </label>
              <Link
                to="/esquecisenha"
                className="text-purple-600 font-medium hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? "Acessando..." : "Acessar"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-700 mt-6">
            Ainda não tem uma conta?{" "}
            <Link
              to="/cadastro"
              className="text-purple-600 font-medium hover:underline"
            >
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>

      {/* BLOCO DIREITA - INFO */}
      <div className="w-1/2 bg-purple-600 text-white flex flex-col justify-center px-20">
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/h7le0wkr_expires_30_days.png"
          alt="Logo"
          className="w-28 h-auto mb-8"
        />
        <h2 className="text-3xl font-bold leading-tight mb-6">
          Sua central de produção e performance de conteúdo com IA e dados reais
        </h2>
        <p className="text-base leading-relaxed text-purple-100 mb-12">
          Crie artigos, posts, e-mails e campanhas completas. Monitore SEO clássico e LLM Score em tempo real. Publique direto no WordPress. Com performance, automação e escala. Ideal para profissionais e empresas que querem dominar o tráfego com inteligência.
        </p>
        <p className="text-base text-purple-100">
          Ainda não tem uma conta? Conheça e comece agora.
        </p>
      </div>
    </div>
  );
};

export default Login;
