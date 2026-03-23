/* ========================================
   PLAYER DE VÍDEO
   Funcionalidades do player de vídeo
   ======================================== */

// Dados dos vídeos
const videoData = {
  'Treinamento - Introdução - 01.mkv': {
    title: 'Treinamento - Introdução - 01',
    description: 'Introdução aos conceitos de BPM e visão geral do treinamento completo.',
    duration: '32 segundos'
  },
  'Treinamento - Modelagem Inicial - 02.mkv': {
    title: 'Treinamento - Modelagem Inicial - 02',
    description: 'Criação do diagrama BPMN e configuração inicial do processo no Fusion Platform.',
    duration: '09:29 min'
  },
  'Treinamento - Construção dos Formulários - Parte 01 - 03.mkv': {
    title: 'Treinamento - Construção dos Formulários - Parte 01 - 03',
    description: 'Primeira parte da criação de formulários: configuração básica e campos principais.',
    duration: '05:20 min'
  },
  'Treinamento - Construção dos Formulários - Parte 02 - 04.mkv': {
    title: 'Treinamento - Construção dos Formulários - Parte 02 - 04',
    description: 'Segunda parte da criação de formulários: campos específicos e configurações avançadas.',
    duration: '09:26 min'
  },
  'Treinamento - Vinculação do Formulário ao Processo e Configuração das Atividades - 05.mkv': {
    title: 'Treinamento - Vinculação do Formulário ao Processo e Configuração das Atividades - 05',
    description: 'Vinculação dos formulários ao processo BPMN e configuração detalhada de cada atividade.',
    duration: '10:04 min'
  },
  'Treinamento - Criação Papéis - Configuração dos Participantes - Liberação da Modelagem - 06.mkv': {
    title: 'Treinamento - Criação Papéis - Configuração dos Participantes - Liberação da Modelagem - 06',
    description: 'Criação de papéis, configuração de participantes e liberação final da modelagem para execução.',
    duration: '03:50 min'
  },
  'Treinamento - Teste com a Versão Criada - 07.mkv': {
    title: 'Treinamento - Teste com a Versão Criada - 07',
    description: 'Teste prático do processo criado, demonstração de execução e validação final.',
    duration: '07:21 min'
  }
};

// Variáveis globais do player
let mainVideo = null;
let currentVideo = null;

// Inicialização do player
document.addEventListener('DOMContentLoaded', function() {
  initializeVideoPlayer();
});

function initializeVideoPlayer() {
  mainVideo = document.getElementById('mainVideo');
  
  if (mainVideo) {
    setupVideoEventListeners();
  }
}

// ========================================
// FUNCIONALIDADES DO PLAYER
// ========================================

function playVideo(videoSrc, title, description) {
  if (!mainVideo) return;
  
  // Atualizar fonte do vídeo
  const source = mainVideo.querySelector('source');
  if (source) {
    source.src = videoSrc;
    mainVideo.load();
  }
  
  // Atualizar informações do vídeo
  updateVideoInfo(title, description);
  
  // Armazenar vídeo atual
  currentVideo = {
    src: videoSrc,
    title: title,
    description: description
  };
  
  // Reproduzir vídeo
  mainVideo.play().catch(error => {
    console.warn('Erro ao reproduzir vídeo:', error);
    showVideoError('Erro ao reproduzir o vídeo. Verifique se o formato é suportado pelo seu navegador.');
  });
}

function updateVideoInfo(title, description) {
  // Atualizar título se existir elemento
  const titleElement = document.getElementById('video-title');
  if (titleElement) {
    titleElement.textContent = title;
  }
  
  // Atualizar descrição se existir elemento
  const descElement = document.getElementById('video-description');
  if (descElement) {
    descElement.textContent = description;
  }
}

function showVideoError(message) {
  // Criar ou atualizar elemento de erro
  let errorElement = document.getElementById('video-error');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = 'video-error';
    errorElement.style.cssText = `
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 8px;
      margin: 10px 0;
      border: 1px solid #f5c6cb;
    `;
    
    // Inserir após o player
    if (mainVideo && mainVideo.parentNode) {
      mainVideo.parentNode.insertBefore(errorElement, mainVideo.nextSibling);
    }
  }
  
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  
  // Ocultar erro após 5 segundos
  setTimeout(() => {
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }, 5000);
}

// ========================================
// EVENT LISTENERS DO VÍDEO
// ========================================

function setupVideoEventListeners() {
  if (!mainVideo) return;
  
  // Evento de carregamento
  mainVideo.addEventListener('loadeddata', function() {
    console.log('Vídeo carregado:', currentVideo?.title);
  });
  
  // Evento de erro
  mainVideo.addEventListener('error', function(e) {
    console.error('Erro no vídeo:', e);
    showVideoError('Erro ao carregar o vídeo. Verifique se o arquivo existe e o formato é suportado.');
  });
  
  // Evento de reprodução
  mainVideo.addEventListener('play', function() {
    console.log('Vídeo iniciado:', currentVideo?.title);
  });
  
  // Evento de pausa
  mainVideo.addEventListener('pause', function() {
    console.log('Vídeo pausado:', currentVideo?.title);
  });
  
  // Evento de fim
  mainVideo.addEventListener('ended', function() {
    console.log('Vídeo finalizado:', currentVideo?.title);
  });
  
  // Evento de tempo atualizado
  mainVideo.addEventListener('timeupdate', function() {
    updateVideoProgress();
  });
}

function updateVideoProgress() {
  if (!mainVideo) return;
  
  const progress = (mainVideo.currentTime / mainVideo.duration) * 100;
  
  // Atualizar barra de progresso se existir
  const progressBar = document.getElementById('video-progress');
  if (progressBar) {
    progressBar.style.width = progress + '%';
  }
}

// ========================================
// CONTROLES DO PLAYER
// ========================================

function pauseVideo() {
  if (mainVideo && !mainVideo.paused) {
    mainVideo.pause();
  }
}

function resumeVideo() {
  if (mainVideo && mainVideo.paused) {
    mainVideo.play();
  }
}

function stopVideo() {
  if (mainVideo) {
    mainVideo.pause();
    mainVideo.currentTime = 0;
  }
}

function setVideoVolume(volume) {
  if (mainVideo) {
    mainVideo.volume = Math.max(0, Math.min(1, volume));
  }
}

function setVideoTime(time) {
  if (mainVideo) {
    mainVideo.currentTime = Math.max(0, Math.min(mainVideo.duration, time));
  }
}

// ========================================
// UTILITÁRIOS DE VÍDEO
// ========================================

function getCurrentVideo() {
  return currentVideo;
}

function getVideoData(filename) {
  return videoData[filename] || null;
}

function getAllVideos() {
  return Object.keys(videoData);
}

function getVideoDuration(filename) {
  const data = videoData[filename];
  return data ? data.duration : null;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ========================================
// EXPORTAR FUNÇÕES
// ========================================

// Tornar funções disponíveis globalmente
window.playVideo = playVideo;
window.pauseVideo = pauseVideo;
window.resumeVideo = resumeVideo;
window.stopVideo = stopVideo;
window.setVideoVolume = setVideoVolume;
window.setVideoTime = setVideoTime;
window.getCurrentVideo = getCurrentVideo;
window.getVideoData = getVideoData;
window.getAllVideos = getAllVideos;
window.getVideoDuration = getVideoDuration;
