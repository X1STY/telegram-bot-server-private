import { Role } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const MainMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Узнать об ОЭЗ',
    callback_data: 'learn_about_OEZ'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Аренда для мероприятий',
    callback_data: 'rent_for_event'
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Стать резидентом',
    callback_data: 'become_a_resident'
  };
  const b4: TelegramBot.InlineKeyboardButton = {
    text: 'Я уже резидент/сотрудник/арендатор',
    callback_data: 'i_am_already'
  };
  const b5: TelegramBot.InlineKeyboardButton = {
    text: 'Аренда для нерезидентов ОЭЗ',
    callback_data: 'rent_for_not_resident'
  };
  const b6: TelegramBot.InlineKeyboardButton = {
    text: 'Я гость',
    callback_data: 'i_am_already-GUEST'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [b2], [b3], [b5], [b4], [b6]]
  };
  return kb;
};

export const InfoPageMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Общие сведения',
    callback_data: 'general_info'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Нормативные документы',
    callback_data: 'regulatory_documents'
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Контактные данные УК',
    callback_data: 'uk_contact_data'
  };
  const b4: TelegramBot.InlineKeyboardButton = {
    text: 'Инфраструктура',
    callback_data: 'infrostructure'
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'to_main_menu'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1, b2], [b3, b4], [back], [toMainMenuButton]]
  };
  return kb;
};

export const GeneralInfoMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Сервисы и поддержка',
    callback_data: 'services_and_support'
  };
  const b2: TelegramBot.InlineKeyboardButton = { text: 'Льготы', callback_data: 'exemptions' };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Путь получения статуса',
    callback_data: 'way_to_obtain_status'
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'learn_about_OEZ'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1, b2, b3], [back], [toMainMenuButton]]
  };
  return kb;
};
export const RentForEventMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Рассказать о требованиях',
    callback_data: 'rent_for_event_send_requirements'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Выбрать вручную',
    callback_data: 'rent_for_event_manual_choose'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1, b2], [toMainMenuButton]]
  };
  return kb;
};

export const RegulatoryDocumentsMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Документы для получения статуса резидента',
    callback_data: 'documets_to_obtain_resident_status-regulatory_documents'
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'learn_about_OEZ'
  };
  return { inline_keyboard: [[b1], [back], [toMainMenuButton]] };
};

export const RegulatoryDocumentsToBecomeAResidentMenu = (
  from: string
): TelegramBot.InlineKeyboardMarkup => {
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: from !== 'regulatory_documents' ? 'become_a_resident' : 'regulatory_documents'
  };
  return { inline_keyboard: [[back], [toMainMenuButton]] };
};

export const UKContactDataMenu = (from?: string): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'ИЦ',
    callback_data: 'ic'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'ЦИТ',
    callback_data: 'cit'
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'НВЦ',
    callback_data: 'nvc'
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: from == null ? 'learn_about_OEZ' : from
  };
  return { inline_keyboard: [[b1, b2, b3], [back], [toMainMenuButton]] };
};

const web: TelegramBot.WebAppInfo = { url: 'https://yandex.ru/maps/-/CDaPzPm4' };
export const ICCenterMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Яндекс карты',
    web_app: web
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'uk_contact_data'
  };
  return { inline_keyboard: [[b1], [back], [toMainMenuButton]] };
};
export const CITCenterMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Яндекс карты',
    web_app: web
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'uk_contact_data'
  };
  return { inline_keyboard: [[b1], [back], [toMainMenuButton]] };
};
export const NVCCenterMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Яндекс карты',
    web_app: web
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'uk_contact_data'
  };
  return { inline_keyboard: [[b1], [back], [toMainMenuButton]] };
};

export const BackToGeneralMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'general_info'
  };
  return { inline_keyboard: [[back], [toMainMenuButton]] };
};

export const ExemptionsMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Стать резидентом',
    callback_data: 'become_a_resident'
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'general_info'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [back], [toMainMenuButton]]
  };
  return kb;
};

