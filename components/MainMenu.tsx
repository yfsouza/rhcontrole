// MainMenu.tsx
import React from 'react';

interface MainMenuProps {
  onGoToOperacional: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onGoToOperacional }) => {
  // Dados para os cards de estatísticas
  const statsData = [
    { value: '245', label: 'Total de Funcionários' },
    { value: '78%', label: 'Taxa de Retenção' },
    { value: '12', label: 'Novas Contratações' },
    { value: '4.2', label: 'Avaliação Média' },
  ];

  // Dados para os cards do dashboard
  const dashboardCards = [
    {
      title: 'Distribuição de Funcionários',
      description: 'Visualize a distribuição por área, cargo e nível hierárquico',
      icon: '👥',
      href: 'grafico-funcionarios.html',
      variant: 'default' as const,
    },
    {
      title: 'Análise Salarial',
      description: 'Compare salários por cargo, nível e tempo de empresa',
      icon: '💰',
      href: 'grafico-salarios.html',
      variant: 'default' as const,
    },
    {
      title: 'Avaliações de Desempenho',
      description: 'Analise as avaliações por competência e área',
      icon: '📊',
      href: 'grafico-avaliacoes.html',
      variant: 'default' as const,
    },
    {
      title: 'Turnover e Tempo de Empresa',
      description: 'Taxa de rotatividade e tempo médio de permanência',
      icon: '🔄',
      href: 'grafico-turnover.html',
      variant: 'default' as const,
    },
    {
      title: 'Dados Demográficos',
      description: 'Distribuição por gênero, faixa etária e localização',
      icon: '👨‍👩‍👧‍👦',
      href: 'grafico-demograficos.html',
      variant: 'default' as const,
    },
    {
      title: 'Benefícios e Custos',
      description: 'Análise de custos com benefícios e ajudas de custo',
      icon: '🏥',
      href: 'grafico-beneficios.html',
      variant: 'default' as const,
    },
    {
      title: 'Informação Operacional',
      description: 'Acesse dados operacionais em tempo real e análises detalhadas',
      icon: '⚙️',
      href: '#', // não será usado, só pra manter a estrutura
      variant: 'operational' as const,
    },
  ];

  // Itens do menu de navegação
  const navItems = [
    { label: 'Início', href: '#' },
    { label: 'Funcionários', href: '#' },
    { label: 'Relatórios', href: '#' },
    { label: 'Configurações', href: '#' },
  ];

  // Links do footer
  const footerLinks = [
    { label: 'Política de Privacidade', href: '#' },
    { label: 'Termos de Uso', href: '#' },
    { label: 'Suporte', href: '#' },
  ];

  // Função para navegar (para os outros cards)
  const handleNavigate = (href: string) => {
    window.location.href = href;
  };

  return (
    <div className="app">
      {/* Header */}
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo">Sistema de RH</div>
            <nav>
              <ul>
                {navItems.map((item, index) => (
                  <li key={index}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Dashboard Section */}
      <section className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1>Dashboard de Recursos Humanos</h1>
            <p>Visualize e analise os dados da sua equipe de forma clara e eficiente</p>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            {statsData.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Dashboard Cards */}
          <div className="cards-grid">
            {dashboardCards.map((card, index) => (
              <div
                key={index}
                className={`card ${card.variant === 'operational' ? 'operational' : ''}`}
                onClick={() =>
                  card.variant === 'operational'
                    ? onGoToOperacional()
                    : handleNavigate(card.href)
                }
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    card.variant === 'operational'
                      ? onGoToOperacional()
                      : handleNavigate(card.href);
                  }
                }}
              >
                <div className="card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-links">
              {footerLinks.map((link, index) => (
                <a key={index} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
            <div className="copyright">
              &copy; {new Date().getFullYear()} Sistema de RH. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>

      {/* Estilos inline */}
      <style>{`/* mantém exatamente os estilos que você já tinha */ 
        :root {
          --primary: #3498db;
          --secondary: #2c3e50;
          --accent: #e74c3c;
          --light: #ecf0f1;
          --dark: #2c3e50;
          --success: #2ecc71;
          --warning: #f39c12;
          --danger: #e74c3c;
          --operational: #9b59b6;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
          background-color: #f5f7fa;
          color: var(--dark);
          line-height: 1.6;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        header {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          padding: 20px 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 1.8rem;
          font-weight: bold;
        }
        nav ul {
          display: flex;
          list-style: none;
        }
        nav ul li {
          margin-left: 20px;
        }
        nav ul li a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }
        nav ul li a:hover {
          color: var(--light);
        }
        .dashboard {
          padding: 40px 0;
        }
        .dashboard-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .dashboard-header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: var(--secondary);
        }
        .dashboard-header p {
          font-size: 1.1rem;
          color: #7f8c8d;
          max-width: 600px;
          margin: 0 auto;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }
        .card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          padding: 25px;
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
          border-left: 4px solid var(--primary);
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .card.operational {
          border-left-color: var(--operational);
        }
        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
          color: var(--primary);
        }
        .card.operational .card-icon {
          color: var(--operational);
        }
        .card h3 {
          font-size: 1.3rem;
          margin-bottom: 10px;
          color: var(--secondary);
        }
        .card p {
          color: #7f8c8d;
          font-size: 0.95rem;
        }
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
          padding: 20px;
          text-align: center;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: var(--primary);
          margin-bottom: 5px;
        }
        .stat-label {
          font-size: 0.9rem;
          color: #7f8c8d;
        }
        footer {
          background-color: var(--secondary);
          color: white;
          padding: 30px 0;
          text-align: center;
          margin-top: 50px;
        }
        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .footer-links {
          display: flex;
          margin: 20px 0;
        }
        .footer-links a {
          color: white;
          margin: 0 15px;
          text-decoration: none;
        }
        .footer-links a:hover {
          text-decoration: underline;
        }
        .copyright {
          font-size: 0.9rem;
          color: #bdc3c7;
        }
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
          }
          nav ul {
            margin-top: 15px;
            justify-content: center;
          }
          nav ul li {
            margin: 0 10px;
          }
          .dashboard-header h1 {
            font-size: 2rem;
          }
          .cards-grid {
            grid-template-columns: 1fr;
          }
          .footer-links {
            flex-direction: column;
          }
          .footer-links a {
            margin: 5px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MainMenu;
