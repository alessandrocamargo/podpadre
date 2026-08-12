// Dados de exemplo da liturgia diária
export const exampleLiturgyData = {
  date: new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  title: "Liturgia Diária da Igreja Católica",
  reading1:
    "Primeira Leitura (Nm 11, 25-29): Naqueles dias, o Senhor desceu na nuvem e falou com Moisés. Tirou um pouco do espírito que estava em Moisés e o pôs nos setenta anciãos. Quando o espírito pousou neles, profetizaram, mas não continuaram. Dois homens ficaram no acampamento; um se chamava Eldad, outro Medad. O espírito repouso também neles. Eram dos inscritos, mas não foram à tenda, e profetizavam no acampamento. Um rapaz correu para contar a Moisés: 'Eldad e Medad estão profetizando no acampamento!' Josué, filho de Nun, que desde a sua mocidade servia a Moisés, disse: 'Senhor meu Moisés, proíbe-os!' Respondeu-lhe Moisés: 'Você é cioso por minha causa? Tomara que todo o povo do Senhor fosse profeta e que o Senhor lhe desse o seu espírito!'",
  reading2:
    "Segunda Leitura (Tg 5, 1-6): Escutai agora, ricos! Chorai e gemei pelos vossos sofrimentos que virão. A vossa riqueza apodreceu e os vossos vestidos foram comidos pela traça. O vosso ouro e a vossa prata enferrujaram, e a sua ferrugem será um testemunho contra vós e vos devorará as carnes como fogo. Acumulastes riquezas para estes últimos dias. Eis que o salário que enganasteis dos operários que ceifaram os vossos campos, clama contra vós; e os gritos dos que ceifaram chegaram aos ouvidos do Senhor dos exércitos.",
  gospel:
    "Evangelho (Mc 9, 38-43.45.47-48): João disse a Jesus: 'Mestre, vimos um homem expulsando demônios em teu nome, e tentamos impedi-lo, porque não vinha conosco.' Respondeu Jesus: 'Não o impeçam! Quem faz um milagre em meu nome não pode logo após falar mal de mim. Com efeito, quem não está contra nós está por nós. Quem vos der um copo de água em meu nome, porque sois de Cristo, em verdade vos digo que não perderá sua recompensa.'",
  source: "CNBB - Conferência Nacional dos Bispos do Brasil",
  url: "https://www.cnbb.org.br/liturgia-diaria/",
};

// Dados de fallback simples
export const getSimpleFallbackData = () => ({
  date: new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  title: "Liturgia Diária",
  reading1:
    "Aguardando dados da CNBB. Se este erro persistir, verifique sua conexão de internet.",
  reading2: "Segunda leitura em carregamento...",
  gospel: "Evangelho em carregamento...",
  source: "CNBB - Conferência Nacional dos Bispos do Brasil",
  url: "https://www.cnbb.org.br/liturgia-diaria/",
});
