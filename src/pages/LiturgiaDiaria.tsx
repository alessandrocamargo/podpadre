import React, { useState, useEffect } from "react";
import { Container, Card, Spinner, Button, Alert } from "react-bootstrap";
import { getTodayLiturgy, refreshLiturgy } from "../services/liturgyService";
import "../styles/liturgia.css";

interface LiturgyData {
  date: string;
  title: string;
  reading1?: string;
  reading2?: string;
  gospel?: string;
  liturgicalDay?: string;
}

const LiturgiaDiaria: React.FC = () => {
  const [liturgy, setLiturgy] = useState<LiturgyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Carrega a liturgia quando o componente monta
  useEffect(() => {
    loadLiturgy();
  }, []);

  // Configura verificação diária automática
  useEffect(() => {
    const checkDaily = setInterval(() => {
      const now = new Date();
      const lastUpdateDate = lastUpdate ? new Date(lastUpdate) : null;

      // Se for um novo dia, atualizar
      if (
        !lastUpdateDate ||
        now.getDate() !== lastUpdateDate.getDate() ||
        now.getMonth() !== lastUpdateDate.getMonth() ||
        now.getFullYear() !== lastUpdateDate.getFullYear()
      ) {
        loadLiturgy();
      }
    }, 60000); // Verifica a cada minuto

    return () => clearInterval(checkDaily);
  }, [lastUpdate]);

  const loadLiturgy = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodayLiturgy();
      setLiturgy(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(
        "Erro ao carregar a liturgia do dia. Por favor, tente novamente."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await refreshLiturgy();
      setLiturgy(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(
        "Erro ao atualizar a liturgia do dia. Por favor, tente novamente."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="liturgia-container py-5">
      <div className="liturgia-header mb-5">
        <h1 className="liturgia-title">Liturgia Diária</h1>
        <p className="liturgia-subtitle">
          Viva a sabedoria da palavra de Deus a cada dia
        </p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner
            animation="border"
            variant="primary"
            className="mb-3"
            role="status"
          >
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
          <p>Carregando a liturgia do dia...</p>
        </div>
      )}

      {error && <Alert variant="warning">{error}</Alert>}

      {!loading && liturgy && (
        <>
          <Card className="liturgia-card shadow-lg mb-4 border-0">
            <Card.Body className="p-5">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <Card.Title className="liturgia-card-title mb-2">
                    {liturgy.title}
                  </Card.Title>
                  <Card.Subtitle className="liturgia-card-subtitle">
                    {liturgy.liturgicalDay}
                  </Card.Subtitle>
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleRefresh}
                  className="refresh-btn"
                  disabled={loading}
                >
                  🔄 Atualizar
                </Button>
              </div>

              <hr className="my-4" />

              {liturgy.reading1 && (
                <div className="liturgia-section mb-4">
                  <h5 className="liturgia-section-title">📖 Primeira Leitura</h5>
                  <p className="liturgia-text">{liturgy.reading1}</p>
                </div>
              )}

              {liturgy.reading2 && (
                <div className="liturgia-section mb-4">
                  <h5 className="liturgia-section-title">📖 Segunda Leitura</h5>
                  <p className="liturgia-text">{liturgy.reading2}</p>
                </div>
              )}

              {liturgy.gospel && (
                <div className="liturgia-section">
                  <h5 className="liturgia-section-title">✨ Evangelho</h5>
                  <p className="liturgia-text">{liturgy.gospel}</p>
                </div>
              )}

              <hr className="my-4" />

              {lastUpdate && (
                <div className="liturgia-footer text-muted small">
                  <p className="mb-0">
                    📅 Atualizado em:{" "}
                    {lastUpdate.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>

          <div className="liturgia-info alert alert-info">
            <p className="mb-0">
              <strong>ℹ️ Nota:</strong> A liturgia é atualizada automaticamente
              diariamente. Você pode clicar em "Atualizar" para recarregar os
              dados a qualquer momento.
            </p>
          </div>
        </>
      )}
    </Container>
  );
};

export default LiturgiaDiaria;
