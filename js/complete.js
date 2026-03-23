
    // Função para navegar para seções
    function scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        
        // Atualizar menu ativo
        updateActiveMenu(sectionId);
        
        // Fechar menu mobile se estiver aberto
        if (window.innerWidth <= 768) {
          document.getElementById('sidebar').classList.remove('open');
        }
      }
    }
    
    // Função para atualizar menu ativo
    function updateActiveMenu(activeId) {
      // Remover classe ativa de todos os links
      document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
      });
      
      // Adicionar classe ativa ao link clicado
      const activeLink = document.querySelector(`[href="#${activeId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
    
    // Função para toggle do menu mobile
    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('open');
    }
    
    // Detectar seção ativa no scroll
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('.section');
      const scrollPos = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.id;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          updateActiveMenu(sectionId);
        }
      });
    });
    
    // Marcar primeiro capítulo como ativo por padrão
    document.addEventListener('DOMContentLoaded', () => {
      updateActiveMenu('capitulo1');
      inicializarFramework();
      initializeImageZoom();
    });
    
    // Framework de Maturidade
    let progressoEstagios = {
      1: { status: 'nao-iniciado', progresso: 0 },
      2: { status: 'nao-iniciado', progresso: 0 },
      3: { status: 'nao-iniciado', progresso: 0 },
      4: { status: 'nao-iniciado', progresso: 0 },
      5: { status: 'nao-iniciado', progresso: 0 }
    };
    
    function inicializarFramework() {
      // Carregar progresso salvo
      const progressoSalvo = localStorage.getItem('fortesBPMProgresso');
      if (progressoSalvo) {
        progressoEstagios = JSON.parse(progressoSalvo);
        atualizarInterfaceFramework();
      }
    }
    
    function marcarEstagioCompleto(numeroEstagio) {
      progressoEstagios[numeroEstagio].status = 'completo';
      progressoEstagios[numeroEstagio].progresso = 100;
      
      // Salvar no localStorage
      localStorage.setItem('fortesBPMProgresso', JSON.stringify(progressoEstagios));
      
      // Atualizar interface
      atualizarInterfaceFramework();
      
      // Mostrar confirmação
      mostrarConfirmacao(`Estágio ${numeroEstagio} marcado como completo! 🎉`);
    }
    
    function atualizarInterfaceFramework() {
      // Atualizar cada estágio
      for (let i = 1; i <= 5; i++) {
        const estagio = document.querySelector(`[data-estagio="${i}"]`);
        const statusElement = document.getElementById(`status-${i}`);
        
        if (estagio && statusElement) {
          // Remover classes anteriores
          estagio.classList.remove('completo', 'em-andamento');
          statusElement.className = 'estagio-status';
          
          // Aplicar novo status
          if (progressoEstagios[i].status === 'completo') {
            estagio.classList.add('completo');
            statusElement.classList.add('completo');
            statusElement.textContent = '✅ Completo';
          } else if (progressoEstagios[i].status === 'em-andamento') {
            estagio.classList.add('em-andamento');
            statusElement.classList.add('em-andamento');
            statusElement.textContent = '🔄 Em Andamento';
          } else {
            statusElement.classList.add('nao-iniciado');
            statusElement.textContent = '❌ Não Iniciado';
          }
        }
      }
      
      // Atualizar painel de controle
      atualizarPainelControle();
    }
    
    function atualizarPainelControle() {
      const estagiosCompletos = Object.values(progressoEstagios).filter(e => e.status === 'completo').length;
      const progressoGeral = Math.round((estagiosCompletos / 5) * 100);
      
      // Encontrar próximo estágio
      let proximoEstagio = 1;
      for (let i = 1; i <= 5; i++) {
        if (progressoEstagios[i].status !== 'completo') {
          proximoEstagio = i;
          break;
        }
      }
      
      // Atualizar valores
      document.getElementById('estagio-atual').textContent = `${proximoEstagio} - ${getNomeEstagio(proximoEstagio)}`;
      document.getElementById('progresso-geral').textContent = `${progressoGeral}%`;
      document.getElementById('proximo-passo').textContent = getProximoPasso(proximoEstagio);
    }
    
    function getNomeEstagio(numero) {
      const nomes = {
        1: 'Diagnóstico Inicial',
        2: 'Mapeamento de Processos',
        3: 'Levantamento de Requisitos',
        4: 'Registro de Gargalos',
        5: 'Validação com Áreas'
      };
      return nomes[numero] || 'Desconhecido';
    }
    
    function getProximoPasso(numero) {
      const passos = {
        1: 'Iniciar Diagnóstico',
        2: 'Começar Mapeamento',
        3: 'Levantar Requisitos',
        4: 'Identificar Gargalos',
        5: 'Validar com Áreas'
      };
      return passos[numero] || 'Finalizar';
    }
    
    function resetarProgresso() {
      if (confirm('Tem certeza que deseja resetar todo o progresso?')) {
        progressoEstagios = {
          1: { status: 'nao-iniciado', progresso: 0 },
          2: { status: 'nao-iniciado', progresso: 0 },
          3: { status: 'nao-iniciado', progresso: 0 },
          4: { status: 'nao-iniciado', progresso: 0 },
          5: { status: 'nao-iniciado', progresso: 0 }
        };
        
        localStorage.removeItem('fortesBPMProgresso');
        atualizarInterfaceFramework();
        mostrarConfirmacao('Progresso resetado com sucesso! 🔄');
      }
    }
    
    function mostrarConfirmacao(mensagem) {
      // Criar notificação
      const notificacao = document.createElement('div');
      notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
      `;
      notificacao.textContent = mensagem;
      
      document.body.appendChild(notificacao);
      
      // Remover após 3 segundos
      setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          document.body.removeChild(notificacao);
        }, 300);
      }, 3000);
    }
    
    // Adicionar animações CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  
