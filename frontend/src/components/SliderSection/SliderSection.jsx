import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

const SliderSection = () => {
    const cards = [
        {
            img: "/doctor.png",
            title: "Para pacientes",
            text: "Garanta a liberdade de marcar sua consulta a qualquer hora, sem filas ou ligações intermináveis.",
        },
        {
            img: "/todoctor.png",
            title: "Para clínicas",
            text: "Organize sua agenda de forma inteligente e aumente a produtividade da sua equipe.",
        },
        {
            img: "/clinic.png",
            title: "Para médicos",
            text: "Gerencie seus atendimentos com praticidade e ofereça uma experiência melhor para seus pacientes.",
        },
    ];

    return (
        <div className="flex flex-col justify-center items-center px-6 md:px-16 py-10 text-primary">
            {/* Título e descrição */}
            <h1 className="text-3xl font-semibold">Agende. Gerencie. Cuide.</h1>
            <p className="py-4 text-md text-center max-w-2xl">
                Nosso sistema conecta pacientes, médicos e clínicas em um único lugar,
                simplificando o agendamento e o gerenciamento de consultas de forma
                rápida, ágil e sem complicações.
            </p>

            {/* Swiper (apenas mobile < md) */}
            <div className="w-full max-w-4xl mt-8 md:hidden">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                >
                    {cards.map((card, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex items-center gap-6 p-6 border rounded-2xl shadow-sm bg-white">
                                <img
                                    src={card.img}
                                    alt={card.title}
                                    className="w-28 h-28 object-contain"
                                />
                                <div>
                                    <h2 className="text-xl font-semibold">{card.title}</h2>
                                    <p className="text-md mt-2">{card.text}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* md: cards empilhados */}
            <div className="hidden md:flex flex-col gap-6 mt-8 lg:hidden w-full max-w-5xl">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-6 p-6 border rounded-2xl shadow-sm bg-white"
                    >
                        <img
                            src={card.img}
                            alt={card.title}
                            className="w-28 h-28 object-contain"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{card.title}</h2>
                            <p className="text-md mt-2">{card.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* lg+: cards lado a lado */}
            <div className="hidden lg:flex lg:flex-row lg:gap-8 mt-8 w-full">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-6 p-6 border rounded-2xl shadow-sm bg-white flex-1"
                    >
                        <img
                            src={card.img}
                            alt={card.title}
                            className="w-28 h-28 object-contain"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{card.title}</h2>
                            <p className="text-md mt-2">{card.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SliderSection;
