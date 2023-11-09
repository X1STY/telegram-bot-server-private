import { Palaces } from '@prisma/client';

export const pathToImageFolder: string = './static/images/';

export interface IUK {
  id: Palaces;
  photo: string;
  description: string;
}

export const arrayOfUK: IUK[] = [
  {
    id: Palaces.CIT,
    photo: pathToImageFolder + 'INVENTUM.png',
    description: 'Inventum'
  },
  {
    id: Palaces.IC,
    photo: pathToImageFolder + 'TECHNUM.png',
    description: 'Technum'
  },
  {
    id: Palaces.NVC,
    photo: pathToImageFolder + 'VITUM.png',
    description: 'Vitum'
  },
  {
    id: Palaces.EC,
    photo: pathToImageFolder + 'v1a.png',
    description: 'futurum'
  },
  {
    id: Palaces.EXPOCENTER,
    photo: pathToImageFolder + 'v1b.png',
    description: 'expocenter'
  }
];
