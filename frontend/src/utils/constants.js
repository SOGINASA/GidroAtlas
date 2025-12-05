export const USER_ROLES = {
    CITIZEN: 'citizen',
    EMERGENCY: 'emergency',
    ADMIN: 'admin'
  };
  
  export const WATER_BODY_TYPES = {
    LAKE: 'lake',
    RIVER: 'river',
    RESERVOIR: 'reservoir',
    CANAL: 'canal'
  };
  
  export const FACILITY_TYPES = {
    HYDROPOWER: 'hydropower',
    DAM: 'dam',
    CANAL: 'canal',
    LOCK: 'lock',
    RESERVOIR: 'reservoir',
    PUMPING_STATION: 'pumping_station'
  };
  
  export const REGIONS = [
    'Акмолинская область',
    'Актюбинская область',
    'Алматинская область',
    'Атырауская область',
    'Восточно-Казахстанская область',
    'Жамбылская область',
    'Западно-Казахстанская область',
    'Карагандинская область',
    'Костанайская область',
    'Кызылординская область',
    'Мангистауская область',
    'Павлодарская область',
    'Северо-Казахстанская область',
    'Туркестанская область',
    'Алматы',
    'Астана',
    'Шымкент'
  ];
  
  export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';