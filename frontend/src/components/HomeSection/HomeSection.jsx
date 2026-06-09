import Register from "../Buttons/Register";
import Login from "../Buttons/Login";
import Navbar from "../Navbar/Navbar";
import SliderSection from "../SliderSection/SliderSection";
import ContactSection from "../ContactSection/ContactSection";
import { Link } from "react-router-dom";

export default function HomeSection() {
    return (
        <div className="font-inter">

            <Navbar />

            <div className="flex flex-col bg-green-50 items-center justify-center px-16">

                <div className="flex flex-row text-center py-20">

                    <div className="flex flex-col text-primary gap-8 tracking-tight">
                        <h1 className="text-5xl font-semibold">Consulta marcada em menos de 1 minuto</h1>
                        <p className="text-3xl">Especialistas de confiança a poucos cliques
                            de você. Simples, rápido e sem
                            complicações.</p>

                        <div className=" text-primary text-1xl flex justify-center gap-5">
                            <Register>Agendar consulta</Register>
                            <Login>Entrar</Login>
                        </div>
                    </div>
                    {/* <img src="/images/backgroundImage.png" alt="Descrição da imagem" /> */}
                </div>
            </div >

            <SliderSection />
            <ContactSection />
        </div>
    )
}