export interface LiturgyReading {
  id: string;
  kind: 'reading1' | 'reading2' | 'psalm' | 'extra' | 'gospel';
  label: string;
  title: string;
  reference: string;
  refrain?: string;
  text: string;
  mode: 'bible' | 'liturgy';
  source: string;
  sourceUrl: string;
}
export interface LiturgyData {
  date: string;
  title: string;
  reading1: string;
  reading2?: string;
  psalm?: string;
  gospel: string;
  source: string;
  url: string;
  fetchedAt: string;
  readings: LiturgyReading[];
  verifiedWithCNBB: boolean;
  notice?: string;
  bible: { name: string; url: string; notice: string };
}
