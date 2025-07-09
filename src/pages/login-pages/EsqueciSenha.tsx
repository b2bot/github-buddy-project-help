import { useNavigate } from "react-router-dom";

export default function EsqueciSenha() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Lado Esquerdo - Formulário */}
      <div className="w-1/2 flex flex-col justify-center px-20">
        {/* Voltar */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:underline mb-8"
        >
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/ib7jh2ge_expires_30_days.png"
            alt="Voltar"
            className="w-5 h-5"
          />
          login
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Esqueceu sua senha?
        </h1>
        <p className="text-gray-700 text-sm mb-10 max-w-md">
          Sem problema, acontece com todo mundo. <br />
          Digite seu e-mail para receber as instruções de recuperação.
        </p>

        <div className="mb-6">
          <label className="block text-sm text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
          />
        </div>

        <button className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-bold py-3 rounded">
          Enviar instruções
        </button>
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
