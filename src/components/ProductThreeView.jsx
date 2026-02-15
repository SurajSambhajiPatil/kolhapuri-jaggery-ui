import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ProductThreeView({ imageUrl }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 360;
    const height = mount.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl);
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.BoxGeometry(1.9, 2.5, 0.3);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const materials = [
      material, material,
      material, material,
      material, material,
    ];
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.rotation.x = -0.06;
    scene.add(mesh);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const point = new THREE.PointLight(0xffffff, 0.8);
    point.position.set(3, 4, 5);
    scene.add(point);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth || width;
      const h = mount.clientHeight || height;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      texture.dispose();
      geometry.dispose();
      materials.forEach((m) => m.dispose());
    };
  }, [imageUrl]);

  return (
    <div ref={mountRef} className="w-full h-[280px] rounded-2xl bg-gray-50" />
  );
}
