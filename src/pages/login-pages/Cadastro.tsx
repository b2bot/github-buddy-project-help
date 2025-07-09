import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const navigate = useNavigate();

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

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Nome"
            className="flex-1 px-4 py-3 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
          />
          <input
            type="text"
            placeholder="Sobrenome"
            className="flex-1 px-4 py-3 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
          />
        </div>
        <div className="flex gap-4 mb-6">
          <input
            type="email"
            placeholder="E-mail"
            className="flex-1 px-4 py-3 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
          />
          <input
            type="tel"
            placeholder="Telefone"
            className="flex-1 px-4 py-3 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
          />
        </div>

        <input
          type="password"
          placeholder="Senha"
          className="w-full px-4 py-3 mb-6 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
        />
        <input
          type="password"
          placeholder="Confirme a senha"
          className="w-full px-4 py-3 mb-6 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
        />

        <div className="flex items-start gap-2 mb-8">
          <input type="checkbox" className="w-4 h-4 mt-1" />
          <span className="text-sm text-gray-700 leading-snug">
            Concordo com os{" "}
            <span className="text-red-500 font-medium">
              Termos e Políticas de Privacidade
            </span>
          </span>
        </div>

        <button className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-bold py-3 rounded mb-4">
          Criar conta
        </button>

        <p className="text-center text-sm text-gray-800">
          Já tem uma conta?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-purple-600 font-medium hover:underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
