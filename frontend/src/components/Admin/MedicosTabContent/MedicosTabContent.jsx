import React, { useEffect, useState } from "react";
import { doctorService } from "../../../services/doctorService";
import { especialidadeService } from "../../../services/especialidadeService";
import DoctorCardAdmin from "../../DoctorCardAdmin/DoctorCardAdmin";
import CloseIcon from "../../CloseIcon/CloseIcon";
import SearchableSelect from "../../SearchableSelect/SearchableSelect";
import fetchAddress from "../../FetchAddress/fetchAddress";

export default function MedicosTabContent() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingMedicos, setLoadingMedicos] = useState(true);
  const [especialidadesLista, setEspecialidadesLista] = useState([]);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(true);
  const [medicos, setMedicos] = useState([]);
  const [editingMedico, setEditingMedico] = useState(null);
  const [horarios, setHorarios] = useState([
    { diaSemana: "MONDAY", horaInicio: "08:00", horaFim: "17:00", descricao: "Segunda-feira" }
  ]);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "", // Campo obrigatório no backend, mas será preenchido automaticamente
    email: "",
    senha: "123456", // Senha padrão temporária
    celular: "",
    dataNascimento: "",
    crm: "",
    especialidadeId: "",
    foto: "",
    duracaoConsultaMinutos: 30,
    horariosTrabalho: []
  });
  const [editFormData, setEditFormData] = useState({
    id: "",
    nomeCompleto: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    dataCadastro: "",
    telefone: "",
    celular: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    senha: "",
    especialidadeId: "",
    crm: "",
    foto: "",
    duracaoConsultaMinutos: 30,
  });
  const [editHorarios, setEditHorarios] = useState([
    { diaSemana: "MONDAY", horaInicio: "08:00", horaFim: "17:00", descricao: "Segunda-feira" }
  ]);

  
  useEffect(() => {
    fetchMedicos();
    fetchEspecialidades();
  }, []);

  const fetchEspecialidades = async () => {
    try {
      setLoadingEspecialidades(true);
      const data = await especialidadeService.getAllEspecialidades();
      setEspecialidadesLista(data); 
    } catch (error) {
      console.error("Erro ao buscar especialidades:", error);
    } finally {
      setLoadingEspecialidades(false);
    }
  };

  // Auto-preenchimento de endereço via CEP
  useEffect(() => {
    const loadAddress = async () => {
      const cepOnlyNumbers = editFormData.cep?.replace(/\D/g, "");
      if (cepOnlyNumbers?.length === 8) {
        const address = await fetchAddress(cepOnlyNumbers);
        if (address) {
          setEditFormData((prev) => ({
            ...prev,
            rua: address.street || prev.rua,
            cidade: address.city || prev.cidade,
            estado: address.state || prev.estado,
          }));
        }
      }
    };

    loadAddress();
  }, [editFormData.cep]);

  const fetchMedicos = async () => {
    setLoadingMedicos(true);
    try {
      console.log("Iniciando busca de médicos...");
      
      // Tenta primeiro o endpoint sem paginação
      let data;
      try {
        console.log("Tentando endpoint /api/medicos/all...");
        data = await doctorService.getAllDoctors();
        console.log("Resposta de /all:", data);
        
        if (Array.isArray(data)) {
          console.log(`Encontrados ${data.length} médicos via /all`);
          setMedicos(data);
          return;
        }
      } catch (allError) {
        console.log("Endpoint /all falhou, tentando paginado:", allError.message);
      }
      
      // Se falhar, tenta o endpoint paginado
      console.log("Tentando endpoint paginado...");
      data = await doctorService.getDoctors();
      console.log("Resposta paginada:", data);
      console.log("Tipo da resposta:", typeof data);
      console.log("É array?", Array.isArray(data));
      
      // Processa resposta paginada
      if (data && data.content && Array.isArray(data.content)) {
        console.log("Dados paginados encontrados, content:", data.content);
        setMedicos(data.content);
      } else if (Array.isArray(data)) {
        console.log("Array direto encontrado:", data);
        setMedicos(data);
      } else {
        console.log("Formato não reconhecido, definindo array vazio");
        console.log("Estrutura recebida:", Object.keys(data || {}));
        setMedicos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar médicos:", error);
      console.error("Detalhes do erro:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setMedicos([]); // Garante que seja um array vazio em caso de erro
    } finally {
      setLoadingMedicos(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEspecialidadeChange = (e) => {
    const selectedNome = e.target.value;
    const selectedEspecialidade = especialidadesLista.find(esp => esp.nome === selectedNome);
    setFormData((prev) => ({
      ...prev,
      especialidadeId: selectedEspecialidade ? selectedEspecialidade.id : "",
    }));
  };

  const handleEditEspecialidadeChange = (e) => {
    const selectedNome = e.target.value;
    const selectedEspecialidade = especialidadesLista.find(esp => esp.nome === selectedNome);
    setEditFormData((prev) => ({
      ...prev,
      especialidadeId: selectedEspecialidade ? selectedEspecialidade.id : "",
    }));
  };

  const openEditModal = async (medico) => {
    setLoadingEdit(true);
    try {
      // Busca os dados básicos do médico
      const fullMedicoData = await doctorService.getDoctorById(medico.id);
      setEditingMedico(fullMedicoData);
      
      // Busca os horários do médico separadamente
      let horariosMedico = [];
      try {
        horariosMedico = await doctorService.getDoctorSchedule(medico.id);
        console.log("Horários carregados:", horariosMedico);
      } catch (horarioError) {
        console.log("Erro ao carregar horários, usando horários do médico:", horarioError);
        // Fallback para horários que podem vir junto com os dados do médico
        horariosMedico = fullMedicoData.horariosTrabalho || [];
      }
      
      // Extrair o ID da especialidade corretamente
      let especialidadeId = "";
      if (fullMedicoData.especialidadeId) {
        // Se vier diretamente o ID
        especialidadeId = fullMedicoData.especialidadeId;
      } else if (fullMedicoData.especialidade && typeof fullMedicoData.especialidade === 'object' && fullMedicoData.especialidade.id) {
        // Se vier o objeto Especialidade completo
        especialidadeId = fullMedicoData.especialidade.id;
      } else if (fullMedicoData.especialidade && typeof fullMedicoData.especialidade === 'string') {
        // Se vier como string (nome), procurar na lista de especialidades
        const especialidadeEncontrada = especialidadesLista.find(esp => esp.nome === fullMedicoData.especialidade);
        especialidadeId = especialidadeEncontrada ? especialidadeEncontrada.id : "";
      }

      setEditFormData({
        id: fullMedicoData.id,
        nomeCompleto: fullMedicoData.nomeCompleto || "",
        email: fullMedicoData.email || "",
        cpf: fullMedicoData.cpf || "",
        dataNascimento: fullMedicoData.dataNascimento || "",
        dataCadastro: fullMedicoData.dataCadastro || "",
        telefone: fullMedicoData.celular || "",
        celular: fullMedicoData.celular || "",
        cep: fullMedicoData.cep || "",
        rua: fullMedicoData.rua || "",
        numero: fullMedicoData.numero || "",
        complemento: fullMedicoData.complemento || "",
        cidade: fullMedicoData.cidade || "",
        estado: fullMedicoData.estado || "",
        senha: "",
        especialidadeId: especialidadeId,
        crm: fullMedicoData.crm || "",
        foto: fullMedicoData.foto || "",
        duracaoConsultaMinutos: fullMedicoData.duracaoConsultaMinutos || 30,
      });
      
      // Configura os horários de trabalho para edição
      if (horariosMedico && horariosMedico.length > 0) {
        const horariosFormatados = horariosMedico.map(horario => ({
          id: horario.id, // Incluir ID para identificar horários existentes
          diaSemana: horario.diaSemana,
          horaInicio: horario.horaInicio ? horario.horaInicio.substring(0, 5) : "08:00",
          horaFim: horario.horaFim ? horario.horaFim.substring(0, 5) : "17:00",
          descricao: horario.descricao || "Atendimento"
        }));
        setEditHorarios(horariosFormatados);
      } else {
        console.log("Nenhum horário encontrado, usando horário padrão");
        setEditHorarios([
          { diaSemana: "MONDAY", horaInicio: "08:00", horaFim: "17:00", descricao: "Segunda-feira" }
        ]);
      }
      setShowEditModal(true);
    } catch (error) {
      console.error("Erro ao buscar dados do médico:", error);
      // Fallback to the list data if API fails
      setEditingMedico(medico);
      setEditFormData({
        id: medico.id,
        nomeCompleto: medico.nomeCompleto || "",
        email: medico.email || "",
        cpf: medico.cpf || "",
        dataNascimento: medico.dataNascimento || "",
        dataCadastro: medico.dataCadastro || "",
        telefone: medico.telefone || "",
        celular: medico.celular || "",
        cep: medico.cep || "",
        rua: medico.rua || "",
        numero: medico.numero || "",
        complemento: medico.complemento || "",
        cidade: medico.cidade || "",
        estado: medico.estado || "",
        senha: "",
        especialidadeId: medico.especialidadeId || "",
        crm: medico.crm || "",
        foto: medico.foto || "",
        duracaoConsultaMinutos: medico.duracaoConsultaMinutos || 30,
      });
      
      // Fallback para horários - tenta buscar dos dados da lista ou usa padrão
      console.log("Usando fallback para horários");
      if (medico.horariosTrabalho && medico.horariosTrabalho.length > 0) {
        const horariosFormatados = medico.horariosTrabalho.map(horario => ({
          id: horario.id,
          diaSemana: horario.diaSemana,
          horaInicio: horario.horaInicio ? horario.horaInicio.substring(0, 5) : "08:00",
          horaFim: horario.horaFim ? horario.horaFim.substring(0, 5) : "17:00",
          descricao: horario.descricao || "Atendimento"
        }));
        setEditHorarios(horariosFormatados);
      } else {
        setEditHorarios([
          { diaSemana: "MONDAY", horaInicio: "08:00", horaFim: "17:00", descricao: "Segunda-feira" }
        ]);
      }
      setShowEditModal(true);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gera um CPF automático (apenas para satisfazer o backend)
      const cpfGerado = `${Math.floor(Math.random() * 100000000000).toString().padStart(11, '0')}`;
      
      // Prepara os horários de trabalho no formato correto
      const horariosFormatados = horarios.map(horario => ({
        descricao: horario.descricao,
        diaSemana: horario.diaSemana,
        horaInicio: horario.horaInicio + ":00", // Formato "HH:mm:ss"
        horaFim: horario.horaFim + ":00" // Formato "HH:mm:ss"
      }));

      const dadosEnvio = {
        ...formData,
        cpf: cpfGerado, // CPF gerado automaticamente
        horariosTrabalho: horariosFormatados
      };

      await doctorService.createDoctor(dadosEnvio);
      console.log("Médico criado com sucesso");

      await fetchMedicos();

      // Reset do formulário
      setFormData({
        nomeCompleto: "",
        cpf: "",
        email: "",
        senha: "123456",
        celular: "",
        dataNascimento: "1990-01-01",
        crm: "",
        especialidade: "",
        foto: "",
        duracaoConsultaMinutos: 30,
        horariosTrabalho: []
      });
      setHorarios([
        { diaSemana: "MONDAY", horaInicio: "08:00", horaFim: "17:00", descricao: "Segunda-feira" }
      ]);
      setShowModal(false);

      alert("Médico adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar médico:", error);
      alert("Erro ao adicionar médico. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparar dados para envio, removendo campos que não existem no DTO
      const { telefone, dataCadastro, ...dadosParaEnvio } = editFormData;
      
      // Remover ou limpar campos vazios que podem causar problemas de validação
      Object.keys(dadosParaEnvio).forEach(key => {
        if (dadosParaEnvio[key] === "" || dadosParaEnvio[key] === null || dadosParaEnvio[key] === undefined) {
          delete dadosParaEnvio[key];
        }
      });
      
      // Preparar horários no formato correto
      const horariosFormatados = editHorarios.map(horario => ({
        descricao: horario.descricao,
        diaSemana: horario.diaSemana,
        horaInicio: horario.horaInicio + ":00", // Formato "HH:mm:ss"
        horaFim: horario.horaFim + ":00" // Formato "HH:mm:ss"
      }));
      
      // Adicionar horários aos dados
      dadosParaEnvio.horariosTrabalho = horariosFormatados;
      
      console.log("Dados sendo enviados para atualização:", dadosParaEnvio);
      const response = await doctorService.updateDoctor(
        editFormData.id,
        dadosParaEnvio
      );
      console.log("Médico atualizado com sucesso:", response);

      await fetchMedicos();

      setShowEditModal(false);
      setEditingMedico(null);

      alert("Médico atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar médico:", error);
      alert("Erro ao atualizar médico. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // função para remover médico
  const handleRemoveMedico = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este médico?")) return;

    try {
      await doctorService.deleteDoctor(id);
      setMedicos((prev) => prev.filter((m) => m.id !== id));
      alert("Médico removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover médico:", error);
      alert("Erro ao excluir médico. Tente novamente.");
    }
  };

  // Função para adicionar novo horário
  const adicionarHorario = () => {
    setHorarios([...horarios, { 
      diaSemana: "MONDAY", 
      horaInicio: "08:00", 
      horaFim: "17:00", 
      descricao: "Novo horário" 
    }]);
  };

  // Função para remover horário
  const removerHorario = (index) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  // Função para atualizar horário
  const atualizarHorario = (index, field, value) => {
    const novosHorarios = [...horarios];
    novosHorarios[index][field] = value;
    setHorarios(novosHorarios);
  };

  // Funções para gerenciar horários na edição
  const adicionarEditHorario = () => {
    setEditHorarios([...editHorarios, { 
      diaSemana: "MONDAY", 
      horaInicio: "08:00", 
      horaFim: "17:00", 
      descricao: "Novo horário" 
    }]);
  };

  const removerEditHorario = (index) => {
    setEditHorarios(editHorarios.filter((_, i) => i !== index));
  };

  const atualizarEditHorario = (index, field, value) => {
    const novosHorarios = [...editHorarios];
    novosHorarios[index][field] = value;
    setEditHorarios(novosHorarios);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com botão */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Gerenciar Médicos</h3>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer"
        >
          Adicionar Novo Médico
        </button>
      </div>

      {/* Modal de Criação */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-5 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto max-h-[95vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Adicionar Novo Médico</h2>
                <CloseIcon onClick={() => setShowModal(false)} />
              </div>
              <p className="text-gray-600 mt-1">
                Preencha as informações do profissional
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Dados Básicos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleInputChange}
                  placeholder="Dr. João Silva"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="doutor@clinica.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Celular *
                </label>
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CRM *
                </label>
                <input
                  type="text"
                  name="crm"
                  value={formData.crm}
                  onChange={handleInputChange}
                  placeholder="123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <SearchableSelect
                  label="Especialidade *"
                  name="especialidadeId"
                  value={especialidadesLista.find(esp => esp.id === formData.especialidadeId)?.nome || ""}
                  onChange={handleEspecialidadeChange}
                  options={especialidadesLista.map(esp => esp.nome)}
                  placeholder={loadingEspecialidades ? "Carregando..." : "Selecione a especialidade"}
                  searchPlaceholder="Buscar especialidade..."
                  required
                  labelClassName="block text-sm font-medium text-gray-700 mb-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração da Consulta (minutos) *
                </label>
                <input
                  type="number"
                  name="duracaoConsultaMinutos"
                  value={formData.duracaoConsultaMinutos}
                  onChange={handleInputChange}
                  placeholder="30"
                  min="15"
                  max="180"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Horários de Trabalho */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Horários de Trabalho *
                  </label>
                  <button
                    type="button"
                    onClick={adicionarHorario}
                    className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200"
                  >
                    + Adicionar Horário
                  </button>
                </div>
                
                {horarios.map((horario, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Dia da Semana
                        </label>
                        <select
                          value={horario.diaSemana}
                          onChange={(e) => atualizarHorario(index, 'diaSemana', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="MONDAY">Segunda-feira</option>
                          <option value="TUESDAY">Terça-feira</option>
                          <option value="WEDNESDAY">Quarta-feira</option>
                          <option value="THURSDAY">Quinta-feira</option>
                          <option value="FRIDAY">Sexta-feira</option>
                          <option value="SATURDAY">Sábado</option>
                          <option value="SUNDAY">Domingo</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Hora Início
                        </label>
                        <input
                          type="time"
                          value={horario.horaInicio}
                          onChange={(e) => atualizarHorario(index, 'horaInicio', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Hora Fim
                        </label>
                        <input
                          type="time"
                          value={horario.horaFim}
                          onChange={(e) => atualizarHorario(index, 'horaFim', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removerHorario(index)}
                          className="w-full bg-red-100 text-red-600 px-2 py-1 rounded text-sm hover:bg-red-200"
                          disabled={horarios.length === 1}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Descrição
                      </label>
                      <input
                        type="text"
                        value={horario.descricao}
                        onChange={(e) => atualizarHorario(index, 'descricao', e.target.value)}
                        placeholder="Ex: Atendimento geral"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Adicionando..." : "Adicionar Médico"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-5 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Editar Médico</h2>
                <CloseIcon onClick={() => setShowEditModal(false)} />
              </div>
            </div>

            {loadingEdit ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando dados do médico...</p>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {/* Dados Básicos */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Dados Básicos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="nomeCompleto"
                      value={editFormData.nomeCompleto}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={editFormData.cpf}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      name="dataNascimento"
                      value={editFormData.dataNascimento}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Cadastro
                    </label>
                    <input
                      type="text"
                      value={editFormData.dataCadastro}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Contato
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Celular
                    </label>
                    <input
                      type="tel"
                      name="celular"
                      value={editFormData.celular}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Endereço
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CEP
                    </label>
                    <input
                      type="text"
                      name="cep"
                      value={editFormData.cep}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rua
                      </label>
                      <input
                        type="text"
                        name="rua"
                        value={editFormData.rua}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        name="numero"
                        value={editFormData.numero}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complemento (opcional)
                    </label>
                    <input
                      type="text"
                      name="complemento"
                      value={editFormData.complemento}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        value={editFormData.cidade}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        name="estado"
                        value={editFormData.estado}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Profissionais */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Dados Profissionais
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <SearchableSelect
                      label="Especialidade *"
                      name="especialidadeId"
                      value={especialidadesLista.find(esp => esp.id === editFormData.especialidadeId)?.nome || ""}
                      onChange={handleEditEspecialidadeChange}
                      options={especialidadesLista.map(esp => esp.nome)}
                      placeholder={loadingEspecialidades ? "Carregando..." : "Selecione a especialidade"}
                      searchPlaceholder="Buscar especialidade..."
                      required
                      labelClassName="block text-sm font-medium text-gray-700 mb-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CRM *
                    </label>
                    <input
                      type="text"
                      name="crm"
                      value={editFormData.crm}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duração da Consulta (min) *
                    </label>
                    <input
                      type="number"
                      name="duracaoConsultaMinutos"
                      value={editFormData.duracaoConsultaMinutos}
                      onChange={handleEditInputChange}
                      placeholder="30"
                      min="15"
                      max="180"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto
                    </label>
                    <input
                      type="text"
                      name="foto"
                      value={editFormData.foto}
                      onChange={handleEditInputChange}
                      placeholder="URL da foto"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Horários de Trabalho */}
              <div>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800">Horários de Trabalho</h4>
                  <button
                    type="button"
                    onClick={adicionarEditHorario}
                    className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200"
                  >
                    + Adicionar Horário
                  </button>
                </div>
                
                {editHorarios.map((horario, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Dia da Semana
                        </label>
                        <select
                          value={horario.diaSemana}
                          onChange={(e) => atualizarEditHorario(index, 'diaSemana', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="MONDAY">Segunda-feira</option>
                          <option value="TUESDAY">Terça-feira</option>
                          <option value="WEDNESDAY">Quarta-feira</option>
                          <option value="THURSDAY">Quinta-feira</option>
                          <option value="FRIDAY">Sexta-feira</option>
                          <option value="SATURDAY">Sábado</option>
                          <option value="SUNDAY">Domingo</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Hora Início
                        </label>
                        <input
                          type="time"
                          value={horario.horaInicio}
                          onChange={(e) => atualizarEditHorario(index, 'horaInicio', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Hora Fim
                        </label>
                        <input
                          type="time"
                          value={horario.horaFim}
                          onChange={(e) => atualizarEditHorario(index, 'horaFim', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removerEditHorario(index)}
                          className="w-full bg-red-100 text-red-600 px-2 py-1 rounded text-sm hover:bg-red-200"
                          disabled={editHorarios.length === 1}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Descrição
                      </label>
                      <input
                        type="text"
                        value={horario.descricao}
                        onChange={(e) => atualizarEditHorario(index, 'descricao', e.target.value)}
                        placeholder="Ex: Atendimento geral"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}

      {/* Lista de Médicos */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold">Lista de Médicos</h4>
        </div>
        <div className="p-6">
          {loadingMedicos ? (
            <p className="text-gray-500 text-center py-8">
              Carregando médicos...
            </p>
          ) : !Array.isArray(medicos) || medicos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum médico cadastrado ainda.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicos.map((medico) => (
                <DoctorCardAdmin
                  key={medico.id}
                  medico={medico}
                  openEditModal={openEditModal}
                  handleRemoveMedico={handleRemoveMedico}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
