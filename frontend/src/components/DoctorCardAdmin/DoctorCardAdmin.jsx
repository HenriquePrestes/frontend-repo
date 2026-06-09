import UserIcon from "../UserIcon/UserIcon";
import EmailIcon from "../EmailIcon/EmailIcon";
import PhoneIcon from "../PhoneIcon/PhoneIcon";

function DoctorCardAdmin({ medico, openEditModal, handleRemoveMedico }) {
  return (
    <div
      key={medico.id}
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        {/* Header do Card */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <UserIcon />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openEditModal(medico)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => handleRemoveMedico(medico.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
            >
              Excluir
            </button>
          </div>
        </div>

        {/* Informações do Médico */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {medico.nomeCompleto || `${medico.nome} ${medico?.sobrenome}` || "Nome não informado"}
            </h3>
            <p className="text-sm text-gray-600">
              CRM: {medico.crm || "Não informado"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {medico.especialidade || "Especialidade não informada"}
            </span>
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <EmailIcon />
              <span>{medico.email || "Email não informado"}</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon />
              <span>
                {medico.telefone || medico.celular || "Telefone não informado"}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">Status</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Ativo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorCardAdmin;
