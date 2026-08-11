import { Container, Row, Col } from 'react-bootstrap';

const periods = [
  {
    title: 'Origem apostólica',
    text:
      'A Igreja Católica Apostólica Romana nasceu no século I, a partir da pregação de Jesus Cristo e do apostolado dos seus discípulos. São Pedro e São Paulo se tornaram símbolos da missão inicial, e a comunidade cristã de Jerusalém e de Roma foi o berço da fé que se espalhou pelo mundo.',
  },
  {
    title: 'Expansão e tradição',
    text:
      'Ao longo dos séculos, a Igreja se tornou uma força de evangelização, educação e caridade. Concílios, santos, monges, missionários e bispos contribuíram para preservar a fé, os sacramentos e a liturgia, transmitindo uma riqueza espiritual que atravessou impérios, culturas e épocas.',
  },
  {
    title: 'Presença em Roma',
    text:
      'Roma tornou-se o centro simbólico da Igreja, em razão do martírio dos apóstolos e da continuidade do ministério petrino. Nesse sentido, a cidade eterna simboliza a fidelidade apostólica e a unidade da Igreja no mundo.',
  },
  {
    title: 'Missão no mundo',
    text:
      'Hoje, a Igreja Católica Apostólica Romana permanece como a maior comunidade cristã do mundo, unindo tradição, oração, sacramentos e missão de anunciar Cristo a todos, especialmente por meio da caridade, da educação e do serviço ao próximo.',
  },
];

const Historia: React.FC = () => {
  return (
    <Container className="py-5">
      <div className="section-heading mb-4">
        <p className="eyebrow mb-2">História</p>
        <h1 className="mb-0">A Igreja Católica Apostólica Romana</h1>
      </div>

      <div className="story-panel mb-4">
        <p className="text-muted mb-0">
          A Igreja Católica Apostólica Romana é uma das mais antigas e influentes instituições da civilização ocidental. Sua origem está na vida, no ensino e na paixão de Jesus Cristo, e sua continuidade se expressa na fé dos apóstolos, na liturgia, nos sacramentos e no papel central do Papa como sucessor de São Pedro.
        </p>
      </div>

      <Row xs={1} md={2} lg={4} className="g-4">
        {periods.map((period) => (
          <Col key={period.title}>
            <div className="card-custom h-100 p-3 rounded-4">
              <div className="d-flex flex-column h-100">
                <span className="eyebrow mb-2">Período</span>
                <h3 className="mb-3">{period.title}</h3>
                <p className="text-muted mb-0 flex-grow-1">{period.text}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Historia;