export const PalacesMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Северная площадка',
    callback_data: 'north_palace'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Южная площадка',
    callback_data: 'south_palace'
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'learn_about_OEZ'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1, b2], [back], [toMainMenuButton]]
  };
  return kb;
};

export const NorthPalaceMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Административный корпус',
    callback_data: 'administrative_center_page'
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'infrostructure'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [back], [toMainMenuButton]]
  };
  return kb;
};

export const SouthPalaceMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Центр инноваций и технологий',
    callback_data: 'inventum'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Инженерный центр',
    callback_data: 'technum'
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Научно-внедренческий центр',
    callback_data: 'vitum'
  };
  const b4: TelegramBot.InlineKeyboardButton = {
    text: 'Инжиниринговый центр',
    callback_data: 'futurum'
  };
  const b5: TelegramBot.InlineKeyboardButton = { text: 'Экспоцентр', callback_data: 'expocenter' };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'infrostructure'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1, b2], [b3, b4], [b5], [back, toMainMenuButton]]
  };
  return kb;
};

export const BackToNorthMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'north_palace'
  };
  return { inline_keyboard: [[back], [toMainMenuButton]] };
};

export const CentersPlaceMenu = (url: string): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Разместиться',
    callback_data: 'accomodate-' + url
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'south_palace'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [back], [toMainMenuButton]]
  };
  return kb;
};

export const AccomodateMenu = (url: string): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Аренда без статуса резидента',
    callback_data: 'accomodate_no_resident-' + url
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Аренда со статусом резидента',
    callback_data: 'accomodate_as_resident-' + url
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [back], [toMainMenuButton]]
  };
  return kb;
};

export const RegisteredUserMenu = (userRole: Role): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Мои заявки',
    callback_data: 'my_applications'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Мои контакты',
    callback_data: 'my_contacts-registered'
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Сообщить о проблеме',
    callback_data: 'send_problem_report'
  };
  const b4: TelegramBot.InlineKeyboardButton = {
    text: 'Рационализаторское предложение',
    callback_data: 'proposal_innovation'
  };
  const b5: TelegramBot.InlineKeyboardButton = {
    text: 'Контактные данные УК',
    callback_data: 'uk_contact_data-registered'
  };

  const b7: TelegramBot.InlineKeyboardButton = {
    text: 'Забронировать конференц зал / переговорку',
    callback_data: 'book_hall_manual_choose'
  };
  const b8: TelegramBot.InlineKeyboardButton = {
    text: 'Новая аренда зала',
    callback_data: 'rent_for_event'
  };

  const buttons: TelegramBot.InlineKeyboardButton[][] = [[b1, b2], [b3], [b4], [b5]];

  if (userRole === 'RESIDENT') {
    buttons.push([b7]);
  }
  if (userRole === 'EVENTRENTER') {
    buttons.push([b8]);
  }
  buttons.push([toMainMenuButton]);

  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: buttons
  };
  return kb;
};
export const toMainMenuButton: TelegramBot.InlineKeyboardButton = {
  text: 'В начало',
  callback_data: 'to_main_menu'
};

export const ChangeUserDataMenu = (role: Role): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Изменить имя',
    callback_data: 'change_my-name'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Изменить почту',
    callback_data: 'change_my-email'
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Изменить номер телефона',
    callback_data: 'change_my-phone'
  };

  const b4: TelegramBot.InlineKeyboardButton = {
    text: 'Изменить организацию',
    callback_data: 'change_my-organization'
  };
  const b5: TelegramBot.InlineKeyboardButton = {
    text: 'Изменить должность',
    callback_data: 'change_my-title'
  };
  const buttons: TelegramBot.InlineKeyboardButton[][] = [[b1], [b2], [b3]];

  if (role !== 'EMPLOYEE' && role !== 'GUEST' && role !== 'EVENTRENTER') {
    buttons.push([b4], [b5]);
  }
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: buttons
  };
  return kb;
};

