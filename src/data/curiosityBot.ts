import type { Curiosity } from '../types/Curiosity';

const sourceLibrary: Curiosity[] = [
  {
    id: 4,
    title: 'Qual o significado do terço?',
    summary: 'O terço é uma forma tradicional de oração na Igreja Católica.',
    content: 'O terço é uma oração meditativa baseada na repetição dos mistérios de Jesus e de Maria. A tradição do rosário foi fortalecida por São Domingos e se tornou um importante instrumento de devoção para fiéis católicos em todo o mundo.',
    source: 'Catecismo da Igreja Católica',
    date: '2025-06-16'
  },
  {
    id: 5,
    title: 'Por que a Igreja usa o cálice?',
    summary: 'O cálice é símbolo do mistério da Eucaristia e da consagração.',
    content: 'Na liturgia católica, o cálice representa o sangue de Cristo e o momento da consagração na Eucaristia. Sua presença é central na celebração da Santa Missa e reforça a profunda ligação entre o sacramento e a vida da Igreja.',
    source: 'Liturgia Romana',
    date: '2025-06-23'
  },
  {
    id: 6,
    title: 'O que simboliza o círio pascal?',
    summary: 'O círio pascal lembra a Luz de Cristo na noite pascal.',
    content: 'O círio pascal é aceso na Vigília Pascal e simboliza a luz de Cristo ressurreto. Ele permanece como um sinal visual da fé pascal e da presença de Jesus na comunidade cristã ao longo do ano litúrgico.',
    source: 'Ritual Romano',
    date: '2025-07-01'
  }
];

export const curiosityBot = {
  sources: ['Vatican News', 'Enciclopédia Católica', 'Guia Oficial do Vaticano', 'Catecismo da Igreja Católica'],
  fetchNewCuriosities: (usedIds: number[] = []): Curiosity[] => {
    return sourceLibrary.filter((item) => !usedIds.includes(item.id));
  },
  suggestNextCuriosity: (usedIds: number[] = []): Curiosity | null => {
    const available = sourceLibrary.filter((item) => !usedIds.includes(item.id));
    return available[0] ?? null;
  }
};
