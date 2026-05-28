// Generator Page Functionality

// DOM Elements
const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const resultText = document.getElementById('result-text');
const generatedImage = document.getElementById('generated-image');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const refineBtn = document.getElementById('refine-btn');
const charCurrent = document.getElementById('char-current');
const resultPlaceholder = document.querySelector('.result-placeholder');
const historyGrid = document.getElementById('history-grid');

// Generation History
let generationHistory = JSON.parse(localStorage.getItem('pixnora-history')) || [];

// Character Count
promptInput.addEventListener('input', () => {
    charCurrent.textContent = promptInput.value.length;
});

// Quick Prompts
document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        promptInput.value = btn.getAttribute('data-prompt');
        charCurrent.textContent = promptInput.value.length;
        promptInput.focus();
    });
});

// Generate Content
generateBtn.addEventListener('click', generateContent);

function generateContent() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        alert('Veuillez entrer une description !');
        return;
    }
    
    // Get options
    const style = document.getElementById('style-select').value;
    const format = document.getElementById('format-select').value;
    const model = document.getElementById('model-select').value;
    const quality = document.getElementById('quality-select').value;
    
    // Show loading state
    showLoadingState();
    
    // Simulate generation (replace with real API call)
    setTimeout(() => {
        completeGeneration(prompt, style, format, model, quality);
    }, 2000 + Math.random() * 2000);
}

function showLoadingState() {
    loadingSpinner.style.display = 'block';
    resultText.textContent = 'Génération en cours...';
    generatedImage.style.display = 'none';
    downloadBtn.style.display = 'none';
    shareBtn.style.display = 'none';
    refineBtn.style.display = 'none';
}

function completeGeneration(prompt, style, format, model, quality) {
    // Generate a unique placeholder image
    const seed = Math.random() * 1000000;
    const imageUrl = `https://api.placeholder.com/image?seed=${seed}&style=${style}&format=${format}`;
    
    // Use a working placeholder service
    const placeholderUrl = `https://via.placeholder.com/1080x1080?text=AI+Generated+Content`;
    
    // Show result
    loadingSpinner.style.display = 'none';
    resultText.textContent = 'Résultat généré :';
    generatedImage.src = placeholderUrl;
    generatedImage.style.display = 'block';
    
    // Show action buttons
    downloadBtn.style.display = 'inline-block';
    shareBtn.style.display = 'inline-block';
    refineBtn.style.display = 'inline-block';
    
    // Add to history
    const generation = {
        id: Date.now(),
        prompt: prompt,
        style: style,
        format: format,
        model: model,
        quality: quality,
        imageUrl: placeholderUrl,
        timestamp: new Date().toLocaleString('fr-FR')
    };
    
    generationHistory.unshift(generation);
    if (generationHistory.length > 20) {
        generationHistory.pop();
    }
    localStorage.setItem('pixnora-history', JSON.stringify(generationHistory));
    
    // Update history display
    updateHistoryDisplay();
    
    // Fade in animation
    generatedImage.style.opacity = '0';
    generatedImage.style.transform = 'scale(0.8)';
    let opacity = 0;
    let scale = 0.8;
    const fadeIn = setInterval(() => {
        opacity += 0.05;
        scale += 0.02;
        generatedImage.style.opacity = opacity;
        generatedImage.style.transform = `scale(${scale})`;
        
        if (opacity >= 1) {
            clearInterval(fadeIn);
        }
    }, 30);
}

// Download Button
downloadBtn.addEventListener('click', () => {
    if (generatedImage.src) {
        const a = document.createElement('a');
        a.href = generatedImage.src;
        a.download = `pixnora-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});

// Share Button
shareBtn.addEventListener('click', () => {
    const shareText = `J'ai créé cette image incroyable avec Pixnora ! ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Pixnora - Contenu IA',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Share cancelled'));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Lien copié dans le presse-papiers !');
        });
    }
});

// Refine Button
refineBtn.addEventListener('click', () => {
    promptInput.focus();
    promptInput.scrollIntoView({ behavior: 'smooth' });
});

// Update History Display
function updateHistoryDisplay() {
    if (generationHistory.length === 0) {
        historyGrid.innerHTML = '<p class="no-history">Aucune génération pour le moment</p>';
        return;
    }
    
    historyGrid.innerHTML = generationHistory.map(gen => `
        <div class="history-item" title="${gen.prompt}">
            <img src="${gen.imageUrl}" alt="Generated image">
            <div class="history-overlay">
                <p>${gen.prompt.substring(0, 50)}...</p>
                <small>${gen.timestamp}</small>
            </div>
        </div>
    `).join('');
}

// Initialize
updateHistoryDisplay();

// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (promptInput === document.activeElement) {
            generateContent();
        }
    }
});

// Add loading animation class on button click
generateBtn.addEventListener('click', function() {
    this.classList.add('loading');
    setTimeout(() => {
        this.classList.remove('loading');
    }, 4000);
});
