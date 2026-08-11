import { Container } from 'react-bootstrap';

const Sobre: React.FC = () => {
  return (
    <Container className="py-5">
      <div className="section-heading mb-4">
        <p className="eyebrow mb-2">Sobre</p>
        <h1 className="mb-0">Um espaço para conhecer a fé com sensibilidade</h1>
      </div>

      <div className="about-panel">
        <p className="text-muted mb-3">
          O PodPadre nasceu para reunir histórias, símbolos e curiosidades sobre o catolicismo de forma acessível, inspiradora e respeitosa.
        </p>
        <p className="text-muted mb-3">
          A proposta do projeto é despertar interesse pela tradição católica, sem perder a profundidade espiritual e a riqueza cultural que fazem parte da Igreja ao longo dos séculos.
        </p>
        <p className="text-muted mb-0">
          Aqui, cada texto busca oferecer uma leitura leve, mas significativa, que ajuda a conhecer melhor a fé, a história e a identidade católica.
        </p>
      </div>
    </Container>
  );
};

export default Sobre;
