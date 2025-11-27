// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  const footerLinks = [
    { label: 'Política de Privacidade', href: '#' },
    { label: 'Termos de Uso', href: '#' },
    { label: 'Suporte', href: '#' },
  ];

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-links">
            {footerLinks.map((link, index) => (
              <a key={index} href={link.href}>{link.label}</a>
            ))}
          </div>
          <div className="copyright">
            &copy; {new Date().getFullYear()} Sistema de RH. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;