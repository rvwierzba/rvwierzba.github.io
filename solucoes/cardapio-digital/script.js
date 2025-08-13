// Aguarda o documento HTML ser completamente carregado para começar a rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // !!! MUITO IMPORTANTE: COLE A URL DA SUA API DO APPS SCRIPT AQUI DENTRO DAS ASPAS !!!
    const API_URL = 'https://script.google.com/macros/s/AKfycbxWixbImDeyOeBKm5PkD70a97g_KcY8jjAncwP01vyVnBrRdZKGo5ged3_mYKkPNdOf/exec';

   const loadingElement = document.getElementById('loading');
    const cardapioContainer = document.getElementById('cardapio-container');
    const formNovoItem = document.getElementById('form-novo-item');
    let cardapioData = []; // Variável para guardar nossos dados

    // Função que renderiza o cardápio na tela
    function renderCardapio() {
        cardapioContainer.innerHTML = ''; // Limpa o container
        if (!cardapioData || cardapioData.length === 0) {
            cardapioContainer.innerHTML = '<p class="text-center">Nenhum item no cardápio. Adicione um acima!</p>';
            return;
        }

        const categorias = cardapioData.reduce((acc, item) => {
            const categoria = item.categoria || 'Outros';
            if (!acc[categoria]) acc[categoria] = [];
            acc[categoria].push(item);
            return acc;
        }, {});

        for (const nomeCategoria in categorias) {
            let categoriaHtml = `<h2 class="categoria-titulo">${nomeCategoria}</h2>`;
            categorias[nomeCategoria].forEach(item => {
                const precoFormatado = parseFloat(item.preco).toFixed(2).replace('.', ',');
                categoriaHtml += `
                    <div class="item-cardapio">
                        <h5>${item.nome}</h5>
                        <p class="mb-1">${item.descricao}</p>
                        <strong>R$ ${precoFormatado}</strong>
                    </div>
                `;
            });
            cardapioContainer.innerHTML += categoriaHtml;
        }
    }

    // Função para carregar os dados iniciais
    async function carregarDadosIniciais() {
        const dadosLocais = localStorage.getItem('cardapioDemoData');
        if (dadosLocais) {
            cardapioData = JSON.parse(dadosLocais);
            loadingElement.style.display = 'none';
            renderCardapio();
        } else {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                cardapioData = data.cardapio;
                localStorage.setItem('cardapioDemoData', JSON.stringify(cardapioData));
                loadingElement.style.display = 'none';
                renderCardapio();
            } catch (error) {
                loadingElement.innerHTML = `<div class="alert alert-danger"><strong>Ops!</strong> Não foi possível carregar o modelo de cardápio.</div>`;
                console.error('Erro ao buscar dados da API:', error);
            }
        }
    }

    // Lida com o envio do formulário
    formNovoItem.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede que a página recarregue

        const novoItem = {
            id: 'local_' + Date.now(), // ID único local
            nome: document.getElementById('nome-item').value,
            categoria: document.getElementById('categoria-item').value,
            descricao: document.getElementById('descricao-item').value,
            preco: parseFloat(document.getElementById('preco-item').value)
        };

        cardapioData.push(novoItem); // Adiciona ao nosso array
        localStorage.setItem('cardapioDemoData', JSON.stringify(cardapioData)); // Salva no navegador
        renderCardapio(); // Re-renderiza a lista
        formNovoItem.reset(); // Limpa o formulário
    });

    // Inicia tudo
    carregarDadosIniciais();
});
