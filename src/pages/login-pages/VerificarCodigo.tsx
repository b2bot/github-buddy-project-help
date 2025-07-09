import { useNavigate } from "react-router-dom";

export default function VerificarCodigo() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Lado Esquerdo - Formulário */}
      <div className="w-1/2 flex flex-col justify-center px-20">
        {/* Voltar pro login */}
        <button
          className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-8"
          onClick={() => navigate("/login")}
        >
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/lauhy6x5_expires_30_days.png"
            alt="voltar"
            className="w-5 h-5"
          />
          login
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Verifique seu código
        </h1>
        <p className="text-gray-700 text-sm mb-10 max-w-md">
          Enviamos um código de autenticação para seu e-mail. <br />
          Insira abaixo para continuar.
        </p>

        {/* Campo: Código de verificação */}
        <div className="relative mb-4">
          <label className="block text-sm text-gray-700 mb-1">
            Código de verificação
          </label>
          <input
            type="text"
            placeholder="Digite o código"
            className="w-full px-4 py-3 pr-10 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
          />
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/u9wazrhv_expires_30_days.png"
            alt="ver código"
            className="w-5 h-5 absolute right-3 top-10"
          />
        </div>

        {/* Reenviar código */}
        <p className="text-sm text-gray-700 mb-6">
          Não recebeu o código?{" "}
          <span className="text-red-500 font-medium cursor-pointer">
            Reenviar
          </span>
        </p>

        {/* Botão */}
        <button className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-bold py-3 rounded">
          Verificar
        </button>
      </div>

      {/* Lado Direito - Imagem */}
      <div className="w-1/2 bg-[#F5F5F5] flex items-center justify-center relative">
        <div className="flex flex-col items-center justify-between h-[80%]">
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/gkesg300_expires_30_days.png"
            alt="verificação"
            className="max-h-[500px] object-contain"
          />
          <div className="flex items-center gap-2 mt-6">
            <div className="w-8 h-2 rounded-full bg-[#8DD3BB]" />
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/s2t85yv6_expires_30_days.png"
              alt=""
              className="w-2 h-2"
            />
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/3luxzrts_expires_30_days.png"
              alt=""
              className="w-2 h-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
