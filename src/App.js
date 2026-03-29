// App.js COMPLETO - ORBK Studio
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Lenis from '@studio-freight/lenis';
import Hero from './Hero';
import './styles.css';

function Scene() {
  return (
    <>
      <color attach="background" args={['#000']} />
      <ambientLight intensity={0.5} />
      <Hero />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  )
}

export default function App() {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const [navVisible, setNavVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    lenis.on('scroll', ({ direction }) => {
      if (window.scrollY > 100) setNavVisible(direction < 0);
      else setNavVisible(true);
    });

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      document.body.classList.add('is-touch');
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => {
      lenis.destroy();
      observer.disconnect();
    };
  }, []);

  const isMobile = window.innerWidth < 768;

  return (
    <div className="container" ref={containerRef}>
      <Canvas
        dpr={isMobile ? [1, 1.2] : [1, 1.5]}
        camera={{
          position: isMobile ? [0, 0, 7] : [0, 0, 5],
          fov: isMobile ? 65 : 75,
          near: 0.1,
          far: 30
        }}
        gl={{ powerPreference: "high-performance", antialias: false }}
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      >
        <Suspense fallback={null}><Scene /></Suspense>
      </Canvas>

      <div id="overlay">
        <div id="custom-cursor" ref={cursorRef}></div>

        <nav className={`nav-minimal reveal ${!navVisible ? 'nav-hidden' : ''} ${menuOpen ? 'menu-active' : ''}`}>
          <div className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="nav-bar"></div>
            <div className="nav-bar"></div>
          </div>
          <div className="nav-content">
            <a href="#services" onClick={(e) => { e.preventDefault(); setMenuOpen(false); lenisRef.current?.scrollTo('#services', { offset: -100 }) }}>Servicios</a>
            <a href="#projects" onClick={(e) => { e.preventDefault(); setMenuOpen(false); lenisRef.current?.scrollTo('#projects', { offset: -100 }) }}>Proyectos</a>
            <a href="mailto:hola@orbkstudio.com.ar" onClick={() => setMenuOpen(false)}>Contacto</a>
          </div>
        </nav>

        <div className="hero">
          <div className="content">
            <div className="logo reveal">ORB<span className="accent-k">K</span></div>
            <p className="slogan">Crafting Digital Presence</p>
            <button className="button-explorar" onClick={() => lenisRef.current?.scrollTo('#services', { offset: -100 })}>
              Descubrir Soluciones
            </button>
          </div>
        </div>

        <section id="services">
          <h2 className="section-title reveal">Nuestros Servicios /</h2>
          <div className="services-grid">
            <div className="service-card reveal">
              <span className="num">01</span>
              <h3>Software Estratégico</h3>
              <p>Sistemas de gestión logística, automatización de procesos y arquitecturas escalables.</p>
            </div>
            <div className="service-card reveal">
              <span className="num">02</span>
              <h3>Apps Nativas</h3>
              <p>Desarrollo de aplicaciones móviles enfocadas en la experiencia de usuario y rendimiento extremo.</p>
            </div>
            <div className="service-card reveal">
              <span className="num">03</span>
              <h3>Ecosistemas Web</h3>
              <p>Landings de alta conversión, plataformas interactivas con tecnología 3D.</p>
            </div>
          </div>
        </section>

        <section id="projects" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 className="section-title reveal">Proyectos Seleccionados</h2>
        </section>
      </div>
    </div>
  );
}
