import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import curiosities from '../data/curiosities';
import CuriosityCard from '../components/CuriosityCard';
import { getTodayLiturgy } from '../services/liturgyService';
import carrosel1 from '../assets/carrosel/carrosel1.png';
import carrosel2 from '../assets/carrosel/carrosel2.png';
import carrosel3 from '../assets/carrosel/carrosel3.png';
import carrosel4 from '../assets/carrosel/carrosel4.png';
import '../styles/home.css';

const carouselItems = [
  {
    image: carrosel1,
    title: 'A Basílica Iluminada',
    text: 'Fé e Tradição — Grandeza arquitetônica e luz serena, simbolizando a permanência da fé.',
  },
  {
    image: carrosel2,
    title: 'A Chama da Fé',
    text: 'O Sacramento — O terço, a oração e a vela evocam devoção, acolhimento e presença espiritual.',
  },
  {
    image: carrosel3,
    title: 'O Bom Pastor',
    text: 'Serviço e Comunidade — Um padre conduz a comunidade com acolhimento, cuidado e orientação.',
  },
  {
    image: carrosel4,
    title: 'A Palavra Eterna',
    text: 'Evangelho e Estudo — A Bíblia aberta e o círio pascal representam a pregação e a luz da verdade.',
  },
];

const topicBadges = ['Tradição', 'Liturgia', 'História', 'Devoção'];

const churches = [
  {
    name: 'Catedral Nossa Senhora da Conceição',
    district: 'Campo Limpo Paulista',
    mapQuery: 'Catedral Nossa Senhora da Conceição Campo Limpo Paulista',
    website: '',
    celebrations: '',
  },
  {
    name: 'Paróquia São João Paulo II',
    district: 'Vila das Belezas',
    mapQuery: 'Paróquia São João Paulo II Campo Limpo Paulista',
    website: '',
    celebrations: '',
  },
  {
    name: 'Paróquia Nossa Senhora da Esperança',
    district: 'Jardim Santo André',
    mapQuery: 'Paróquia Nossa Senhora da Esperança Campo Limpo Paulista',
    website: '',
    celebrations: '',
  },
  {
    name: 'Paróquia São Francisco de Assis',
    district: 'Jardim das Flores',
    mapQuery: 'Paróquia São Francisco de Assis Campo Limpo Paulista',
    website: '',
    celebrations: '',
  },
];

