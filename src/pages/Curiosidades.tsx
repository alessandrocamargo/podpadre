import { Container, Row, Col } from 'react-bootstrap';
import curiosities from '../data/curiosities';
import CuriosityCard from '../components/CuriosityCard';

const Curiosidades: React.FC = () => {
  return (
    <Container className="py-5">
      <div className="section-heading mb-4">
        <p className="eyebrow mb-2">Curiosidades</p>
        <h1 className="mb-0">Todas as curiosidades</h1>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4 mt-2">
        {curiosities.map((item) => (
          <Col key={item.id}>
            <CuriosityCard curiosity={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Curiosidades;
