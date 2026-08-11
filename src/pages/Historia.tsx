import { Container } from 'react-bootstrap';

const Historia: React.FC = () => {
  return (
    <Container className="py-5">
      <div className="section-heading mb-4">
        <p className="eyebrow mb-2">História</p>
        <h1 className="mb-0">Uma fé com profundidade e tradição</h1>
      </div>

      <div className="story-panel">
        <p className="text-muted mb-3">
          A Igreja Católica nasceu no seio do mundo judaico e se desenvolveu ao longo dos séculos, acompanhando a história da humanidade, a cultura europeia e o pensamento ocidental.
        </p>
        <p className="text-muted mb-3">
          Desde os primeiros discípulos até os grandes concílios, a Igreja foi moldada por santos, mártires, estudiosos e líderes espirituais que dedicaram sua vida à fé, à evangelização e ao serviço ao próximo.
        </p>
        <p className="text-muted mb-0">
          Em Roma, a tradição católica encontrou um centro simbólico e espiritual fundamental, preservando ritos, liturgia e um legado cultural que continua vivo até hoje.
        </p>
      </div>
    </Container>
  );
};

export default Historia;
