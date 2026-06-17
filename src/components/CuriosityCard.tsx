import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Curiosity } from '../types/Curiosity';

interface CuriosityCardProps {
  curiosity: Curiosity;
}

const CuriosityCard: React.FC<CuriosityCardProps> = ({ curiosity }) => {
  return (
    <Card className="card-custom h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-3">{curiosity.title}</Card.Title>
        <Card.Text className="flex-grow-1">{curiosity.summary}</Card.Text>
        <div className="text-muted small mb-2">
          📅 {curiosity.date} &nbsp;|&nbsp; 📖 {curiosity.source}
        </div>
        <Link to={`/curiosidade/${curiosity.id}`} className="align-self-start">
          <button className="btn btn-sm btn-outline-gold">
            Ler mais →
          </button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default CuriosityCard;