export const AdminPanelMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Рассылка сообщения',
    callback_data: 'send_msg_to_all'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Посмотреть все заявки',
    callback_data: 'check_all_applications'
  };

  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [b2], [toMainMenuButton]]
  };
  return kb;
};

export const RentForEventManualChooseMenu = (
  page: number,
  pageCount: number
): TelegramBot.InlineKeyboardMarkup => {
  const left = page !== 0 ? page - 1 : pageCount;
  const right = page !== pageCount ? page + 1 : 0;

  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: `rent_for_event_to-${left}`
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Выбрать',
    callback_data: `rent_for_event_selected-${page}`
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Вперед',
    callback_data: `rent_for_event_to-${right}`
  };

  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1, b2, b3], [toMainMenuButton]]
  };
  return kb;
};

export const BecomeAResidentMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Задать параметры проекта',
    callback_data: 'project_parameters'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Перечень льгот',
    callback_data: 'exemptions'
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Документы',
    callback_data: 'documets_to_obtain_resident_status-become_a_resident'
  };
  const b4: TelegramBot.InlineKeyboardButton = {
    text: 'Посмотреть существующие варианты',
    callback_data: 'existing_options-RESIDENT'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [b2, b3], [b4], [toMainMenuButton]]
  };
  return kb;
};

export const RealizationTypeMenu = (chosenPalace: string): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Аренда',
    callback_data: 'realization_type_rent-' + chosenPalace ?? ''
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Строительство',
    callback_data: 'realization_type_build'
  };

  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [b2]]
  };
  return kb;
};

export const RentForNotResidentMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Рассказать о требованиях',
    callback_data: 'rent_for_not_resident_send_requirements'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Посмотреть существующие варианты',
    callback_data: 'existing_options-NORESIDENT'
  };

  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [b2], [toMainMenuButton]]
  };
  return kb;
};

export const ExistingOptionsChooseMenu = (
  page: number,
  pageCount: number,
  role: string
): TelegramBot.InlineKeyboardMarkup => {
  const left = page !== 0 ? page - 1 : pageCount;
  const right = page !== pageCount ? page + 1 : 0;

  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: `existing_options_to-${role}:${left}`
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Выбрать',
    callback_data: `existing_options_selected-${role}:${page}`
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Вперед',
    callback_data: `existing_options_to-${role}:${right}`
  };

  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1, b2, b3], [toMainMenuButton]]
  };
  return kb;
};

export const IAmAlreadyRoleMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Я резидент',
    callback_data: 'i_am_already-RESIDENT'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Я сотрудник',
    callback_data: 'i_am_already-EMPLOYEE'
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Я постоянный арендатор',
    callback_data: 'i_am_already-NONRESIDENTRENTER'
  };
  const b4: TelegramBot.InlineKeyboardButton = {
    text: 'Я арендую помещения на мероприятия',
    callback_data: 'i_am_already-EVENTRENTER'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [b2], [b3], [b4], [toMainMenuButton]]
  };
  return kb;
};

export const MyContactsMenu = (from?: string): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Изменить контакные данные',
    callback_data: 'change_my_contacts'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: from ?? 'registered'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [b2]]
  };
  return kb;
};

export const SendProblemMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Электроснабжение',
    callback_data: 'problem_report-ELECTRICITY'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Водоснабжение / канализация',
    callback_data: 'problem_report-WATERSUPPLY'
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Отопление / кондиционирование',
    callback_data: 'problem_report-HEATING'
  };
  const b4: TelegramBot.InlineKeyboardButton = {
    text: 'Интернет / телефония / серверные',
    callback_data: 'problem_report-COMMUNICATION'
  };
  const b5: TelegramBot.InlineKeyboardButton = {
    text: 'Другое - мелкий и средний ремонт',
    callback_data: 'problem_report-OTHER'
  };
  const b6: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'registered'
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [b2], [b3], [b4], [b5], [b6]]
  };
  return kb;
};

export const BackToRegisteredMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'В меню для зарегестрированных',
    callback_data: 'registered'
  };

  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1]]
  };
  return kb;
};

