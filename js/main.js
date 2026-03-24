/* ========================================
   TUTORIAL BPM - FORTES ENGENHARIA
   JavaScript Principal - Navegação e UI
   ======================================== */

// Variáveis globais
let currentSection = 'introducao';
let isSidebarOpen = false;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMobileMenu();
    initializeScrollSpy();
    initializeImageZoom();
});

// ========================================
// NAVEGAÇÃO PRINCIPAL
// ========================================

function initializeNavigation() {
    // Adicionar event listeners para links de navegação
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            scrollToSection(sectionId);
            updateActiveMenu(sectionId);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 100;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Fechar sidebar em mobile
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    }
}

function updateActiveMenu(activeId) {
    // Remover classe active de todos os links
    const allLinks = document.querySelectorAll('.nav-menu a');
    allLinks.forEach(link => link.classList.remove('active'));
    
    // Adicionar classe active ao link atual
    const activeLink = document.querySelector(`[href="#${activeId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    currentSection = activeId;
}

// ========================================
// MENU MOBILE
// ========================================

function initializeMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileBtn && sidebar) {
        mobileBtn.addEventListener('click', toggleSidebar);
        
        // Fechar sidebar ao clicar fora
        document.addEventListener('click', function(e) {
            if (isSidebarOpen && !sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
                closeSidebar();
            }
        });
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    
    if (sidebar) {
        sidebar.classList.toggle('open');
        isSidebarOpen = sidebar.classList.contains('open');
        
        // Atualizar ícone do botão
        if (mobileBtn) {
            mobileBtn.innerHTML = isSidebarOpen ? '✕' : '☰';
        }
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    
    if (sidebar) {
        sidebar.classList.remove('open');
        isSidebarOpen = false;
        
        if (mobileBtn) {
            mobileBtn.innerHTML = '☰';
        }
    }
}

// ========================================
// SCROLL SPY
// ========================================

function initializeScrollSpy() {
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                updateActiveMenu(sectionId);
            }
        });
    });
}

// ========================================
// ZOOM DE IMAGENS
// ========================================

function initializeImageZoom() {
    // Adicionar classe zoomable e evento de clique para todas as imagens
    const images = document.querySelectorAll('img[src$=".png"], img[src$=".jpg"], img[src$=".jpeg"], img[src$=".gif"]');
    
    images.forEach(img => {
        img.classList.add('zoomable');
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            openImageZoom(this.src, this.alt);
        });
    });
}

function openImageZoom(imageSrc, imageAlt) {
    // Criar overlay se não existir
    let overlay = document.getElementById('image-zoom-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'image-zoom-overlay';
        overlay.className = 'image-zoom-overlay';
        document.body.appendChild(overlay);
        
        // Adicionar info de fechamento
        const info = document.createElement('div');
        info.className = 'zoom-info';
        info.innerHTML = 'Para sair dessa tela: ✅ Clique no fundo escuro • ✅ Tecla ESC • ✅ Botão X';
        overlay.appendChild(info);
    }
    
    // Criar imagem ampliada
    const zoomedImg = document.createElement('img');
    zoomedImg.src = imageSrc;
    zoomedImg.alt = imageAlt;
    zoomedImg.className = 'zoomed-image';
    overlay.innerHTML = '';
    overlay.appendChild(zoomedImg);
    overlay.appendChild(document.createElement('div')).className = 'zoom-info';
    overlay.querySelector('.zoom-info').innerHTML = 'Para sair dessa tela: ✅ Clique no fundo escuro • ✅ Tecla ESC • ✅ Botão X';
    
    // Mostrar overlay
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Event listeners para fechar
    overlay.addEventListener('click', closeImageZoom);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageZoom();
        }
    });
}

function closeImageZoom() {
    const overlay = document.getElementById('image-zoom-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ========================================
// UTILITÁRIOS
// ========================================

// Debounce para otimizar eventos de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Verificar se elemento está visível na viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========================================
// EVENTOS DE REDIMENSIONAMENTO
// ========================================

window.addEventListener('resize', debounce(function() {
    // Fechar sidebar em mobile quando redimensionar para desktop
    if (window.innerWidth > 768 && isSidebarOpen) {
        closeSidebar();
    }
}, 250));

// ========================================
// EXPORTAR FUNÇÕES GLOBAIS
// ========================================

// Tornar funções disponíveis globalmente
window.scrollToSection = scrollToSection;
window.toggleSidebar = toggleSidebar;
window.openImageZoom = openImageZoom;
window.closeImageZoom = closeImageZoom;

// ========================================
// VÍDEOS
// ========================================

function playVideo(src, title, description, type = 'local') {
  // ... seu código existente para abrir o modal ...

  if (type === 'sharepoint') {
    // Usa iframe embed do SharePoint
    videoPlayer.innerHTML = `
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe src="${src}" 
          frameborder="0" scrolling="no" allowfullscreen 
          style="border:none; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
        </iframe>
      </div>`;
  } else {
    // Mantém o comportamento original para vídeos locais
    videoPlayer.innerHTML = `<video controls src="${src}"></video>`;
  }
}

