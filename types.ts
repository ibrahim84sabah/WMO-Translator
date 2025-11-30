
export interface WeatherTranslation {
  code: string;
  wmoCodeNumber?: string; // New field for Synoptic/Numeric code
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  groundingUrls: string[];
}

export enum TranslationMode {
  AUTO = 'AUTO',
  CODE_TO_NAME = 'CODE_TO_NAME',
  NAME_TO_CODE = 'NAME_TO_CODE',
}

export interface HistoryItem extends WeatherTranslation {
  id: string;
  timestamp: number;
}
