import React, { useState, useEffect, useCallback, useRef } from "react";
import { Container, Card, Spinner, Button, Alert } from "react-bootstrap";
import { getTodayLiturgy, refreshLiturgy, getLiturgyDate } from "../services/liturgyService";
import "../styles/liturgia.css";

import type { LiturgyData } from '../types/Liturgy';

const LiturgiaDiaria: React.FC = () => {
  const [liturgy, setLiturgy] = useState<LiturgyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const busy = useRef(false);
  const loadLiturgy = useCallback(async (refresh = false) => {
    if (busy.current) return;
    busy.current = true;
    try {
      const data = await (refresh ? refreshLiturgy() : getTodayLiturgy());
      setError(null);
      setLiturgy(data);
      setLastUpdate(new Date(data.fetchedAt));
    } catch {
      setLiturgy(null);
      setError('Não foi possível obter uma liturgia válida para hoje. Tente novamente em alguns instantes.');
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let date = getLiturgyDate();
    // The initial request updates state only after awaiting the API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadLiturgy();
    const timer = setInterval(() => {
      const today = getLiturgyDate();
      if (today !== date) { date = today; void loadLiturgy(); }
    }, 60000);
    return () => clearInterval(timer);
  }, [loadLiturgy]);
  const handleRefresh = () => { setLoading(true); setError(null); void loadLiturgy(true); };

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

      {error && <>
        <Alert variant="warning">{error} <Button onClick={handleRefresh} disabled={loading}>Tentar novamente</Button></Alert>
        <p>Você também pode ler no visualizador oficial das Edições CNBB:</p>
        <iframe title="Liturgia diária — Edições CNBB" src="https://liturgiadiaria.edicoescnbb.com.br/" className="official-liturgy" loading="lazy" referrerPolicy="no-referrer" />
        <p><a href="https://liturgiadiaria.edicoescnbb.com.br/" target="_blank" rel="noreferrer">Abrir a liturgia oficial em outra aba</a></p>
      </>}

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
                    {new Date(`${liturgy.date}T12:00:00-03:00`).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
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

              {liturgy.psalm && <div className="liturgia-section mb-4"><h2 className="h5">Salmo Responsorial</h2><p className="liturgia-text">{liturgy.psalm}</p></div>}
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

              <p><a href={liturgy.url} target="_blank" rel="noreferrer">Fonte: {liturgy.source}</a></p>
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
