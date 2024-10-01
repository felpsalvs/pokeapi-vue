import axios from "axios";

const API_URL = "https://pokeapi.co/api/v2";

export const getPokemonList = async (limit: number, offset: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/pokemon?limit=${limit}&offset=${offset}`,
    );
    console.log(response.data);
    return response;
  } catch (error) {
    console.error("Erro ao buscar lista de Pokémon", error);
    throw error;
  }
};

export const getPokemonDetails = (nameOrId: string | number) => {
  return axios.get(`${API_URL}/pokemon/${nameOrId}`);
};

export const getPokemonByType = (type: string) => {
  return axios.get(`${API_URL}/type/${type}`);
};

export const getPokemonEvolutionChain = (id: number) => {
  return axios.get(`${API_URL}/evolution-chain/${id}`);
};
