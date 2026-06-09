import { useTheme } from "../../context/useTheme";
import { useState } from "react"; 
import LogoUploader from "../../components/Admin/LogoUploader/LogoUploader";
import { SketchPicker } from "react-color";

export default function BrandingPage() {
    const { theme, updateTheme, resetTheme } = useTheme();
    const [clinicName, setClinicName] = useState("");
    const [showPickers, setShowPickers] = useState({ primary: false, secondary: false });

    const handleLogoChange = (file, url) => {
        updateTheme({ logo: url });
    };

    const handleSave = async () => {
        const body = {
            clinicName,
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            logo: theme.logo,
        };

        try {
            const response = await fetch("/api/branding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
        });
        const data = await response.json();
        console.log("Configurações salvas com sucesso:", data);
    } catch (error) {
        console.error("Erro ao salvar configurações:", error);
  }
};

    return(
            <div className="space-y-6">
                {/* Tab Header */}
                <header className="mb-6">
                <h1 className="text-xl font-semibold">Personalização da Marca</h1>
                <p className="text-sm text-slate-500 mt-1">Customize a aparência da plataforma com a identidade visual da sua clínica</p>
                </header>

                <div className="py-4 border-b border-gray-200 space-y-6">
                {/* Nome da Clínica */}
                <div>
                    <p className="font-semibold block mb-2">Nome da Clínica</p>
                    <input
                    value={theme.clinicName}
                    onChange={(e) => updateTheme({ clinicName: e.target.value })} //atualiza direto no tema global
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    type="text"
                    placeholder="Ex: Clínica São Victor"
                    />
                </div>

                {/* Cor Primária */}
                <div>
                <p className="font-semibold mb-2">Cor Primária</p>
                <div
                className="w-10 h-10 border rounded-md cursor-pointer"
                style={{ backgroundColor: theme.primaryColor }}
                onClick={() =>
                    setShowPickers((prev) => ({ ...prev, primary: !prev.primary }))
                }
                ></div>
                {showPickers.primary && (
                    <div className="relative">
                        <div className="fixed inset-0 z-10" onClick={() => setShowPickers((p) => ({ ...p, primary: false }))}/>
                        <div className="absolute z-20 mt-2">
                            <SketchPicker
                                color={theme.primaryColor}
                                onChangeComplete={(color) => updateTheme({ primaryColor: color.hex })}
                            />
                        </div>
                    </div>
                )}
                </div>

                {/* Cor Secundária */}
                <div>
                <p className="font-semibold mb-2">Cor Secundária</p>
                <div
                    className="w-10 h-10 border rounded-md cursor-pointer"
                    style={{ backgroundColor: theme.secondaryColor }}
                    onClick={() =>
                        setShowPickers((prev) => ({ ...prev, secondary: !prev.secondary }))
                    }
                ></div>
                {showPickers.secondary && (
                    <div className="relative">
                        <div className="fixed inset-0 z-10" onClick={() => setShowPickers((p) => ({ ...p, secondary: false }))}/>
                        <div className="absolute z-20 mt-2">
                        <SketchPicker
                        color={theme.secondaryColor}
                        onChangeComplete={(color) => updateTheme({ secondaryColor: color.hex })}
                        />
                    </div>
                </div>
                )}
                </div>

                {/* Logo da Clínica */}
                <LogoUploader onChange={handleLogoChange} previewUrl={theme.logo} />

                {/* Preview do tema selecionado */}
                <div className="mt-8 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                    <p className="font-semibold mb-4">Pré-visualização do tema</p>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 rounded-lg font-medium text-white" style={{ backgroundColor: theme.primaryColor }}>Botão Primário</button>
                        <button className="px-4 py-2 rounded-lg font-medium text-white" style={{ backgroundColor: theme.secondaryColor }}>Botão Secundário</button>
                    </div>
                </div>

                {/* Botão de Salvar */}
                <div className="flex gap-3 mt-6">
                <button onClick={() => console.log("Configurações salvas!")} className="mt-6 px-5 py-2 rounded-md font-semibold text-white bg-[var(--primary-color)]" style={{ backgroundColor: "var(--primary-color)", }} onMouseEnter={(e) => (e.target.style.backgroundColor = "var(--secondary-color)")} onMouseLeave={(e) => (e.target.style.backgroundColor = "var(--primary-color)")}> Salvar </button>
                
                {/* Restaurar Padrão */}
                <button onClick={resetTheme} className="mt-6 px-5 py-2 rounded-md font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 transition">Restaurar padrão</button>
                </div>
            </div>
        </div>
    );
}