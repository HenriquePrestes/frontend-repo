const SkeletonBlock = ({ className }) => (
    <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

export default function DashboardSkeleton() {
    return (
        <div className="w-full gap-8 mt-6 bg-white p-6 rounded-lg shadow-md">
            {/* Skeleton do Cabeçalho */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <SkeletonBlock className="h-8 w-64 mb-2" />
                    <SkeletonBlock className="h-4 w-80" />
                </div>
                <SkeletonBlock className="h-10 w-28" />
            </div>

            {/* Skeleton das Abas */}
            <div className="flex border-b w-fit mb-6">
                <SkeletonBlock className="h-10 w-24 mr-4" />
                <SkeletonBlock className="h-10 w-24 mr-4" />
                <SkeletonBlock className="h-10 w-24 mr-4" />
                <SkeletonBlock className="h-10 w-24" />
            </div>
            
            {/* Skeleton do Conteúdo da Aba */}
            <div className="space-y-6">
                {/* Skeleton dos StatCards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SkeletonBlock className="h-24" />
                    <SkeletonBlock className="h-24" />
                    <SkeletonBlock className="h-24" />
                    <SkeletonBlock className="h-24" />
                </div>

                {/* Skeleton da Lista de Agendamentos */}
                <div className="p-4 space-y-4">
                    <SkeletonBlock className="h-6 w-1/3 mb-4" />
                    <SkeletonBlock className="h-20 w-full" />
                    <SkeletonBlock className="h-20 w-full" />
                    <SkeletonBlock className="h-20 w-full" />
                </div>
            </div>
        </div>
    );
}