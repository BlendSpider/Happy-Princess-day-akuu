import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Sparkles } from 'lucide-react';
import { DestinationFrame, RoyalButton } from '../components/ui/RoyalUI';
import { soundEngine } from '../audio/soundEngine';

export const DreamCloudWorld: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const swirlRef = useRef(0);
  const [swirlCount, setSwirlCount] = useState(0);

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

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    const w = container.clientWidth || 720;
    const h = container.clientHeight || 420;
    renderer.setSize(w, h);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F9DCE7');
    scene.fog = new THREE.Fog('#F9DCE7', 8, 22);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 2.2, 6.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 9;
    controls.enableDamping = !isSoftwareGl;

    const hemi = new THREE.HemisphereLight('#FFF9F7', '#75476F', 0.9);
    scene.add(hemi);
    const key = new THREE.DirectionalLight('#FFD7C2', 2.0);
    key.position.set(4, 7, 5);
    scene.add(key);

    // Snow Globe Base (Lathe / Cylinders)
    const goldMat = new THREE.MeshStandardMaterial({ color: '#E8C98C', roughness: 0.22, metalness: 0.9 });
    const blushMat = new THREE.MeshStandardMaterial({ color: '#F6B6CE', roughness: 0.35, metalness: 0.1 });
    const pearlMat = new THREE.MeshStandardMaterial({ color: '#FFF9F7', roughness: 0.3, metalness: 0.08 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#FFFFFF',
      transparent: true,
      opacity: isSoftwareGl ? 0.25 : 0.28,
      roughness: 0.08,
      metalness: 0.05,
      clearcoat: 1.0,
      depthWrite: false,
    });

    const globeGroup = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 2.0, 0.75, 32), goldMat);
    base.position.y = -1.65;
    globeGroup.add(base);

    const snowFloor = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.65, 0.2, 32), pearlMat);
    snowFloor.position.y = -1.2;
    globeGroup.add(snowFloor);

    // Miniature castle inside globe
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 1.35, 16), pearlMat);
    tower.position.y = -0.45;
    globeGroup.add(tower);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.8, 16), blushMat);
    roof.position.y = 0.62;
    globeGroup.add(roof);
    const sideTowerL = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.95, 12), pearlMat);
    sideTowerL.position.set(-0.65, -0.65, 0.15);
    globeGroup.add(sideTowerL);
    const sideRoofL = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 12), blushMat);
    sideRoofL.position.set(-0.65, 0.06, 0.15);
    globeGroup.add(sideRoofL);

    const glassDome = new THREE.Mesh(new THREE.SphereGeometry(2.05, 32, 24), glassMat);
    glassDome.renderOrder = 2;
    globeGroup.add(glassDome);
    scene.add(globeGroup);

    // Swirling Glitter / Petals inside globe
    const count = 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.8;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const snowGeo = new THREE.BufferGeometry();
    snowGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const snowMat = new THREE.PointsMaterial({ color: '#FFF9F7', size: 0.09, transparent: true, opacity: 0.9 });
    const snowPoints = new THREE.Points(snowGeo, snowMat);
    globeGroup.add(snowPoints);

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 720;
      const nh = container.clientHeight || 420;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
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
        if (state === gl.UNSIGNALED) frameId = window.setTimeout(poll, 5);
        else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const dt = clock.getDelta();
      controls.update();
      swirlRef.current = THREE.MathUtils.damp(swirlRef.current, 0.15, 1.5, dt);
      snowPoints.rotation.y += dt * (0.4 + swirlRef.current * 4.5);
      globeGroup.rotation.y += dt * 0.15;
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
      controls.dispose();
      envRT.dispose();
      [goldMat, blushMat, pearlMat, glassMat, snowMat].forEach((m) => m.dispose());
      [base.geometry, snowFloor.geometry, tower.geometry, roof.geometry, sideTowerL.geometry, sideRoofL.geometry, glassDome.geometry, snowGeo].forEach((g) => g.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  const handleShakeGlobe = () => {
    soundEngine.playSfx('glass');
    swirlRef.current = 2.5;
    setSwirlCount((c) => c + 1);
  };

  return (
    <DestinationFrame
      title="Dream Cloud World"
      subtitle="Drag to orbit Akuu’s 3D Enchanted Snow Globe & swirl golden stardust"
      chapterNumber={21}
      onBack={onBack}
      rightSlot={
        <RoyalButton variant="gold" size="sm" onClick={handleShakeGlobe}>
          <Sparkles className="w-3.5 h-3.5" />
          Swirl Snow Globe ({swirlCount})
        </RoyalButton>
      }
    >
      <div className="royal-card rounded-3xl overflow-hidden border border-[#E8C98C]/70">
        <div ref={mountRef} className="w-full h-[440px] sm:h-[520px] bg-[#F9DCE7]" />
        <div className="px-6 py-4 bg-[#FFF9F7] border-t border-[#E8C98C]/35 flex flex-wrap items-center justify-between gap-4 text-xs text-[#75476F]">
          <span>Drag anywhere on the crystal dome to orbit around the miniature castle.</span>
          <span>Scroll or pinch to zoom gently closer.</span>
        </div>
      </div>
    </DestinationFrame>
  );
};
