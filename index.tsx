import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const NUM_STARS = 150;

const Star = ({ style }: { style: React.CSSProperties }) => {
  return <div style={style} />;
};

interface StarData {
  id: number;
  style: React.CSSProperties;
}

interface FormData {
  name: string;
  business: string;
  goal: string;
  features: string;
  inspiration: string;
  contact: string;
}

interface ModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: FormData;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const RequirementsModal = ({ onClose, onSubmit, formData, onFormChange }: ModalProps) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <h2>Your Requirements</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">What is your name?</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={onFormChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="business">What is your business or project name?</label>
          <input type="text" id="business" name="business" value={formData.business} onChange={onFormChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="goal">What is the primary goal of your website?</label>
          <textarea id="goal" name="goal" value={formData.goal} onChange={onFormChange} placeholder="e.g., Sell products, provide info, showcase a portfolio..." required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="features">Any specific features you need?</label>
          <textarea id="features" name="features" value={formData.features} onChange={onFormChange} placeholder="e.g., Contact form, blog, e-commerce..."></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="inspiration">Any websites you like for design inspiration?</label>
          <textarea id="inspiration" name="inspiration" value={formData.inspiration} onChange={onFormChange} placeholder="Please provide links..."></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="contact">What is your contact email or phone number?</label>
          <input type="text" id="contact" name="contact" value={formData.contact} onChange={onFormChange} required />
        </div>
        <button type="submit" className="send-button">
          Send to WhatsApp
        </button>
      </form>
    </div>
  </div>
);


const App = () => {
  const [stars, setStars] = useState<StarData[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    business: '',
    goal: '',
    features: '',
    inspiration: '',
    contact: '',
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    const generatedStars: StarData[] = [];
    for (let i = 0; i < NUM_STARS; i++) {
      const size = Math.random() * 2 + 1;
      const z = Math.random() * 2000 - 1000;
      const style: React.CSSProperties = {
        position: 'absolute',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'white',
        borderRadius: '50%',
        transform: `translateZ(${z}px)`,
        boxShadow: `0 0 ${Math.random() * 10 + 5}px white`,
      };
      generatedStars.push({ id: i, style: style });
    }
    setStars(generatedStars);
  }, []);

  useEffect(() => {
    const smoothingFactor = 0.01;
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      targetRotation.current.y = (clientX / innerWidth - 0.5) * 20;
      targetRotation.current.x = (clientY / innerHeight - 0.5) * -20;
    };

    const animate = () => {
      if (backgroundRef.current) {
        currentRotation.current.x +=
          (targetRotation.current.x - currentRotation.current.x) *
          smoothingFactor;
        currentRotation.current.y +=
          (targetRotation.current.y - currentRotation.current.y) *
          smoothingFactor;
        backgroundRef.current.style.transform = `rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg)`;
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `
*New Website Requirement*

*Name:* ${formData.name}
*Business/Project:* ${formData.business}
*Primary Goal:* ${formData.goal}
*Required Features:* ${formData.features}
*Inspiration Links:* ${formData.inspiration}
*Contact Info:* ${formData.contact}
    `;
    const encodedMessage = encodeURIComponent(message.trim());
    const whatsappUrl = `https://wa.me/8148800254?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsModalOpen(false);
  };

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    transformStyle: 'preserve-3d',
    zIndex: -1,
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    textShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 1rem',
  };

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    boxSizing: 'border-box',
  };
  
  const mainContentWrapper: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '1rem',
    margin: '0',
    fontWeight: 300,
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.8)',
  };

  const gmailLink = isMobile
    ? "mailto:vasudevan7348@gmail.com?cc=rhithickprakash2007@gmail.com"
    : "https://mail.google.com/mail/?view=cm&fs=1&to=vasudevan7348@gmail.com&cc=rhithickprakash2007@gmail.com";

  return (
    <>
      <nav style={navStyle}>
        <a href="tel:7339042880" className="nav-link">Contact Us</a>
        <a href="https://www.instagram.com/r_a_c_z_e_n/#" target="_blank" rel="noopener noreferrer" className="nav-link">Instagram</a>
      </nav>
      <div ref={backgroundRef} style={containerStyle}>
        {stars.map((star) => (<Star key={star.id} style={star.style} />))}
      </div>
      <div style={mainContentWrapper}>
        <div style={contentStyle}>
          <p style={subtitleStyle}>
            welcome to
          </p>
          <h1 style={{ fontSize: '2.2rem', margin: '0.25rem 0', letterSpacing: '0.1em', fontWeight: 700 }}>
            TRIZEN WEBS
          </h1>
          <p style={subtitleStyle}>
            we make you alive on online
          </p>
          <button className="build-button" onClick={() => setIsModalOpen(true)}>
            <span role="img" aria-label="spanner">🔧</span> Build Now
          </button>
        </div>
        <footer className="about-section">
          <h3>About Us</h3>
          <p>
            We're a team of three passionate developers driven by one goal — to turn ideas into fast, beautiful, and functional websites'.'
          </p>
          <p>
            Our journey began with a shared love for design, technology, and problem-solving. Together, we blend creativity with clean code to help businesses, creators, and startups build a strong digital presence
          </p>
          <p>
            We don't just build websites — we build digital experiences that help brands grow.
          </p>
          <p>
            <strong>Let's create something amazing together'.</strong>
          </p>
          <a 
            href={gmailLink} 
            className="gmail-button"
            target={isMobile ? '_self' : '_blank'}
            rel={!isMobile ? "noopener noreferrer" : undefined}
          >
            Contact via Gmail
          </a>
        </footer>
      </div>
      {isModalOpen && <RequirementsModal
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        onFormChange={handleFormChange}
      />}
    </>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}