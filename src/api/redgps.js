import axios from 'axios';

export async function loginRedGps(username, password) {
    const response = await axios.post('https://api.redgps.com.br/v1/auth/login', {
        username,
        password
    });
    return response.data;
}

export async function getAssets(token) {
    const response = await axios.get('https://api.redgps.com.br/v1/assets', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
}

// Função para atualizar o km dos veículos no seu sistema
export async function atualizarKmDosVeiculos(store, username, password) {
    // Autentica e obtém o token
    const loginData = await loginRedGps(username, password);
    const token = loginData.token || loginData.access_token || loginData.data?.token;
    if (!token) throw new Error('Token de autenticação não encontrado!');

    // Busca os ativos (veículos)
    const assets = await getAssets(token);
    // Atualiza o store com o km de cada veículo
    assets.forEach(asset => {
        const veiculo = store.vehicles.find(v => v.id === asset.id);
        if (veiculo) {
            // Ajuste o campo conforme o retorno real da API
            veiculo.kmAtual = asset.odometer || asset.km || asset.mileage || 0;
        }
    });
    return assets;
}