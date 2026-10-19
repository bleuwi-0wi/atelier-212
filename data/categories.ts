import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Homme',
    slug: 'homme',
    image: 'https://picsum.photos/seed/cat-homme/800/1000',
    count: 6,
    description: 'Vestiaire masculin aux coupes surdimensionnées et matières techniques.',
  },
  {
    id: 'cat-2',
    name: 'Femme',
    slug: 'femme',
    image: 'https://picsum.photos/seed/cat-femme/800/1000',
    count: 4,
    description: 'Silhouettes audacieuses entre minimalisme contemporain et tailoring brut.',
  },
  {
    id: 'cat-3',
    name: 'Hoodies & Sweats',
    slug: 'hoodies',
    image: 'https://picsum.photos/seed/cat-hoodies/800/1000',
    count: 5,
    description: 'Molleton 480 GSM brossé, confort suprême et finitions artisanales.',
  },
  {
    id: 'cat-4',
    name: 'Pantalons & Cargos',
    slug: 'cargos',
    image: 'https://picsum.photos/seed/cat-cargos/800/1000',
    count: 4,
    description: 'Toiles ripstop et gabardines fluides conçues pour le mouvement urbain.',
  },
  {
    id: 'cat-5',
    name: 'Accessoires',
    slug: 'accessoires',
    image: 'https://picsum.photos/seed/cat-accessoires/800/1000',
    count: 4,
    description: 'Casquettes en sergé, sacs crossbody Cordura et bonnets en laine mérinos.',
  },
];
