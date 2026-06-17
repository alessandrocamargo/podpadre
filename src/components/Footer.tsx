import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="footer-custom text-center py-4">
      <Container>
        <p className="mb-1">© {new Date().getFullYear()} PodPadre — Curiosidades do Catolicismo </p>
        <p className="mb-0 fst-italic">“A verdade vos libertará” (Jo 8,32)</p>
      </Container>
    </footer>
  );
};

export default Footer;