export const BookHallResidentManualChooseMenu = (
  page: number,
  pageCount: number
): TelegramBot.InlineKeyboardMarkup => {
  const left = page !== 0 ? page - 1 : pageCount;
  const right = page !== pageCount ? page + 1 : 0;

  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: `book_hall_to-${left}`
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Выбрать',
    callback_data: `book_hall_selected-${page}`
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Вперед',
    callback_data: `book_hall_to-${right}`
  };
  const b4: TelegramBot.InlineKeyboardButton = {
    text: 'Назад в меню',
    callback_data: 'registered'
  };

  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1, b2, b3], [b4]]
  };
  return kb;
};

export const UserApplication = (
  page: number,
  pageCount: number
): TelegramBot.InlineKeyboardMarkup => {
  const left = page !== 0 ? page - 1 : pageCount;
  const right = page !== pageCount ? page + 1 : 0;

  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: `user_application_to-${left}`
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: `${page + 1}/${pageCount + 1}`,
    callback_data: 'nothing'
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Вперед',
    callback_data: `user_application_to-${right}`
  };
  const b4: TelegramBot.InlineKeyboardButton = {
    text: 'Назад в меню',
    callback_data: 'registered'
  };

  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1, b2, b3], [b4]]
  };
  return kb;
};

export const SupportPageMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Заявки',
    callback_data: 'application_menu'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Мои контакты',
    callback_data: 'my_contacts-support'
  };

  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1, b2]]
  };
  return kb;
};

export const ApplicationsTypeMenu = (): TelegramBot.InlineKeyboardMarkup => {
  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Заявки об аренде помещений на мероприятия',
    callback_data: 'applications_eventrent'
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: 'Заявки на аренду помещений от резидентов',
    callback_data: 'applications_book'
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Заявки о неисправностях',
    callback_data: 'applications_problem'
  };
  const b4: TelegramBot.InlineKeyboardButton = {
    text: 'Заявки с рационализаторскими предложениями',
    callback_data: 'applications_innovation'
  };
  const b5: TelegramBot.InlineKeyboardButton = {
    text: 'Заявки на становление резидентом ОЭЗ',
    callback_data: 'applications_become_resident'
  };
  const b6: TelegramBot.InlineKeyboardButton = {
    text: 'Заявки на становление арендатором-нерезидентом ОЭЗ',
    callback_data: 'applications_become_nonresidentrenter'
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: 'support'
  };

  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: [[b1], [b2], [b3], [b4], [b5], [b6], [back]]
  };
  return kb;
};

export const ApplicationCorusel = (
  page: number,
  pageCount: number,
  callback_data: string,
  chose: boolean = false,
  selected?: number
): TelegramBot.InlineKeyboardMarkup => {
  const left = page !== 0 ? page - 1 : pageCount;
  const right = page !== pageCount ? page + 1 : 0;

  const b1: TelegramBot.InlineKeyboardButton = {
    text: 'Назад',
    callback_data: `${callback_data}_to-${left}`
  };
  const b2: TelegramBot.InlineKeyboardButton = {
    text: `Ответить на заявку (${page + 1}/${pageCount + 1})`,
    callback_data: `${callback_data}_selected-${page}`
  };
  const b3: TelegramBot.InlineKeyboardButton = {
    text: 'Вперед',
    callback_data: `${callback_data}_to-${right}`
  };
  const back: TelegramBot.InlineKeyboardButton = {
    text: 'В меню',
    callback_data: `application_menu`
  };

  const b4: TelegramBot.InlineKeyboardButton = {
    text: 'Принять',
    callback_data: `${callback_data}_accepted-${selected}`
  };
  const b5: TelegramBot.InlineKeyboardButton = {
    text: 'Отклонить',
    callback_data: `${callback_data}_declined-${selected}`
  };
  const kb: TelegramBot.InlineKeyboardMarkup = {
    inline_keyboard: chose === true ? [[b4, b5]] : [[b1, b3], [b2], [back]]
  };
  return kb;
};
