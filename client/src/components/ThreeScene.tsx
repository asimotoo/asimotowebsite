import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, ContactShadows, PresentationControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function YamahaR1Model() {
  const { scene } = useGLTF("/models/2022_yamaha_r1.glb");
  const modelRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (modelRef.current) {
      const scrollY = window.scrollY;
      // Initial rotation (approx 45 + 90 + 30 - 15 + 5 degrees) + scroll rotation
      const targetRotation = (Math.PI / 4 + Math.PI / 2 + Math.PI / 6 - Math.PI / 12 + Math.PI / 36) + (scrollY * 0.002);

      
      // Smooth interpolation (Lerp)
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        targetRotation,
        0.1 // Smoothing factor
      );
    }
  });
  
  return <primitive ref={modelRef} object={scene} scale={2.5} position={[0, -0.6, 0]} rotation={[0, Math.PI / 1.5, 0]} />;
}

export function ThreeScene({ scrollProgress }: { scrollProgress?: any }) {
  return (
    <div className="w-full h-full min-h-[750px] bg-transparent">
      <Canvas 
        shadows 
        dpr={[1, 12]} 
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [1, 2.5, 8], fov: 35}}
        className="bg-transparent"
      >
        <Environment preset="city" background={false} />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={2} 
          castShadow 
        />
        <spotLight 
          position={[-5, 5, 2]} 
          intensity={10} 
          color="rgb(23, 186, 76)" /* Custom Green Reflection */
          angle={0.5} 
          penumbra={1} 
        />

        <Suspense fallback={<Html center><span className="text-primary font-bold">YÜKLENİYOR...</span></Html>}>
          <PresentationControls 
            speed={1.5} 
            global 
            zoom={0.7} 
            polar={[-0.1, 0.1]}
          >
             <YamahaR1Model />
             <ContactShadows 
               position={[0, -0.6, 0]} 
               opacity={0.15} 
               scale={80} 
               blur={3} 
               far={10} 
               resolution={256} 
               color="#000000"
             />
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
}