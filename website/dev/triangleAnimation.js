// Add styles to document
const style = document.createElement('style');
style.textContent = `
    body {
        margin: 0;
        padding: 0;
        background-color: #0F1723;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        overflow: hidden;
    }
    canvas {
        display: block;
    }
`;
document.head.appendChild(style);

export function initTriangleAnimation(containerId) {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    document.getElementById(containerId).appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Define center of the canvas for reference
    const centerX = canvas.width / 2-75;
    const centerY = canvas.height / 2+75;
    
    // Fixed vertices A and B (common to both triangles) - diagonal at 45 degrees
    const pointA = { 
        x: centerX - 150, 
        y: centerY - 150  // A at top left
    };
    
    const pointB = { 
        x: centerX + 150, 
        y: centerY + 150  // B at bottom right
    };
    
    // Adjust initial positions for C and C_star in the top right
    let pointC = { 
        x: centerX + 150, 
        y: centerY - 300,
        baseX: centerX + 150,
        baseY: centerY - 300,
        amplitude: 50,
        frequency: 0.01,
        phaseX: 0,
        phaseY: Math.PI / 5
    };
    
    let pointCStar = { 
        x: centerX + 300, 
        y: centerY - 200,
        baseX: centerX + 300,
        baseY: centerY - 200,
        amplitude: 50,
        frequency: 0.01,
        phaseX: Math.PI / 5,
        phaseY: Math.PI / 5
    };
    
    // Drawing function
    function drawTriangles() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set triangle stroke properties
        ctx.lineWidth = 15;  // Thicker lines
        ctx.lineJoin = 'round';  // Round corners at vertices
        ctx.lineCap = 'round';   // Round ends of lines
        
        // Draw the two triangles with gradients
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
        // Update phases
        pointC.phaseX += pointC.frequency;
        pointC.phaseY += pointC.frequency * 1.2;
        
        pointCStar.phaseX += pointCStar.frequency * 0.9;
        pointCStar.phaseY += pointCStar.frequency * 1.1;
        
        // Calculate new positions with parametric movement
        pointC.x = pointC.baseX + Math.sin(pointC.phaseX) * pointC.amplitude * Math.sin(pointC.phaseY * 0.3);
        pointC.y = pointC.baseY + Math.sin(pointC.phaseY) * (pointC.amplitude * 0.8);
        
        pointCStar.x = pointCStar.baseX + Math.sin(pointCStar.phaseX) * pointCStar.amplitude;
        pointCStar.y = pointCStar.baseY + Math.cos(pointCStar.phaseY) * (pointCStar.amplitude * 0.7) * Math.sin(pointCStar.phaseX * 0.5);
        
        // Add slight random variations occasionally for more natural movement
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
    
    // Start animation
    animate();
} 