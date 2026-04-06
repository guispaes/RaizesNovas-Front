// 1. Definição da URL Base da sua API no Render
const API_BASE_URL = 'https://raizesnovas-api.onrender.com/api';

/**
 * 2. Funções Utilitárias (Opcional, mas profissional)
 * Aqui você pode criar funções que facilitam as chamadas Fetch
 * para não ter que repetir os Headers em todo lugar.
 */
const api = {
    // Função para GET (buscar dados)
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`Erro ao buscar: ${response.status}`);
        return await response.json();
    },

    // Função para POST (enviar dados, como o formulário do TinyMCE)
    post: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Erro ao enviar: ${response.status}`);
        return await response.json();
    }
};