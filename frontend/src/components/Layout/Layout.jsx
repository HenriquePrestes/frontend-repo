import { Outlet } from 'react-router-dom';
import Header from "../Header/Header"

export default function Layout() {
    return (
        <div className="w-full max-w-[1440px] mx-auto min-h-screen px-4 sm:px-6 lg:px-8">
            <Header />
            <main>
                <div className="">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}