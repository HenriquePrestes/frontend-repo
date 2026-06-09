const fetchAddress = async (cep) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
    const data = await response.json();
    if (!data.erro) {
      return {
        street: data.logradouro || "",
        city: data.localidade || "",
        state: data.uf || "",
      };
    } else {
      return null; // CEP inválido
    }
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
};

export default fetchAddress;
