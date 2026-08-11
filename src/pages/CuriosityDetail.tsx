import { Container } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import curiosities from '../data/curiosities';

const CuriosityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const curiosity = curiosities.find(c => c.id === Number(id));

  if (!curiosity) {
    return (
      <Container className="py-5 text-center">
        <h2>Curiosidade não encontrada</h2>
        <Link to="/curiosidades" className="btn btn-gold mt-3">← Voltar para curiosidades</Link>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: '720px' }}>
      <Link to="/curiosidades" className="text-gold mb-3 d-inline-block">
        ← Todas as curiosidades
      </Link>
      <article>
        <h1 className="display-5 mb-3">{curiosity.title}</h1>
        <div className="text-muted small mb-4">
          📅 {curiosity.date} &nbsp;|&nbsp; 📖 {curiosity.source}
        </div>
        <p className="fs-5 lh-lg">{curiosity.content}</p>
      </article>
    </Container>
  );
};

export default CuriosityDetail;