import React from "react";

export default function RedefinirSenha() {
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

        {/* Campo: Nova senha */}
        <div className="relative mb-6">
          <label className="block text-sm text-gray-700 mb-1">Nova senha</label>
          <input
            type="password"
            placeholder="Nova senha"
            className="w-full px-4 py-3 pr-10 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
          />
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/m3ue2v6q_expires_30_days.png"
            alt="ver senha"
            className="w-5 h-5 absolute right-3 top-10 cursor-pointer"
          />
        </div>

        {/* Campo: Confirmar senha */}
        <div className="relative mb-8">
          <label className="block text-sm text-gray-700 mb-1">
            Confirmar nova senha
          </label>
          <input
            type="password"
            placeholder="Confirme a nova senha"
            className="w-full px-4 py-3 pr-10 bg-white text-gray-900 border border-gray-400 rounded text-sm outline-none placeholder:text-gray-500"
          />
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/eY5zNG4HDa/e3rujnx3_expires_30_days.png"
            alt="ver senha"
            className="w-5 h-5 absolute right-3 top-10 cursor-pointer"
          />
        </div>

        <button className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-bold py-3 rounded">
          Salvar nova senha
        </button>
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
