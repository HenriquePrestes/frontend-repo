export default function StatCard({ title, value, description, icon }) {
    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">{title}</h4>
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
        </div>
    );
}