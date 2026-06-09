import { Link } from "react-router-dom";

export default function Login({ children }) {
    return (
        <Link 
            to="/login" 
            className="bg-white border-2 border-primary text-1xl flex justify-center items-center py-4 px-12 rounded-lg font-bold hover:bg-green-50 transition-all"
        >
            {children}
        </Link>
    )
}