// Three.js Animation Variables
let scene, camera, renderer, nodeStructure, time = 0;

// Initialize Three.js 3D Animation
function initThree() {
    const container = document.getElementById('hero-canvas');
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 6;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();

    // Center sphere
    const centerMaterial = new THREE.MeshPhongMaterial({
        color: 0x00C2FF,
        transparent: true,
        opacity: 0.8,
        emissive: 0x00C2FF,
        emissiveIntensity: 0.3
    });
    group.add(new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), centerMaterial));

    // Orbiting nodes
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00C2FF });
    for (let i = 0; i < 8; i++) {
        const node = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), nodeMaterial);
        const angle = (i / 8) * Math.PI * 2;
        node.position.set(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0);
        node.userData = { angle: angle, radius: 1.2 };
        group.add(node);
    }

    // Connection lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00C2FF, transparent: true, opacity: 0.2 });
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0)
        ];
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial));
    }

    nodeStructure = group;
    scene.add(group);
    scene.add(new THREE.AmbientLight(0x00C2FF, 0.4));

    // Handle window resize
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    animate();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    nodeStructure.rotation.z += 0.003;
    nodeStructure.rotation.x = Math.sin(time * 0.5) * 0.1;

    nodeStructure.children.forEach((child, i) => {
        if (i > 0 && i <= 8 && child.userData.angle) {
            const data = child.userData;
            child.position.x = Math.cos(data.angle + time * 0.2) * data.radius;
            child.position.y = Math.sin(data.angle + time * 0.2) * data.radius;
        }
    });

    renderer.render(scene, camera);
}

// Page transition navigation
function navigateToPage(e, url) {
    e.preventDefault();
    const transition = document.getElementById('pageTransition');
    transition.classList.add('active');
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Case study animation observer
const caseObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelector('.comparison-fill.before').style.width = '100%';
            document.querySelector('.comparison-fill.after').style.width = '28%';
            caseObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

caseObserver.observe(document.querySelector('.case-study'));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth' });
    });
});

// Timeline scroll animation
function animateTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const timelineSteps = document.querySelectorAll('.timeline-step');
    const totalSteps = timelineSteps.length;

    // Get timeline position
    const timelineRect = timeline.getBoundingClientRect();
    const timelineTop = timelineRect.top;
    const timelineHeight = timelineRect.height;
    const windowHeight = window.innerHeight;

    // Calculate scroll progress through timeline
    // Extended range for slower, more gradual animation
    const scrollStart = windowHeight * 0.85; // Start when 85% down viewport
    const scrollEnd = -timelineHeight * 0.5; // End when timeline is halfway past top

    let progress = 0;

    if (timelineTop < scrollStart && timelineTop > scrollEnd) {
        // Timeline is in the active scroll zone
        progress = (scrollStart - timelineTop) / (scrollStart - scrollEnd);
        progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
    } else if (timelineTop <= scrollEnd) {
        // Timeline has scrolled past, show all steps
        progress = 1;
    }

    // Calculate which steps should be active
    const activeStepCount = Math.ceil(progress * totalSteps);

    // Update each step
    timelineSteps.forEach((step, index) => {
        if (index < activeStepCount) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update progress bar width
    // Progress bar goes from 5% to 95% (matching timeline::before left/right)
    const progressBarWidth = progress * 90; // 90% is the total width (95% - 5%)
    timeline.style.setProperty('--progress-width', `${progressBarWidth}%`);

    // Apply the progress bar width using ::after pseudo-element
    const style = document.createElement('style');
    style.textContent = `.timeline::after { width: ${progressBarWidth}% !important; }`;

    // Remove old style if exists
    const oldStyle = document.getElementById('timeline-progress-style');
    if (oldStyle) oldStyle.remove();

    style.id = 'timeline-progress-style';
    document.head.appendChild(style);
}

// Listen for scroll events
window.addEventListener('scroll', animateTimeline);
window.addEventListener('resize', animateTimeline);

// Initial check
animateTimeline();

// Initialize Three.js animation
initThree();
