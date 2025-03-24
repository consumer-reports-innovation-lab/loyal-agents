export function initTriangleAnimation(containerId) {
    // Create canvas element
    const canvas = document.createElement('canvas');
    const container = document.getElementById(containerId);
    
    // Function to handle canvas sizing and DPI scaling
    function setupCanvas() {
        // Get container dimensions
        const containerRect = container.getBoundingClientRect();
        
        // Get device pixel ratio for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        
        // Set display size (css pixels)
        canvas.style.width = `${containerRect.width}px`;
        canvas.style.height = `${containerRect.height}px`;
        
        // Set actual size in memory (scaled for DPI)
        canvas.width = containerRect.width * dpr;
        canvas.height = containerRect.height * dpr;
        
        // Get context and scale all drawing operations
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        return {
            ctx,
            width: containerRect.width,
            height: containerRect.height
        };
    }
    
    // Add canvas to container
    container.appendChild(canvas);
    
    // Initial setup
    let { ctx, width, height } = setupCanvas();
    
    // Define center of the canvas for reference
    let centerX = width / 2 - 75;
    let centerY = height / 2 - 75;
    
    // Make points relative to canvas size
    const scale = Math.min(width, height) / 800; // Base scale on original 600px design
    
    // Fixed vertices A and B (common to both triangles)
    let pointA = { 
        x: centerX - 150 * scale, 
        y: centerY - 100 * scale
    };
    
    let pointB = { 
        x: centerX + 150 * scale, 
        y: centerY + 100 * scale
    };
    
    // Adjust initial positions for C and C_star
    let pointC = { 
        x: centerX + 150 * scale, 
        y: centerY - 200 * scale,
        baseX: centerX + 150 * scale,
        baseY: centerY - 200 * scale,
        amplitude: 50 * scale,
        frequency: 0.01,
        phaseX: 0,
        phaseY: Math.PI / 5
    };
    
    let pointCStar = { 
        x: centerX + 250 * scale, 
        y: centerY - 150 * scale,
        baseX: centerX + 250 * scale,
        baseY: centerY - 150 * scale,
        amplitude: 50 * scale,
        frequency: 0.01,
        phaseX: Math.PI / 5,
        phaseY: Math.PI / 5
    };
    
    // Drawing function
    function drawTriangles() {
        // Clear canvas using style dimensions
        ctx.clearRect(0, 0, width, height);
        
        // Scale line width based on canvas size
        ctx.lineWidth = 15 * scale;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        // First triangle (A, B, C)
        let gradient1 = ctx.createLinearGradient(pointB.x, pointB.y, pointC.x, pointC.y);
        gradient1.addColorStop(0, '#4A89D0');
        gradient1.addColorStop(1, '#06AE3C');
        
        ctx.beginPath();
        ctx.strokeStyle = gradient1;
        ctx.moveTo(pointA.x, pointA.y);
        ctx.lineTo(pointB.x, pointB.y);
        ctx.lineTo(pointC.x, pointC.y);
        ctx.closePath();
        ctx.stroke();
        
        // Second triangle (A, B, C_star)
        let gradient2 = ctx.createLinearGradient(pointB.x, pointB.y, pointCStar.x, pointCStar.y);
        gradient2.addColorStop(0, '#4A89D0');
        gradient2.addColorStop(1, '#06AE3C');
        
        ctx.beginPath();
        ctx.strokeStyle = gradient2;
        ctx.moveTo(pointA.x, pointA.y);
        ctx.lineTo(pointB.x, pointB.y);
        ctx.lineTo(pointCStar.x, pointCStar.y);
        ctx.closePath();
        ctx.stroke();
    }
    
    // Update function with smooth, organic movement
    function updatePoints() {
        pointC.phaseX += pointC.frequency;
        pointC.phaseY += pointC.frequency * 1.2;
        
        pointCStar.phaseX += pointCStar.frequency * 0.9;
        pointCStar.phaseY += pointCStar.frequency * 1.1;
        
        pointC.x = pointC.baseX + Math.sin(pointC.phaseX) * pointC.amplitude * Math.sin(pointC.phaseY * 0.3);
        pointC.y = pointC.baseY + Math.sin(pointC.phaseY) * (pointC.amplitude * 0.8);
        
        pointCStar.x = pointCStar.baseX + Math.sin(pointCStar.phaseX) * pointCStar.amplitude;
        pointCStar.y = pointCStar.baseY + Math.cos(pointCStar.phaseY) * (pointCStar.amplitude * 0.7) * Math.sin(pointCStar.phaseX * 0.5);
        
        if (Math.random() < 0.005) {
            pointC.frequency = 0.005 + Math.random() * 0.01;
            pointCStar.frequency = 0.005 + Math.random() * 0.015;
        }
    }
    
    // Animation loop
    function animate() {
        updatePoints();
        drawTriangles();
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Recalculate canvas dimensions and scaling
        ({ ctx, width, height } = setupCanvas());
        
        // Update center points
        centerX = width / 2 - 75;
        centerY = height / 2 - 75;
        
        // Update scale
        const newScale = Math.min(width, height) / 800;
        
        // Update all points with new scale and positions
        pointA = { 
            x: centerX - 150 * newScale, 
            y: centerY - 100 * newScale
        };
        
        pointB = { 
            x: centerX + 150 * newScale, 
            y: centerY + 100 * newScale
        };
        
        // Update C and C_star with new positions
        const cPhaseX = pointC.phaseX;
        const cPhaseY = pointC.phaseY;
        pointC = {
            ...pointC,
            baseX: centerX + 150 * newScale,
            baseY: centerY - 200 * newScale,
            amplitude: 50 * newScale,
            phaseX: cPhaseX,
            phaseY: cPhaseY
        };
        
        const csPhaseX = pointCStar.phaseX;
        const csPhaseY = pointCStar.phaseY;
        pointCStar = {
            ...pointCStar,
            baseX: centerX + 250 * newScale,
            baseY: centerY - 150 * newScale,
            amplitude: 50 * newScale,
            phaseX: csPhaseX,
            phaseY: csPhaseY
        };
    });
    
    // Start animation
    animate();
} 