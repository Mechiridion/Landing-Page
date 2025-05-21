// Car Systems Animation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get all sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    // Initialize animation
    initCarAnimation();
    
    // Connect sidebar items to car systems
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get the text of the clicked item
            const itemText = this.textContent.trim();
            
            // Determine which system to show based on the text
            let systemId = '';
            
            if (itemText.includes('Engine')) {
                systemId = 'system-engine';
            } else if (itemText.includes('Electrical')) {
                systemId = 'system-electrical';
            } else if (itemText.includes('Braking')) {
                systemId = 'system-braking';
            } else if (itemText.includes('Suspension')) {
                systemId = 'system-suspension';
            } else if (itemText.includes('Fuel')) {
                systemId = 'system-fuel';
            } else if (itemText.includes('Cooling')) {
                systemId = 'system-cooling';
            } else if (itemText.includes('Exhaust')) {
                systemId = 'system-exhaust';
            } else if (itemText.includes('Body')) {
                systemId = 'system-body';
            }
            
            // Show the selected system
            if (systemId) {
                showCarSystem(systemId);
            }
            
            // Remove active class from all items and add to clicked item
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

function initCarAnimation() {
    // Find the main-content div in the software demo section
    const mainContent = document.querySelector('.main-content');
    
    // If there's a placeholder image, remove it
    const placeholderImage = mainContent.querySelector('img.car-model');
    if (placeholderImage) {
        mainContent.removeChild(placeholderImage);
    }
    
    // Create a container for the SVG if it doesn't exist
    let svgContainer = mainContent.querySelector('#car-svg-container');
    if (!svgContainer) {
        svgContainer = document.createElement('div');
        svgContainer.id = 'car-svg-container';
        svgContainer.style.width = '100%';
        svgContainer.style.height = '100%';
        svgContainer.style.position = 'absolute';
        svgContainer.style.top = '0';
        svgContainer.style.left = '0';
        svgContainer.style.display = 'flex';
        svgContainer.style.justifyContent = 'center';
        svgContainer.style.alignItems = 'center';
        mainContent.appendChild(svgContainer);
    }
    
    // Insert the SVG
    const svgCode = document.getElementById('carSvg');
    if (svgCode) {
        svgContainer.innerHTML = '';
        svgContainer.appendChild(svgCode);
    }
    
    // Add CSS for car systems animation
    const style = document.createElement('style');
    style.textContent = `
        .car-system {
            transition: opacity 0.5s ease-in-out;
        }
        .system-part {
            filter: drop-shadow(0px 0px 5px rgba(255, 87, 34, 0.7));
        }
        @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }
        .system-active {
            opacity: 1;
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);
    
    // Show the engine system by default (to match the active sidebar item)
    showCarSystem('system-engine');
}

function showCarSystem(systemId) {
    // Hide all systems
    const allSystems = document.querySelectorAll('.car-system');
    allSystems.forEach(system => {
        system.style.opacity = 0;
        system.classList.remove('system-active');
    });
    
    // Show the selected system
    const selectedSystem = document.getElementById(systemId);
    if (selectedSystem) {
        setTimeout(() => {
            selectedSystem.style.opacity = 1;
            selectedSystem.classList.add('system-active');
        }, 300); // Small delay for better transition effect
    }
}

// Add rotation functionality
function addCarRotation() {
    const carSvg = document.getElementById('carSvg');
    if (!carSvg) return;
    
    let isDragging = false;
    let startX = 0;
    let currentRotation = 0;
    
    carSvg.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        carSvg.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const newRotation = currentRotation + deltaX / 5;
        
        const carBase = document.getElementById('car-base');
        carBase.style.transform = `rotateY(${newRotation}deg)`;
        
        allSystems = document.querySelectorAll('.car-system');
        allSystems.forEach(system => {
            system.style.transform = `rotateY(${newRotation}deg)`;
        });
    });
    
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            carSvg.style.cursor = 'grab';
            
            // Update current rotation
            const carBase = document.getElementById('car-base');
            const transformValue = carBase.style.transform;
            if (transformValue) {
                const match = transformValue.match(/rotateY\(([^)]+)deg\)/);
                if (match && match[1]) {
                    currentRotation = parseFloat(match[1]);
                }
            }
        }
    });
    
    // Initial setup
    carSvg.style.cursor = 'grab';
}