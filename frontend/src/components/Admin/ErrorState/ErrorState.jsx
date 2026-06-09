import { FaExclamationTriangle } from 'react-icons/fa';

export default function ErrorState({ message, onRetry }) {
    return (
        <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
            <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-lg font-medium text-red-800">Oops! Algo deu errado.</h3>
            <div className="mt-2 text-sm text-red-700">
                <p>{message}</p>
            </div>
            <div className="mt-6">
                <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Tentar Novamente
                </button>
            </div>
        </div>
    );
}