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
            const categoria = item.categoria || 'Outros'; // Se um item não tiver categoria, vai para "Outros"
            if (!acc[categoria]) {
                acc[categoria] = [];
            }
            acc[categoria].push(item);
            return acc;
        }, {});

        for (const nomeCategoria in categorias) {
            let categoriaHtml = `<h2 class="categoria-titulo">${nomeCategoria}</h2>`;
            categorias[nomeCategoria].forEach(item => {
                const precoFormatado = parseFloat(item.preco).toFixed(2).replace('.', ',');
                
                // Se o item tiver uma URL de imagem, cria a tag <img>. Senão, não exibe nada.
                const imagemHtml = item.imagem ? `<img src="${item.imagem}" class="img-fluid rounded mb-3" alt="${item.nome}">` : '';

                categoriaHtml += `
                    <div class="item-cardapio">
                        ${imagemHtml} 
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
        // Tenta carregar os dados salvos localmente no navegador
        const dadosLocais = localStorage.getItem('cardapioDemoData');
        if (dadosLocais) {
            cardapioData = JSON.parse(dadosLocais);
            loadingElement.style.display = 'none';
            renderCardapio();
        } else {
            // Se não houver dados locais, busca o modelo da API
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('A resposta da rede não foi bem-sucedida.');
                
                const data = await response.json();
                
                // Garante que o campo imagem exista, mesmo que vazio
                cardapioData = data.cardapio.map(item => ({...item, imagem: item.imagem || ''}));
                
                // Salva o modelo inicial no navegador para futuras visitas
                localStorage.setItem('cardapioDemoData', JSON.stringify(cardapioData));
                loadingElement.style.display = 'none';
                renderCardapio();
            } catch (error) {
                loadingElement.innerHTML = `<div class="alert alert-danger"><strong>Ops!</strong> Não foi possível carregar o modelo de cardápio.</div>`;
                console.error('Erro ao buscar dados da API:', error);
            }
        }
    }

    // Lida com o envio do formulário para adicionar um novo item
    formNovoItem.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede que a página recarregue

        const novoItem = {
            id: 'local_' + Date.now(), // ID único local
            nome: document.getElementById('nome-item').value,
            categoria: document.getElementById('categoria-item').value,
            descricao: document.getElementById('descricao-item').value,
            preco: parseFloat(document.getElementById('preco-item').value),
            imagem: document.getElementById('imagem-item').value // Captura a URL da imagem
        };

        cardapioData.push(novoItem); // Adiciona ao nosso array de dados
        localStorage.setItem('cardapioDemoData', JSON.stringify(cardapioData)); // Salva o array atualizado no navegador
        renderCardapio(); // Re-renderiza a lista com o novo item
        formNovoItem.reset(); // Limpa o formulário para a próxima adição
    });

    // Inicia tudo
    carregarDadosIniciais();
});