const Home: React.FC = () => {
  const [liturgy, setLiturgy] = useState<any>({
    date: '',
    title: '',
    reading1: '',
    reading2: '',
    gospel: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLiturgy = async () => {
      try {
        const data = await getTodayLiturgy();
        setLiturgy(data);
      } catch (error) {
        console.error('Erro ao carregar liturgia na home:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLiturgy();
  }, []);

  // Função para truncar texto
  const truncateText = (text: string, maxLength: number = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <Container className="py-5">
      <section className="home-hero mb-5" id="inicio">
        <Row className="align-items-center g-4">
          <Col lg={7}>
            <p className="eyebrow mb-2">PodPadre</p>
            <h1 className="display-4 mb-3">Curiosidades Católicas</h1>
            <p className="lead text-muted fst-italic mx-auto hero-copy" style={{ maxWidth: '700px' }}>
              Descubra a riqueza da fé romana em pequenas doses, com histórias, símbolos e tradições que ajudam a entender melhor a Igreja e a cultura católica.
            </p>

            <div className="topic-badges mb-3">
              {topicBadges.map((topic) => (
                <span key={topic} className="home-chip">{topic}</span>
              ))}
            </div>
          </Col>

          <Col lg={5}>
            <div className="hero-stat-card">
              <p className="eyebrow mb-2">Em destaque</p>
              <h2 className="mb-3">Uma fé viva em pequenos detalhes</h2>
              <p className="mb-3 text-muted">
                Cada curiosidade revela um pedaço da tradição católica: simbolismo, ritual, memória e espiritualidade.
              </p>
              <div className="hero-metrics">
                <div>
                  <strong>4</strong>
                  <span>Curiosidades</span>
                </div>
                <div>
                  <strong>4</strong>
                  <span>Temas</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      <Carousel fade className="home-carousel mb-5" interval={4500}>
        {carouselItems.map((item) => (
          <Carousel.Item key={item.title}>
            <img className="d-block w-100 carousel-image" src={item.image} alt={item.title} />
            <Carousel.Caption className="carousel-caption-custom">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <section className="churches-map-section mb-5">
        <div className="section-heading mb-4">
          <p className="eyebrow mb-2">Arquidiocese</p>
          <h2 className="mb-0">Igrejas da Arquidiocese de Campo Limpo</h2>
        </div>

        <Row className="g-4 align-items-stretch">
          <Col lg={5}>
            <div className="church-list">
              {churches.map((church) => (
                <div key={church.name} className="church-item">
                  <span className="church-badge">Paróquia</span>
                  <strong>{church.name}</strong>
                  <span>{church.district}</span>
                  <div className="church-details">
                    {church.website && (
                      <span className="church-detail">🌐 {church.website}</span>
                    )}
                    {church.celebrations && (
                      <span className="church-detail">🕐 {church.celebrations}</span>
                    )}
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.mapQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="church-link"
                  >
                    📍 Ver no mapa
                  </a>
                </div>
              ))}
            </div>
          </Col>

          <Col lg={7}>
            <div className="map-panel">
              <iframe
                title="Mapa da Arquidiocese de Campo Limpo"
                src={`https://www.google.com/maps?q=${encodeURIComponent('Arquidiocese de Campo Limpo São Paulo Capital')}&output=embed`}
                className="map-frame"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Col>
        </Row>
      </section>

      <section id="curiosidades" className="mb-5">
        <div className="section-heading mb-4 d-flex justify-content-between align-items-end flex-wrap gap-3">
          <div>
            <p className="eyebrow mb-2">Curiosidades</p>
            <h2 className="mb-0">Fatos que inspiram e ensinam</h2>
          </div>
          <span className="section-counter">{curiosities.length} itens</span>
        </div>

        <Row xs={1} md={2} lg={4} className="g-4">
          {curiosities.map(item => (
            <Col key={item.id}>
              <CuriosityCard curiosity={item} />
            </Col>
          ))}
        </Row>

        <div className="text-center mt-4 curiosities-more">
          <Link to="/curiosidades" className="btn btn-outline-gold btn-lg px-4">
            Ver todas as curiosidades →
          </Link>
        </div>
      </section>

      <section className="home-daily-liturgy mb-5">
        <div className="section-heading mb-4">
          <p className="eyebrow mb-2">Liturgia Diária</p>
          <h2 className="mb-3">Palavra Sagrada de Hoje</h2>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="text-muted mt-3">Carregando liturgia...</p>
          </div>
        ) : (
          <Row className="g-4">
            <Col lg={12}>
              <div className="liturgy-preview-card">
                <div className="liturgy-preview-header">
                  <h3>{liturgy.title}</h3>
                  <p className="text-muted mb-0">{liturgy.date}</p>
                </div>

                <div className="liturgy-sections">
                  {liturgy.reading1 && (
                    <div className="liturgy-section">
                      <h5>📖 Primeira Leitura</h5>
                      <p>{truncateText(liturgy.reading1, 250)}</p>
                    </div>
                  )}

                  {liturgy.reading2 && (
                    <div className="liturgy-section">
                      <h5>📖 Segunda Leitura</h5>
                      <p>{truncateText(liturgy.reading2, 250)}</p>
                    </div>
                  )}

                  {liturgy.gospel && (
                    <div className="liturgy-section">
                      <h5>✨ Evangelho</h5>
                      <p>{truncateText(liturgy.gospel, 250)}</p>
                    </div>
                  )}
                </div>

                <div className="liturgy-preview-footer">
                  <Link to="/liturgia" className="btn btn-primary btn-lg">
                    Leia a Liturgia Completa →
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </section>
    </Container>
  );
};

export default Home;