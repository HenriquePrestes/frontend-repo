import { Link } from "react-router-dom";

export default function Register({ children }) {
    return (
        <Link 
            to="/register" 
            className="bg-primary text-white flex text-1xl justify-center items-center py-4 px-12 rounded-lg font-inter font-bold hover:bg-[#4f9e8a] transition-all"
        >
            {children}
        </Link>
    )
}