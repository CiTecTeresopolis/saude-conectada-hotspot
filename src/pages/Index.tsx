import Carousel from "../components/Carousel";
import LoginForm from "../components/LoginForm";
import "../styles/CaptivePortal.css";

const Index = () => {
  return (
    <div className="captive-portal">
      <header className="captive-portal__header">
        <div className="captive-portal__logo">
          <div className="captive-portal__logo-icon">
            <img src="logo.png" />
          </div>
          <div className="captive-portal__logo-text">
            <span className="captive-portal__logo-title">
              Prefeitura Municipal de
            </span>
            <span className="captive-portal__logo-name">TERESÓPOLIS</span>
            <span className="captive-portal__logo-slogan">acima de tudo!</span>
          </div>
        </div>
      </header>

      <main className="captive-portal__main">
        <Carousel />
        <LoginForm />
      </main>

      <footer className="captive-portal__footer">
        <p>
          © 2026{" "}
          <span className="captive-portal__footer-highlight">
            Prefeitura de Teresópolis
          </span>{" "}
          - Todos os direitos reservados
        </p>
        <p>Uma iniciativa da Secretaria de Ciência e Tecnologia</p>
      </footer>
    </div>
  );
};

export default Index;
