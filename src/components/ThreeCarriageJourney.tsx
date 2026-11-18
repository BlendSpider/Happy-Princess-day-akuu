import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const _vec3 = new THREE.Vector3();
const _dummy = new THREE.Object3D();

export const ThreeCarriageJourney: React.FC<{ progress: number }> = ({ progress }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const c = document.createElement('canvas');
        const gl = c.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;

    const canvasEl = renderer.domElement;
    canvasEl.style.width = '100%';
    canvasEl.style.height = '100%';
    canvasEl.style.display = 'block';
    container.appendChild(canvasEl);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };
    canvasEl.addEventListener('webglcontextlost', onContextLost);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1B1026');
    scene.fog = new THREE.FogExp2('#2A183B', 0.016);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 200);
    camera.position.set(0, 3.2, 13);

    // Three-point warm/cool lighting
    const hemi = new THREE.HemisphereLight('#DCCCFB', '#3B2138', 0.9);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight('#FFD7C2', 2.2);
    keyLight.position.set(10, 14, 12);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight('#F6B6CE', 1.4);
    rimLight.position.set(-8, 6, -10);
    scene.add(rimLight);

    // Shared PBR materials
    const blushMat = new THREE.MeshStandardMaterial({ color: '#F6B6CE', roughness: 0.35, metalness: 0.15 });
    const pearlMat = new THREE.MeshStandardMaterial({ color: '#FFF9F7', roughness: 0.25, metalness: 0.1 });
    const goldMat = new THREE.MeshStandardMaterial({ color: '#E8C98C', roughness: 0.2, metalness: 0.9 });
    const windowGlowMat = new THREE.MeshStandardMaterial({
      color: '#FFE7A8',
      emissive: '#FFC96B',
      emissiveIntensity: 1.6,
      roughness: 0.2,
    });

    // Composite 8-part Flying Carriage (THREE.Group)
    const carriage = new THREE.Group();
    const cabin = new THREE.Mesh(new THREE.SphereGeometry(1.35, 24, 18), blushMat);
    cabin.scale.set(1.2, 0.95, 0.95);
    cabin.position.y = 1.4;
    carriage.add(cabin);

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.28, 1.4), goldMat);
    chassis.position.y = 0.45;
    carriage.add(chassis);

    const roofCrown = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.6, 12), goldMat);
    roofCrown.position.y = 2.85;
    carriage.add(roofCrown);

    const windowMesh = new THREE.Mesh(new THREE.CircleGeometry(0.46, 20), windowGlowMat);
    windowMesh.position.set(0, 1.45, 1.25);
    carriage.add(windowMesh);

    const windowBack = windowMesh.clone();
    windowBack.rotation.y = Math.PI;
    windowBack.position.z = -1.25;
    carriage.add(windowBack);

    const wheels: THREE.Mesh[] = [];
    const wheelGeo = new THREE.TorusGeometry(0.55, 0.08, 10, 24);
    const wheelOffsets: Array<[number, number, number]> = [
      [-1.1, 0.4, 0.85],
      [1.1, 0.4, 0.85],
      [-1.1, 0.4, -0.85],
      [1.1, 0.4, -0.85],
    ];
    wheelOffsets.forEach(([x, y, z]) => {
      const w = new THREE.Mesh(wheelGeo, goldMat);
      w.position.set(x, y, z);
      wheels.push(w);
      carriage.add(w);
    });

    const lantern = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), windowGlowMat);
    lantern.position.set(1.65, 1.35, 0);
    carriage.add(lantern);

    carriage.position.set(-2.2, 1.2, 4.5);
    scene.add(carriage);

    // Composite Distant Princess Castle (multi-part THREE.Group)
    const castle = new THREE.Group();
    const keep = new THREE.Mesh(new THREE.BoxGeometry(6, 5.5, 4.5), pearlMat);
    keep.position.y = 2.75;
    castle.add(keep);

    const towerPositions: Array<[number, number, number, number]> = [
      [-3.4, 3.6, 1.6, 6.2],
      [3.4, 3.6, 1.6, 6.2],
      [-1.8, 4.8, -1.2, 8.2],
      [1.8, 4.8, -1.2, 8.2],
      [0, 6.2, 0, 10.2],
    ];
    towerPositions.forEach(([x, y, z, h]) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.88, h, 16), pearlMat);
      col.position.set(x, h / 2, z);
      castle.add(col);
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.95, 2.5, 16), blushMat);
      spire.position.set(x, h + 1.25, z);
      castle.add(spire);
      const finial = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), goldMat);
      finial.position.set(x, h + 2.65, z);
      castle.add(finial);
    });
    const gate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.3), windowGlowMat);
    gate.position.set(0, 1.2, 2.28);
    castle.add(gate);
    castle.position.set(0, -1.5, -24);
    scene.add(castle);

    // Instanced Cloud Puff Field
    const cloudCount = 28;
    const cloudGeo = new THREE.SphereGeometry(1.5, 12, 10);
    const cloudMat = new THREE.MeshStandardMaterial({ color: '#F9DCE7', roughness: 0.9, metalness: 0.0 });
    const clouds = new THREE.InstancedMesh(cloudGeo, cloudMat, cloudCount);
    const cloudSeeds: Array<{ x: number; y: number; z: number; sx: number; sy: number }> = [];
    for (let i = 0; i < cloudCount; i++) {
      const x = (Math.random() - 0.5) * 34;
      const y = -3.2 + Math.random() * 5;
      const z = -22 + Math.random() * 32;
      const sx = 1.2 + Math.random() * 1.4;
      const sy = 0.55 + Math.random() * 0.4;
      cloudSeeds.push({ x, y, z, sx, sy });
      _dummy.position.set(x, y, z);
      _dummy.scale.set(sx, sy, 0.9);
      _dummy.updateMatrix();
      clouds.setMatrixAt(i, _dummy.matrix);
    }
    clouds.instanceMatrix.needsUpdate = true;
    clouds.frustumCulled = false;
    scene.add(clouds);

    // Starfield Points
    const starCount = 260;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 70;
      starPositions[i * 3 + 1] = Math.random() * 30 - 2;
      starPositions[i * 3 + 2] = -40 + Math.random() * 50;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: '#FFF3D6', size: 0.24, transparent: true, opacity: 0.9 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const p = progressRef.current;

      // Glide carriage smoothly toward the castle
      const targetX = THREE.MathUtils.lerp(-2.5, 0.2, p);
      const targetZ = THREE.MathUtils.lerp(5, -13, p);
      carriage.position.x = THREE.MathUtils.damp(carriage.position.x, targetX, 3.5, dt);
      carriage.position.z = THREE.MathUtils.damp(carriage.position.z, targetZ, 3.5, dt);
      carriage.position.y = 1.2 + Math.sin(elapsed * 2.1) * 0.28;
      carriage.rotation.z = Math.sin(elapsed * 1.4) * 0.04;
      wheels.forEach((w) => {
        w.rotation.z -= dt * 3.5;
      });

      // Dolly camera toward castle
      const camZ = THREE.MathUtils.lerp(13, -4.5, p);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 3.0, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 3.2 + Math.sin(elapsed * 0.8) * 0.15, 2.5, dt);
      _vec3.set(0, 2.2, -22);
      camera.lookAt(_vec3);

      stars.rotation.y += dt * 0.02;

      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      envRT.dispose();
      [blushMat, pearlMat, goldMat, windowGlowMat, cloudMat, starMat].forEach((m) => m.dispose());
      [cabin.geometry, chassis.geometry, roofCrown.geometry, windowMesh.geometry, wheelGeo, lantern.geometry, keep.geometry, gate.geometry, cloudGeo, starGeo].forEach((g) => g.dispose());
      renderer.dispose();
      if (canvasEl.parentNode === container) container.removeChild(canvasEl);
    };
  }, []);

  if (webglFailed) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B1026] via-[#4A274F] to-[#F6B6CE]/40 flex items-center justify-center">
        <img
          src="/src/assets/images/memory_rose_carriage_1794980444548.jpg"
          alt="Royal Carriage Journey"
          className="w-full h-full object-cover opacity-70"
        />
      </div>
    );
  }

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
};
