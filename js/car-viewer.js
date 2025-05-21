// Car Systems Viewer with Three.js
function initCarViewer() {
    // Get container dimensions
    const container = document.getElementById('car-svg-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 0.1, 1000);
    camera.position.set(5, 2, 5);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);
    
    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Car model and systems mapping
    let carModel = null;
    const systemToPartsMapping = {
        'engine': ['engine', 'motor', 'hood', 'bonnet', 'cylinder'],
        'electrical': ['battery', 'electrical', 'wire', 'circuit', 'light'],
        'braking': ['brake', 'caliper', 'rotor', 'wheel', 'tire'],
        'suspension': ['suspension', 'shock', 'spring', 'strut', 'arm'],
        'fuel': ['fuel', 'tank', 'gas', 'pump', 'injector'],
        'cooling': ['cooling', 'radiator', 'fan', 'water'],
        'exhaust': ['exhaust', 'muffler', 'pipe', 'catalytic'],
        'body': ['body', 'panel', 'door', 'seat', 'interior', 'window', 'glass']
    };
    
    // Original materials map to reset highlighting
    const originalMaterials = new Map();
    
    // Load the GLB model
    const loader = new THREE.GLTFLoader();
    loader.load(
        'assets/2018_bmw_m5/source/2018_bmw_m5.glb', // Path to your model - adjust as needed
        function (gltf) {
            carModel = gltf.scene;
            
            // Center and scale model
            let box = new THREE.Box3().setFromObject(carModel);
            let size = box.getSize(new THREE.Vector3()).length();
            let center = box.getCenter(new THREE.Vector3());
            
            carModel.position.x = -center.x;
            carModel.position.y = -center.y;
            carModel.position.z = -center.z;
            
            // Scale to fit container
            let scale = 4 / size;
            carModel.scale.set(scale, scale, scale);
            
            // Store original materials and set up system mappings
            carModel.traverse(function (child) {
                if (child.isMesh) {
                    // Store original material
                    originalMaterials.set(child, child.material.clone());
                    
                    // Auto-assign systems based on name patterns
                    const lowerName = child.name.toLowerCase();
                    for (const [system, keywords] of Object.entries(systemToPartsMapping)) {
                        for (const keyword of keywords) {
                            if (lowerName.includes(keyword)) {
                                child.userData.system = system;
                                break;
                            }
                        }
                    }
                    
                    // If no system was matched, assign to body
                    if (!child.userData.system) {
                        child.userData.system = 'body';
                    }
                }
            });
            
            scene.add(carModel);
            
            // Show engine system by default
            highlightSystem('engine');
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('Error loading model:', error);
            
            // Fallback to simple model if loading fails
            createFallbackModel();
        }
    );
    
// Enhanced low-poly car model with proper orientations and more detail
function createFallbackModel() {
    const group = new THREE.Group();
    
    // Car body - main chassis
    const bodyGeometry = new THREE.BoxGeometry(4.5, 0.7, 2);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        metalness: 0.7,
        roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    body.userData.system = 'body';
    originalMaterials.set(body, bodyMaterial.clone());
    
    // Car roof/cabin
    const roofGeometry = new THREE.BoxGeometry(2.2, 0.9, 1.9);
    const roofMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        metalness: 0.7,
        roughness: 0.3
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.4;
    roof.position.x = -0.2;
    roof.userData.system = 'body';
    originalMaterials.set(roof, roofMaterial.clone());
    
    // Front windshield - adjusted to be flat against the car
    const windshieldGeometry = new THREE.PlaneGeometry(1.2, 0.8);
    const windshieldMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x88ccff,
        transparent: true,
        opacity: 0.6,
        metalness: 0.9,
        roughness: 0.1,
        side: THREE.DoubleSide
    });
    const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    windshield.position.set(0.9, 1.3, 0);
    windshield.rotation.x = Math.PI / 2;
    windshield.rotation.y = -Math.PI * 0.13;
    windshield.userData.system = 'body';
    originalMaterials.set(windshield, windshieldMaterial.clone());
    
    // Rear windshield - adjusted to be flat against the car
    const rearWindshield = new THREE.Mesh(windshieldGeometry.clone(), windshieldMaterial.clone());
    rearWindshield.position.set(-1.3, 1.3, 0);
    rearWindshield.rotation.x = Math.PI / 2;
    rearWindshield.rotation.y = Math.PI * 0.13;
    rearWindshield.userData.system = 'body';
    originalMaterials.set(rearWindshield, windshieldMaterial.clone());
    
    // Side windows
    const sideWindowGeometry = new THREE.PlaneGeometry(1.6, 0.6);
    
    const leftWindowFront = new THREE.Mesh(sideWindowGeometry, windshieldMaterial.clone());
    leftWindowFront.position.set(0.2, 1.4, 0.96);
    leftWindowFront.rotation.y = Math.PI / 2;
    leftWindowFront.userData.system = 'body';
    originalMaterials.set(leftWindowFront, windshieldMaterial.clone());
    
    const rightWindowFront = new THREE.Mesh(sideWindowGeometry, windshieldMaterial.clone());
    rightWindowFront.position.set(0.2, 1.4, -0.96);
    rightWindowFront.rotation.y = -Math.PI / 2;
    rightWindowFront.userData.system = 'body';
    originalMaterials.set(rightWindowFront, windshieldMaterial.clone());
    
    const leftWindowRear = new THREE.Mesh(sideWindowGeometry, windshieldMaterial.clone());
    leftWindowRear.position.set(-0.8, 1.4, 0.96);
    leftWindowRear.rotation.y = Math.PI / 2;
    leftWindowRear.userData.system = 'body';
    originalMaterials.set(leftWindowRear, windshieldMaterial.clone());
    
    const rightWindowRear = new THREE.Mesh(sideWindowGeometry, windshieldMaterial.clone());
    rightWindowRear.position.set(-0.8, 1.4, -0.96);
    rightWindowRear.rotation.y = -Math.PI / 2;
    rightWindowRear.userData.system = 'body';
    originalMaterials.set(rightWindowRear, windshieldMaterial.clone());
    
    // Engine block
    const engineGeometry = new THREE.BoxGeometry(1.2, 0.6, 1.6);
    const engineMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.8
    });
    const engine = new THREE.Mesh(engineGeometry, engineMaterial);
    engine.position.set(1.5, 0.9, 0);
    engine.userData.system = 'engine';
    originalMaterials.set(engine, engineMaterial.clone());
    
    // Engine details - cylinder heads
    const cylinderGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 8);
    const cylinderMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        metalness: 0.7,
        roughness: 0.6
    });
    
    // Add 4 cylinders
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
            cylinder.position.set(1.3 + i * 0.4, 1.2, -0.4 + j * 0.8);
            cylinder.userData.system = 'engine';
            originalMaterials.set(cylinder, cylinderMaterial.clone());
            group.add(cylinder);
        }
    }
    
    // Air intake
    const intakeGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.4);
    const intakeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        metalness: 0.5,
        roughness: 0.9
    });
    const intake = new THREE.Mesh(intakeGeometry, intakeMaterial);
    intake.position.set(1.9, 1.2, 0.4);
    intake.userData.system = 'engine';
    originalMaterials.set(intake, intakeMaterial.clone());
    
    // Hood
    const hoodGeometry = new THREE.BoxGeometry(1.5, 0.15, 1.9);
    const hoodMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        metalness: 0.7,
        roughness: 0.3
    });
    const hood = new THREE.Mesh(hoodGeometry, hoodMaterial);
    hood.position.set(1.5, 1.05, 0);
    hood.userData.system = 'engine';
    originalMaterials.set(hood, hoodMaterial.clone());
    
    // Create wheels with suspension components - FIXED ORIENTATION
    function createWheel(x, z, isFront) {
        const group = new THREE.Group();
        
        // Tire - FIXED rotation
        const tireGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        tireGeometry.rotateX(Math.PI / 2); // Changed from rotateZ to rotateX
        const tireMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111,
            roughness: 0.9
        });
        const tire = new THREE.Mesh(tireGeometry, tireMaterial);
        tire.userData.system = 'braking';
        originalMaterials.set(tire, tireMaterial.clone());
        
        // Wheel rim
        const rimGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.31, 12);
        rimGeometry.rotateX(Math.PI / 2); // Changed from rotateZ to rotateX
        const rimMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            metalness: 0.9,
            roughness: 0.3
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.userData.system = 'braking';
        originalMaterials.set(rim, rimMaterial.clone());
        
        // Wheel spokes
        const spokesMaterial = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            metalness: 0.9,
            roughness: 0.3
        });
        
        for (let i = 0; i < 5; i++) {
            const spokeGeometry = new THREE.BoxGeometry(0.03, 0.25, 0.05);
            const spoke = new THREE.Mesh(spokeGeometry, spokesMaterial);
            spoke.position.z = 0;
            spoke.rotation.z = (Math.PI * 2 / 5) * i;
            spoke.userData.system = 'braking';
            originalMaterials.set(spoke, spokesMaterial.clone());
            rim.add(spoke);
        }
        
        // Brake disc
        const discGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 12);
        discGeometry.rotateX(Math.PI / 2); // Changed from rotateZ to rotateX
        const discMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x555555,
            metalness: 0.8,
            roughness: 0.4
        });
        const disc = new THREE.Mesh(discGeometry, discMaterial);
        disc.position.z = isFront ? 0.1 : -0.1; // Changed position.x to position.z
        disc.userData.system = 'braking';
        originalMaterials.set(disc, discMaterial.clone());
        
        // Brake lines
        const brakeLineGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0.15),
                new THREE.Vector3(0, 0.2, 0.15),
                new THREE.Vector3(0, 0.4, 0)
            ]),
            8, 0.02, 4, false
        );
        const brakeLineMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.5,
            roughness: 0.5
        });
        const brakeLine = new THREE.Mesh(brakeLineGeometry, brakeLineMaterial);
        brakeLine.userData.system = 'braking';
        originalMaterials.set(brakeLine, brakeLineMaterial.clone());
        
        // Brake caliper
        const caliperGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.1);
        const caliperMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x880000,
            metalness: 0.6,
            roughness: 0.5
        });
        const caliper = new THREE.Mesh(caliperGeometry, caliperMaterial);
        caliper.position.z = isFront ? 0.18 : -0.18; // Changed position.x to position.z
        caliper.userData.system = 'braking';
        originalMaterials.set(caliper, caliperMaterial.clone());
        
        // Suspension arm - correctly positioned
        const armGeometry = new THREE.BoxGeometry(0.6, 0.08, 0.08);
        const armMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            metalness: 0.7,
            roughness: 0.5
        });
        const arm = new THREE.Mesh(armGeometry, armMaterial);
        arm.position.y = 0.15;
        arm.userData.system = 'suspension';
        originalMaterials.set(arm, armMaterial.clone());
        
        // Suspension spring - correctly positioned inside the wheel well
        const springGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8);
        const springMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x666666,
            metalness: 0.7,
            roughness: 0.4
        });
        const spring = new THREE.Mesh(springGeometry, springMaterial);
        spring.position.y = 0.35;
        spring.userData.system = 'suspension';
        originalMaterials.set(spring, springMaterial.clone());
        
        // Spring coils (for detail)
        const coilGeometry = new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI * 2);
        const coilMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.7,
            roughness: 0.5
        });
        
        for (let i = 0; i < 5; i++) {
            const coil = new THREE.Mesh(coilGeometry, coilMaterial);
            coil.position.y = 0.25 + (i * 0.05) - 0.1;
            coil.scale.set(0.8, 0.2, 0.8);
            coil.userData.system = 'suspension';
            originalMaterials.set(coil, coilMaterial.clone());
            spring.add(coil);
        }
        
        // Shock absorber
        const shockGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
        const shockMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0.8,
            roughness: 0.3
        });
        const shock = new THREE.Mesh(shockGeometry, shockMaterial);
        shock.position.set(0, 0.35, -0.13);
        shock.userData.system = 'suspension';
        originalMaterials.set(shock, shockMaterial.clone());
        
        group.add(tire, rim, disc, caliper, brakeLine, arm, spring, shock);
        group.position.set(x, 0.4, z);
        return group;
    }
    
    // Create four wheels
    const wheelFL = createWheel(1.5, 1, true);
    const wheelFR = createWheel(1.5, -1, true);
    const wheelRL = createWheel(-1.5, 1, false);
    const wheelRR = createWheel(-1.5, -1, false);
    
    // Fuel system
    const fuelTankGeometry = new THREE.BoxGeometry(1, 0.4, 1.5);
    const fuelTankMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        metalness: 0.5,
        roughness: 0.5
    });
    const fuelTank = new THREE.Mesh(fuelTankGeometry, fuelTankMaterial);
    fuelTank.position.set(-1.5, 0.4, 0);
    fuelTank.userData.system = 'fuel';
    originalMaterials.set(fuelTank, fuelTankMaterial.clone());
    
    // Fuel cap
    const fuelCapGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
    const fuelCapMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.7,
        roughness: 0.5
    });
    const fuelCap = new THREE.Mesh(fuelCapGeometry, fuelCapMaterial);
    fuelCap.position.set(-1.2, 0.95, 1);
    fuelCap.userData.system = 'fuel';
    originalMaterials.set(fuelCap, fuelCapMaterial.clone());
    
    // Fuel lines
    const fuelLineGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.5, 0.5, 0),
            new THREE.Vector3(-1, 0.5, 0),
            new THREE.Vector3(0, 0.5, 0.2),
            new THREE.Vector3(1.2, 0.7, 0.3),
            new THREE.Vector3(1.5, 0.9, 0.3)
        ]), 
        30, 0.02, 8, false
    );
    const fuelLineMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        metalness: 0.5,
        roughness: 0.5
    });
    const fuelLine = new THREE.Mesh(fuelLineGeometry, fuelLineMaterial);
    fuelLine.userData.system = 'fuel';
    originalMaterials.set(fuelLine, fuelLineMaterial.clone());
    
    // Fuel pump
    const fuelPumpGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 8);
    const fuelPumpMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        metalness: 0.7,
        roughness: 0.5
    });
    const fuelPump = new THREE.Mesh(fuelPumpGeometry, fuelPumpMaterial);
    fuelPump.position.set(-1, 0.5, 0.2);
    fuelPump.userData.system = 'fuel';
    originalMaterials.set(fuelPump, fuelPumpMaterial.clone());
    
    // Fuel injectors
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            const injectorGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 8);
            const injectorMaterial = new THREE.MeshStandardMaterial({
                color: 0x222222,
                metalness: 0.7,
                roughness: 0.5
            });
            const injector = new THREE.Mesh(injectorGeometry, injectorMaterial);
            injector.position.set(1.3 + i * 0.4, 1.1, -0.4 + j * 0.8);
            injector.userData.system = 'fuel';
            originalMaterials.set(injector, injectorMaterial.clone());
            group.add(injector);
        }
    }
    
    // Electrical system - battery
    const batteryGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.6);
    const batteryMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        metalness: 0.5,
        roughness: 0.9
    });
    const battery = new THREE.Mesh(batteryGeometry, batteryMaterial);
    battery.position.set(1.0, 0.7, -0.7);
    battery.userData.system = 'electrical';
    originalMaterials.set(battery, batteryMaterial.clone());
    
    // Battery terminals
    const posTerminalGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 8);
    const posTerminalMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        metalness: 0.7,
        roughness: 0.5
    });
    const posTerminal = new THREE.Mesh(posTerminalGeometry, posTerminalMaterial);
    posTerminal.position.set(1.15, 0.88, -0.7);
    posTerminal.userData.system = 'electrical';
    originalMaterials.set(posTerminal, posTerminalMaterial.clone());
    
    const negTerminalGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 8);
    const negTerminalMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        metalness: 0.7,
        roughness: 0.5
    });
    const negTerminal = new THREE.Mesh(negTerminalGeometry, negTerminalMaterial);
    negTerminal.position.set(0.85, 0.88, -0.7);
    negTerminal.userData.system = 'electrical';
    originalMaterials.set(negTerminal, negTerminalMaterial.clone());
    
    // Electrical wiring
    const wireGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(1.15, 0.88, -0.7), // From positive terminal
            new THREE.Vector3(1.15, 0.95, -0.7),
            new THREE.Vector3(1.4, 0.95, -0.5),
            new THREE.Vector3(1.6, 0.95, 0),
            new THREE.Vector3(1.5, 1.1, 0)
        ]), 
        20, 0.02, 8, false
    );
    const wireMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        metalness: 0.1,
        roughness: 0.9
    });
    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    wire.userData.system = 'electrical';
    originalMaterials.set(wire, wireMaterial.clone());
    
    // Ground wire
    const groundWireGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.85, 0.88, -0.7), // From negative terminal
            new THREE.Vector3(0.85, 0.7, -0.7),
            new THREE.Vector3(0.85, 0.5, -0.7),
            new THREE.Vector3(0.85, 0.3, -0.7)
        ]), 
        15, 0.02, 8, false
    );
    const groundWireMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        metalness: 0.1,
        roughness: 0.9
    });
    const groundWire = new THREE.Mesh(groundWireGeometry, groundWireMaterial);
    groundWire.userData.system = 'electrical';
    originalMaterials.set(groundWire, groundWireMaterial.clone());
    
    // Alternator
    const alternatorGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 12);
    const alternatorMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.8,
        roughness: 0.3
    });
    const alternator = new THREE.Mesh(alternatorGeometry, alternatorMaterial);
    alternator.rotation.x = Math.PI / 2;
    alternator.position.set(1.8, 0.7, -0.6);
    alternator.userData.system = 'electrical';
    originalMaterials.set(alternator, alternatorMaterial.clone());
    
    // Cooling system - radiator
    const radiatorGeometry = new THREE.BoxGeometry(0.2, 0.5, 1.4);
    const radiatorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x888888,
        metalness: 0.7,
        roughness: 0.3
    });
    const radiator = new THREE.Mesh(radiatorGeometry, radiatorMaterial);
    radiator.position.set(2.1, 0.7, 0);
    radiator.userData.system = 'cooling';
    originalMaterials.set(radiator, radiatorMaterial.clone());
    
    // Radiator grille detail
    for (let i = 0; i < 8; i++) {
        const grilleGeometry = new THREE.BoxGeometry(0.01, 0.48, 0.1);
        const grilleMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            metalness: 0.7,
            roughness: 0.5
        });
        const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
        grille.position.set(2.0, 0.7, -0.6 + i * 0.2);
        grille.userData.system = 'cooling';
        originalMaterials.set(grille, grilleMaterial.clone());
        group.add(grille);
    }
    
    // Radiator cap
    const radiatorCapGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 12);
    const radiatorCapMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.8,
        roughness: 0.3
    });
    const radiatorCap = new THREE.Mesh(radiatorCapGeometry, radiatorCapMaterial);
    radiatorCap.rotation.x = Math.PI / 2;
    radiatorCap.position.set(2.1, 0.95, 0.5);
    radiatorCap.userData.system = 'cooling';
    originalMaterials.set(radiatorCap, radiatorCapMaterial.clone());
    
    // Cooling hoses - upper
    const coolantHoseGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.0, 0.9, 0.4),
            new THREE.Vector3(1.8, 0.9, 0.4),
            new THREE.Vector3(1.6, 0.9, 0.4),
            new THREE.Vector3(1.4, 1.0, 0.4)
        ]), 
        20, 0.05, 8, false
    );
    const coolantHoseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        metalness: 0.3,
        roughness: 0.9
    });
    const coolantHose = new THREE.Mesh(coolantHoseGeometry, coolantHoseMaterial);
    coolantHose.userData.system = 'cooling';
    originalMaterials.set(coolantHose, coolantHoseMaterial.clone());
    
    // Return hose - lower
    const returnHoseGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.0, 0.5, -0.4),
            new THREE.Vector3(1.8, 0.5, -0.4),
            new THREE.Vector3(1.6, 0.6, -0.4),
            new THREE.Vector3(1.4, 0.8, -0.4)
        ]), 
        20, 0.05, 8, false
    );
    const returnHose = new THREE.Mesh(returnHoseGeometry, coolantHoseMaterial.clone());
    returnHose.userData.system = 'cooling';
    originalMaterials.set(returnHose, coolantHoseMaterial.clone());
    
    // Thermostat housing
    const thermostatGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const thermostatMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        metalness: 0.7,
        roughness: 0.4
    });
    const thermostat = new THREE.Mesh(thermostatGeometry, thermostatMaterial);
    thermostat.position.set(1.4, 0.9, 0);
    thermostat.userData.system = 'cooling';
    originalMaterials.set(thermostat, thermostatMaterial.clone());
    
    // Cooling fan
    const fanHubGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 12);
    const fanHubMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.7,
        roughness: 0.5
    });
    const fanHub = new THREE.Mesh(fanHubGeometry, fanHubMaterial);
    fanHub.rotation.z = Math.PI / 2;
    fanHub.position.set(1.95, 0.7, 0);
    fanHub.userData.system = 'cooling';
    originalMaterials.set(fanHub, fanHubMaterial.clone());
    
    // Fan blades
    for (let i = 0; i < 6; i++) {
        const bladeGeometry = new THREE.BoxGeometry(0.05, 0.01, 0.25);
        const bladeMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.7,
            roughness: 0.5
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.set(0, 0, 0);
        blade.rotation.y = (Math.PI * 2 / 6) * i;
        blade.userData.system = 'cooling';
        originalMaterials.set(blade, bladeMaterial.clone());
        fanHub.add(blade);
    }
    
    // Exhaust system
    const exhaustPipeGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(1.3, 0.5, -0.4),
            new THREE.Vector3(0.5, 0.3, -0.6),
            new THREE.Vector3(-0.5, 0.3, -0.6),
            new THREE.Vector3(-1.5, 0.3, -0.6),
            new THREE.Vector3(-2.2, 0.3, -0.6)
        ]), 
        30, 0.06, 8, false
    );
    const exhaustPipeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x777777,
        metalness: 0.8,
        roughness: 0.3
    });
    const exhaustPipe = new THREE.Mesh(exhaustPipeGeometry, exhaustPipeMaterial);
    exhaustPipe.userData.system = 'exhaust';
    originalMaterials.set(exhaustPipe, exhaustPipeMaterial.clone());
    
    // Catalytic converter
    const catalyticGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.4, 12);
    const catalyticMaterial = new THREE.MeshStandardMaterial({
        color: 0x999999,
        metalness: 0.8,
        roughness: 0.3
    });
    const catalytic = new THREE.Mesh(catalyticGeometry, catalyticMaterial);
    catalytic.rotation.z = Math.PI / 2;
    catalytic.position.set(0.2, 0.3, -0.6);
    catalytic.userData.system = 'exhaust';
    originalMaterials.set(catalytic, catalyticMaterial.clone());
    
    // Muffler
    const mufflerGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16);
    const mufflerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x555555,
        metalness: 0.8,
        roughness: 0.4
    });
    const muffler = new THREE.Mesh(mufflerGeometry, mufflerMaterial);
    muffler.rotation.z = Math.PI / 2;
    muffler.position.set(-1.8, 0.3, -0.6);
    muffler.userData.system = 'exhaust';
    originalMaterials.set(muffler, mufflerMaterial.clone());
    
    // Exhaust tip
    const exhaustTipGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.15, 12);
    const exhaustTipMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        metalness: 0.9,
        roughness: 0.2
    });
    const exhaustTip = new THREE.Mesh(exhaustTipGeometry, exhaustTipMaterial);
    exhaustTip.rotation.z = Math.PI / 2;
    exhaustTip.position.set(-2.3, 0.3, -0.6);
    exhaustTip.userData.system = 'exhaust';
    originalMaterials.set(exhaustTip, exhaustTipMaterial.clone());
    
    // Exhaust hangers
    for (let i = 0; i < 3; i++) {
        const hangerGeometry = new THREE.BoxGeometry(0.02, 0.2, 0.02);
        const hangerMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            metalness: 0.5,
            roughness: 0.5
        });
        const hanger = new THREE.Mesh(hangerGeometry, hangerMaterial);
        hanger.position.set(-0.8 - i * 0.7, 0.45, -0.6);
        hanger.userData.system = 'exhaust';
        originalMaterials.set(hanger, hangerMaterial.clone());
        group.add(hanger);
    }
    
    // Interior components (seats)
    const seatGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const seatMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.2,
        roughness: 0.9
    });
    
    const driverSeat = new THREE.Mesh(seatGeometry, seatMaterial);
    driverSeat.position.set(-0.2, 0.8, 0.5);
    driverSeat.userData.system = 'body';
    originalMaterials.set(driverSeat, seatMaterial.clone());
    
    // Seat back
    const seatBackGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.6);
    const seatBackMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.2,
        roughness: 0.9
    });
    const driverSeatBack = new THREE.Mesh(seatBackGeometry, seatBackMaterial);
    driverSeatBack.position.set(-0.5, 1.2, 0.5);
    driverSeatBack.userData.system = 'body';
    originalMaterials.set(driverSeatBack, seatBackMaterial.clone());
    
    const passengerSeat = new THREE.Mesh(seatGeometry.clone(), seatMaterial.clone());
    passengerSeat.position.set(-0.2, 0.8, -0.5);
    passengerSeat.userData.system = 'body';
    originalMaterials.set(passengerSeat, seatMaterial.clone());
    
    const passengerSeatBack = new THREE.Mesh(seatBackGeometry.clone(), seatBackMaterial.clone());
    passengerSeatBack.position.set(-0.5, 1.2, -0.5);
    passengerSeatBack.userData.system = 'body';
    originalMaterials.set(passengerSeatBack, seatBackMaterial.clone());
    
    // Dashboard
    const dashboardGeometry = new THREE.BoxGeometry(0.8, 0.3, 1.7);
    const dashboardMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        metalness: 0.3,
        roughness: 0.9
    });
    const dashboard = new THREE.Mesh(dashboardGeometry, dashboardMaterial);
    dashboard.position.set(0.5, 1.0, 0);
    dashboard.userData.system = 'body';
    originalMaterials.set(dashboard, dashboardMaterial.clone());
    
    // Instrument cluster
    const clusterGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.6);
    const clusterMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.5,
        roughness: 0.8
    });
    const cluster = new THREE.Mesh(clusterGeometry, clusterMaterial);
    cluster.position.set(0.5, 1.1, 0.3);
    cluster.userData.system = 'electrical';
    originalMaterials.set(cluster, clusterMaterial.clone());
    
    // Steering wheel
    const steeringWheelGeometry = new THREE.TorusGeometry(0.15, 0.03, 8, 24);
    const steeringWheelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111,
        metalness: 0.3,
        roughness: 0.9
    });
    const steeringWheel = new THREE.Mesh(steeringWheelGeometry, steeringWheelMaterial);
    steeringWheel.position.set(0.3, 1.1, 0.4);
    steeringWheel.rotation.y = Math.PI / 2;
    steeringWheel.userData.system = 'body';
    originalMaterials.set(steeringWheel, steeringWheelMaterial.clone());
    
    // Steering column
    const steeringColumnGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
    const steeringColumnMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.7,
        roughness: 0.5
    });
    const steeringColumn = new THREE.Mesh(steeringColumnGeometry, steeringColumnMaterial);
    steeringColumn.rotation.x = Math.PI / 4;
    steeringColumn.position.set(0.45, 0.95, 0.4);
    steeringColumn.userData.system = 'body';
    originalMaterials.set(steeringColumn, steeringColumnMaterial.clone());
    
    // Bumpers
    const frontBumperGeometry = new THREE.BoxGeometry(0.3, 0.4, 2);
    const bumperMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        metalness: 0.7,
        roughness: 0.3
    });
    const frontBumper = new THREE.Mesh(frontBumperGeometry, bumperMaterial);
    frontBumper.position.set(2.3, 0.4, 0);
    frontBumper.userData.system = 'body';
    originalMaterials.set(frontBumper, bumperMaterial.clone());
    
    const rearBumperGeometry = new THREE.BoxGeometry(0.3, 0.4, 2);
    const rearBumper = new THREE.Mesh(rearBumperGeometry, bumperMaterial.clone());
    rearBumper.position.set(-2.3, 0.4, 0);
    rearBumper.userData.system = 'body';
    originalMaterials.set(rearBumper, bumperMaterial.clone());
    
    // Headlights
    const headlightGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
    headlightGeometry.rotateX(Math.PI / 2); // Properly oriented
    const headlightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffcc,
        emissive: 0xffffcc,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9
    });
    
    const headlightLeft = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightLeft.position.set(2.32, 0.7, 0.7);
    headlightLeft.userData.system = 'electrical';
    originalMaterials.set(headlightLeft, headlightMaterial.clone());
    
    const headlightRight = new THREE.Mesh(headlightGeometry, headlightMaterial.clone());
    headlightRight.position.set(2.32, 0.7, -0.7);
    headlightRight.userData.system = 'electrical';
    originalMaterials.set(headlightRight, headlightMaterial.clone());
    
    // Taillights
    const taillightGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
    taillightGeometry.rotateX(Math.PI / 2); // Properly oriented
    const taillightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9
    });
    
    const taillightLeft = new THREE.Mesh(taillightGeometry, taillightMaterial);
    taillightLeft.position.set(-2.32, 0.7, 0.7);
    taillightLeft.userData.system = 'electrical';
    originalMaterials.set(taillightLeft, taillightMaterial.clone());
    
    const taillightRight = new THREE.Mesh(taillightGeometry, taillightMaterial.clone());
    taillightRight.position.set(-2.32, 0.7, -0.7);
    taillightRight.userData.system = 'electrical';
    originalMaterials.set(taillightRight, taillightMaterial.clone());
    
    // Door handles
    const doorHandleGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.3);
    const doorHandleMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        metalness: 0.9,
        roughness: 0.3
    });
    
    const leftDoorHandle = new THREE.Mesh(doorHandleGeometry, doorHandleMaterial);
    leftDoorHandle.position.set(0.2, 1.0, 0.98);
    leftDoorHandle.userData.system = 'body';
    originalMaterials.set(leftDoorHandle, doorHandleMaterial.clone());
    
    const rightDoorHandle = new THREE.Mesh(doorHandleGeometry, doorHandleMaterial.clone());
    rightDoorHandle.position.set(0.2, 1.0, -0.98);
    rightDoorHandle.userData.system = 'body';
    originalMaterials.set(rightDoorHandle, doorHandleMaterial.clone());
    
    // Add all components to the group
    group.add(
        body, roof, windshield, rearWindshield,
        leftWindowFront, rightWindowFront, leftWindowRear, rightWindowRear,
        engine, hood, intake,
        wheelFL, wheelFR, wheelRL, wheelRR,
        fuelTank, fuelLine, fuelPump, fuelCap,
        battery, posTerminal, negTerminal, wire, groundWire, alternator,
        radiator, coolantHose, returnHose, thermostat, fanHub, radiatorCap,
        exhaustPipe, catalytic, muffler, exhaustTip,
        driverSeat, driverSeatBack, passengerSeat, passengerSeatBack,
        dashboard, cluster, steeringWheel, steeringColumn,
        frontBumper, rearBumper,
        headlightLeft, headlightRight, taillightLeft, taillightRight,
        leftDoorHandle, rightDoorHandle
    );
    
    // Assign the group to carModel and add to scene
    carModel = group;
    scene.add(carModel);
    
    // Show the engine system by default
    //setTimeout(() => {
      //  highlightSystem('engine');
    //}, 500);
}
    
    // Highlight system function
    function highlightSystem(systemName) {
        if (!carModel) return;
        
        // Reset all materials
        carModel.traverse(function (child) {
            if (child.isMesh && originalMaterials.has(child)) {
                child.material = originalMaterials.get(child).clone();
                child.material.transparent = true;
                
                // Fade out parts that are not in the selected system
                if (child.userData.system !== systemName) {
                    child.material.opacity = 0.2;
                } else {
                    child.material.opacity = 1.0;
                }
            }
        });
        
        // Apply highlight material to selected system
        carModel.traverse(function (child) {
            if (child.isMesh && child.userData.system === systemName) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xff5722,
                    emissive: 0xff5722,
                    emissiveIntensity: 0.2,
                    metalness: 0.8,
                    roughness: 0.2,
                    transparent: true,
                    opacity: 1.0
                });
            }
        });
    }
    
    // Connect sidebar items to systems
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const itemText = this.textContent.trim();
            
            // Determine which system to show based on the text
            let systemId = '';
            if (itemText.includes('Engine')) {
                systemId = 'engine';
            } else if (itemText.includes('Electrical')) {
                systemId = 'electrical';
            } else if (itemText.includes('Braking')) {
                systemId = 'braking';
            } else if (itemText.includes('Suspension')) {
                systemId = 'suspension';
            } else if (itemText.includes('Fuel')) {
                systemId = 'fuel';
            } else if (itemText.includes('Cooling')) {
                systemId = 'cooling';
            } else if (itemText.includes('Exhaust')) {
                systemId = 'exhaust';
            } else if (itemText.includes('Body')) {
                systemId = 'body';
            }
            
            // Show the selected system
            if (systemId) {
                highlightSystem(systemId);
            }
            
            // Remove active class from all items and add to clicked item
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Return public methods
    return {
        highlightSystem: highlightSystem
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Replace the SVG with 3D model
    const carViewer = initCarViewer();
});