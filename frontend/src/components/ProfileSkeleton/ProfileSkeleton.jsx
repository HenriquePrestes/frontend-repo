export default function ProfileSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm animate-pulse">
            {/* Título */}
            <div className="h-8 bg-gray-300 rounded-md w-48 mb-8"></div>

            {/* Seção de Dados Pessoais */}
            <div className="space-y-6">
                {/* Subtítulo Dados Pessoais */}
                <div className="h-6 bg-gray-300 rounded-md w-40 mb-4"></div>

                {/* Nome completo */}
                <div className="mb-4">
                    <div className="h-14 bg-gray-200 rounded-lg w-full"></div>
                </div>

                {/* CPF e Data de Nascimento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="h-14 bg-gray-200 rounded-lg"></div>
                    <div className="h-14 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Profissão */}
                <div className="mb-4">
                    <div className="h-14 bg-gray-200 rounded-lg w-full"></div>
                </div>

                {/* E-mail */}
                <div className="mb-4">
                    <div className="h-14 bg-gray-200 rounded-lg w-full"></div>
                </div>

                {/* Senha */}
                <div className="mb-4">
                    <div className="h-14 bg-gray-200 rounded-lg w-full"></div>
                </div>
            </div>

            {/* Seção de Endereço */}
            <div className="border-t pt-6 mt-8 space-y-6">
                {/* Subtítulo Endereço */}
                <div className="h-6 bg-gray-300 rounded-md w-32 mb-4"></div>

                {/* CEP */}
                <div className="mb-4">
                    <div className="h-14 bg-gray-200 rounded-lg w-full"></div>
                </div>

                {/* Rua e Número */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                        <div className="h-14 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div>
                        <div className="h-14 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>

                {/* Complemento */}
                <div className="mb-4">
                    <div className="h-14 bg-gray-200 rounded-lg w-full"></div>
                </div>

                {/* Cidade e Estado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="h-14 bg-gray-200 rounded-lg"></div>
                    <div className="h-14 bg-gray-200 rounded-lg"></div>
                </div>
            </div>

            {/* Notificações */}
            <div className="flex items-center gap-4 mt-6">
                <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* Botão de ação */}
            <div className="flex justify-end gap-4 mt-8">
                <div className="h-12 bg-gray-300 rounded-lg w-24"></div>
            </div>
        </div>
    );
}