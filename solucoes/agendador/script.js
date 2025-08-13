document.addEventListener('DOMContentLoaded', () => {
    // !!! COLE A NOVA URL DA API DO AGENDADOR AQUI !!!
    const API_URL = 'https://script.google.com/macros/s/AKfycbxha-kkZce25Eqcc439IqYTZP-sOxRTtdrRgEkHjTelIjMFbkMryoldSCB36EYE4X1vIQ/exec';

    const servicosContainer = document.getElementById('servicos-container');
    const agendamentosContainer = document.getElementById('agendamentos-container');

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            // Renderiza a lista de serviços
            servicosContainer.innerHTML = '';
            const servicosList = document.createElement('ul');
            servicosList.className = 'list-group';
            data.servicos.forEach(servico => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = `<strong>${servico.nome_servico}</strong> (${servico.duracao_minutos} min) <br> <small>${servico.profissional}</small>`;
                servicosList.appendChild(li);
            });
            servicosContainer.appendChild(servicosList);

            // Renderiza a lista de agendamentos
            agendamentosContainer.innerHTML = '';
            const agendamentosList = document.createElement('ul');
            agendamentosList.className = 'list-group';
            if (data.agendamentos.length > 0) {
                data.agendamentos.forEach(agendamento => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item list-group-item-danger'; // Vermelho para indicar ocupado
                    // Formata a data para o padrão brasileiro
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
        })
        .catch(error => {
            servicosContainer.innerHTML = '<div class="alert alert-warning">Erro ao carregar serviços.</div>';
            agendamentosContainer.innerHTML = '<div class="alert alert-warning">Erro ao carregar agenda.</div>';
            console.error('Erro ao buscar dados:', error);
        });
});
