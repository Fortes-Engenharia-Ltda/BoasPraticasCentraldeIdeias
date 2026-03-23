/* ========================================
   DIAGRAMA BPMN INTERATIVO
   Funcionalidades específicas do diagrama
   ======================================== */

// Dados dos elementos BPMN
const bpmnElements = {
  startEvent: {
    type: "Evento de Início",
    description: "Ponto de partida do processo.",
    extra: "Este evento dispara o início do fluxo de trabalho."
  },
  taskCriarSolicitacao: {
    type: "Tarefa: Criar Solicitação",
    description: "Atividade onde a solicitação é criada e formalizada.",
    extra: "Responsável pela entrada inicial da demanda no sistema."
  },
  taskAnalisarDemanda: {
    type: "Tarefa: Analisar Demanda",
    description: "Processamento e análise detalhada da solicitação.",
    extra: "Executado por equipe técnica para avaliação criteriosa."
  },
  taskEnviarCotacao: {
    type: "Tarefa: Enviar Cotação",
    description: "Comunicação externa para fornecedores ou parceiros.",
    extra: "Envia documentos e solicitações oficiais de cotação."
  },
  taskAprovarCompra: {
    type: "Tarefa: Aprovar Compra",
    description: "Aprovação hierárquica superior para validação final.",
    extra: "Executado pela diretoria para validar a decisão de compra."
  },
  gatewayAprovacao: {
    type: "Gateway Exclusivo: Aprovação",
    description: "Decisão: Compra foi aprovada?",
    extra: "Gateway exclusivo (XOR) - APROVADA vai para Controle, REPROVADA volta para Compras."
  },
  taskControlarQualidade: {
    type: "Tarefa: Controlar Qualidade",
    description: "Recebimento e controle de qualidade do processo.",
    extra: "Garantia da conformidade e qualidade final dos produtos."
  },
  endEvent: {
    type: "Evento de Fim",
    description: "Conclusão do processo.",
    extra: "Marca o término bem-sucedido do fluxo de trabalho."
  }
};

// Variáveis globais do BPMN
let tooltip = null;
let detailsPanel = null;
let detailsTitle = null;
let detailsType = null;
let detailsDescription = null;
let detailsExtra = null;
let closeBtn = null;

// Inicialização do BPMN
document.addEventListener('DOMContentLoaded', function() {
  initializeBPMN();
});

function initializeBPMN() {
  // Aguardar um pouco para garantir que os elementos existam
  setTimeout(() => {
    tooltip = document.getElementById('tooltip');
    detailsPanel = document.getElementById('details-panel');
    detailsTitle = document.getElementById('details-title');
    detailsType = document.getElementById('details-type');
    detailsDescription = document.getElementById('details-description');
    detailsExtra = document.getElementById('details-extra');
    closeBtn = detailsPanel?.querySelector('.close-btn');
    
    if (tooltip && detailsPanel && detailsTitle && detailsType && detailsDescription && detailsExtra) {
      addBPMNInteractivity();
      setupBPMNEventListeners();
    }
  }, 100);
}

// ========================================
// INTERATIVIDADE DO DIAGRAMA
// ========================================

function addBPMNInteractivity() {
  document.querySelectorAll('.event, .task, .gateway').forEach(el => {
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('click', handleElementClick);
    el.addEventListener('keydown', handleKeyDown);
  });
}

function handleMouseEnter(e) {
  const id = e.currentTarget.getAttribute('data-id');
  if (id && bpmnElements[id]) {
    showTooltip(bpmnElements[id].type, e.pageX, e.pageY);
  }
}

function handleMouseMove(e) {
  const id = e.currentTarget.getAttribute('data-id');
  if (id && bpmnElements[id]) {
    showTooltip(bpmnElements[id].type, e.pageX, e.pageY);
  }
}

function handleMouseLeave() {
  hideTooltip();
}

function handleElementClick(e) {
  const id = e.currentTarget.getAttribute('data-id');
  if (id) {
    openDetailsPanel(id);
  }
}

function handleKeyDown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('data-id');
    if (id) {
      openDetailsPanel(id);
    }
  }
}

// ========================================
// TOOLTIP
// ========================================

function showTooltip(text, x, y) {
  if (!tooltip) return;
  
  tooltip.textContent = text;
  tooltip.style.left = x + 12 + "px";
  tooltip.style.top = y + 12 + "px";
  tooltip.style.opacity = "1";
  tooltip.setAttribute('aria-hidden', 'false');
}

function hideTooltip() {
  if (!tooltip) return;
  
  tooltip.style.opacity = "0";
  tooltip.setAttribute('aria-hidden', 'true');
}

// ========================================
// PAINEL DE DETALHES
// ========================================

function openDetailsPanel(id) {
  const data = bpmnElements[id];
  if (!data || !detailsPanel) return;
  
  detailsTitle.textContent = id;
  detailsType.textContent = data.type;
  detailsDescription.textContent = data.description;
  detailsExtra.textContent = data.extra || "";
  detailsPanel.classList.add('active');
  detailsPanel.setAttribute('aria-hidden', 'false');
  detailsPanel.focus();
}

function closeDetailsPanel() {
  if (!detailsPanel) return;
  
  detailsPanel.classList.remove('active');
  detailsPanel.setAttribute('aria-hidden', 'true');
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupBPMNEventListeners() {
  // Botão de fechar
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDetailsPanel);
  }
  
  // Fechar com ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && detailsPanel?.classList.contains('active')) {
      closeDetailsPanel();
    }
  });
  
  // Posicionamento dinâmico do tooltip
  document.addEventListener('mousemove', function(e) {
    if (tooltip && tooltip.style.opacity === '1') {
      const padding = 20;
      let x = e.pageX + 12;
      let y = e.pageY + 12;
      const rect = tooltip.getBoundingClientRect();
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      
      if (x + rect.width + padding > winW) {
        x = e.pageX - rect.width - 12;
      }
      if (y + rect.height + padding > winH) {
        y = e.pageY - rect.height - 12;
      }
      
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }
  });
}

// ========================================
// UTILITÁRIOS BPMN
// ========================================

// Destacar elemento ativo
function highlightElement(elementId) {
  // Remover destaque anterior
  document.querySelectorAll('.bpmn-element.active').forEach(el => {
    el.classList.remove('active');
  });
  
  // Destacar novo elemento
  const element = document.querySelector(`[data-id="${elementId}"]`);
  if (element) {
    element.classList.add('active');
  }
}

// Obter dados de um elemento
function getElementData(elementId) {
  return bpmnElements[elementId] || null;
}

// Listar todos os elementos
function getAllElements() {
  return Object.keys(bpmnElements);
}

// ========================================
// EXPORTAR FUNÇÕES
// ========================================

// Tornar funções disponíveis globalmente
window.openDetailsPanel = openDetailsPanel;
window.closeDetailsPanel = closeDetailsPanel;
window.highlightElement = highlightElement;
window.getElementData = getElementData;
window.getAllElements = getAllElements;
