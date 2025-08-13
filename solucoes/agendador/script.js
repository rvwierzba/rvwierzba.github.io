// CÓDIGO JAVASCRIPT COMPLETO E ATUALIZADO
document.addEventListener('DOMContentLoaded', () => {
    // !!! COLE A URL DA API DO AGENDADOR AQUI !!!
    const API_URL = 'https://script.google.com/macros/s/AKfycbxha-kkZce25Eqcc439IqYTZP-sOxRTtdrRgEkHjTelIjMFbkMryoldSCB36EYE4X1vIQ/exec';

    const servicoSelect = document.getElementById('servico-select');
    const agendamentosContainer = document.getElementById('agendamentos-container');
    const formAgendamento = document.getElementById('form-agendamento');
    const formStatus = document.getElementById('form-status');

    let agendamentosData = [];

    // Função para renderizar a lista de horários ocupados
    function renderAgendamentos() {
        agendamentosContainer.innerHTML = '';
        const agendamentosList = document.createElement('ul');
        agendamentosList.className = 'list-group';
        if (agendamentosData.length > 0) {
            // Ordena os agendamentos por data
            const sorted = agendamentosData.sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
            sorted.forEach(agendamento => {
                const li = document.createElement('li');
                li.className = 'list-group-item list-group-item-secondary';
                const dataHora = new Date(agendamento.data_hora);
                const dataFormatada = dataHora.toLocaleDateString('pt-BR');
                const horaFormatada = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                li.textContent = `Dia ${dataFormatada} às ${horaFormatada}h - ${agendamento.servico_agendado}`;
                agendamentosList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = 'Nenhum horário agendado.';
            agendamentosList.appendChild(li);
        }
        agendamentosContainer.appendChild(agendamentosList);
    }
    
    // Carrega os dados iniciais (serviços e agendamentos)
    async function carregarDadosIniciais() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            // Preenche o dropdown de serviços
            servicoSelect.innerHTML = '<option value="">Selecione um serviço</option>';
            data.servicos.forEach(servico => {
                const option = document.createElement('option');
                option.value = servico.nome_servico;
                option.textContent = `${servico.nome_servico} (${servico.duracao_minutos} min)`;
                servicoSelect.appendChild(option);
            });

            // Guarda os agendamentos e renderiza a lista
            agendamentosData = data.agendamentos;
            renderAgendamentos();

        } catch (error) {
            servicoSelect.innerHTML = '<option value="">Erro ao carregar</option>';
            agendamentosContainer.innerHTML = '<div class="alert alert-warning">Erro ao carregar agenda.</div>';
        }
    }

    // Lida com o envio do formulário de novo agendamento
    formAgendamento.addEventListener('submit', async (e) => {
        e.preventDefault();
        formStatus.innerHTML = '<div class="alert alert-info">Enviando agendamento...</div>';

        const dadosDoFormulario = {
            nome_cliente: document.getElementById('nome-cliente').value,
            email_cliente: document.getElementById('email-cliente').value,
            servico_agendado: document.getElementById('servico-select').value,
            data_hora: document.getElementById('data-hora').value,
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante para scripts do Google quando não se precisa ler a resposta do POST
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosDoFormulario),
            });

            formStatus.innerHTML = '<div class="alert alert-success">Agendamento realizado com sucesso! A lista será atualizada.</div>';
            
            // Adiciona o novo agendamento à lista local para atualização instantânea
            agendamentosData.push(dadosDoFormulario);
            renderAgendamentos();

            formAgendamento.reset(); // Limpa o formulário

        } catch (error) {
            formStatus.innerHTML = '<div class="alert alert-danger">Ocorreu um erro ao agendar.</div>';
            console.error('Erro no POST:', error);
        }
        
        // Limpa a mensagem de status após alguns segundos
        setTimeout(() => { formStatus.innerHTML = ''; }, 4000);
    });

    // Inicia tudo
    carregarDadosIniciais();
});
