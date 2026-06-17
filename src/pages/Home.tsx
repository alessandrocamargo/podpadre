import { Container, Row, Col } from 'react-bootstrap';
import curiosities from '../data/curiosities';
import CuriosityCard from '../components/CuriosityCard';

const Home: React.FC = () => {
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Curiosidades Católicas</h1>
        <p className="lead text-muted fst-italic">
          Descubra a riqueza da fé romana em pequenas doses
        </p>
      </div>
      <Row xs={1} md={2} lg={3} className="g-4">
        {curiosities.map(item => (
          <Col key={item.id}>
            <CuriosityCard curiosity={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;