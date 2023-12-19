import { Palaces, ProblemType, Role, Status } from '@prisma/client';

export const pathToImageFolder: string = './static/images/';

export interface IUK {
  id: Palaces;
  photo: string;
  description: string;
}

export const PalaceConvertor = {
  [Palaces.CIT]: 'Центр инновационных технологий',
  [Palaces.NVC]: 'Научно внедренческий центр',
  [Palaces.EC]: 'Инжиниринговый центр',
  [Palaces.IC]: 'Инженерный центр',
  [Palaces.EXPOCENTER]: 'Экспоцентр',
  [Palaces.ADMINISTRATIVE]: 'Административный центр'
};

export const StatusConvertor = {
  [Status.Accepted]: 'Принято',
  [Status.Declined]: 'Отклонено',
  [Status.Pending]: 'В обработке',
  [Status.Waiting]: 'В ожидании'
};

export const ProblemTypeConverter = {
  [ProblemType.COMMUNICATION]: 'Интернет / Телефония / Серверные комнаты',
  [ProblemType.ELECTRICITY]: 'Электроснабжение',
  [ProblemType.HEATING]: 'Отопление / Кондиционирование',
  [ProblemType.OTHER]: 'Другое - мелкий и средний ремонт',
  [ProblemType.WATERSUPPLY]: 'Водоснабжение / Канализация'
};

export const RoleConvertor = {
  [Role.ADMIN]: 'Администратор',
  [Role.EMPLOYEE]: 'Сотрудник ОЭЗ',
  [Role.EVENTRENTER]: 'Арендатор для мероприятий',
  [Role.GUEST]: 'Гость',
  [Role.NONRESIDENTRENTER]: 'Арендатор-нерезидент',
  [Role.RESIDENT]: 'Резидент',
  [Role.SUPPORT]: 'Агент поддержки',
  [Role.UNREGISTERED]: 'Незарегестрирован'
};
