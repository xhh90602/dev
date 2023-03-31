import { useContext } from 'react';
import { toPlaceholderNotZero } from '@dz-web/o-orange';
import { LAN_ENUM } from '@pc/constants/config';
import { userConfigContext } from '@pc/helpers/entry/native';

export function createValueFieldDict(arr: string[]) {
  return {
    [LAN_ENUM.ZH_CN]: arr[0],
    [LAN_ENUM.ZH_TW]: arr[1],
  };
}

export default function useI18nField(valueFieldDict) {
  const { language } = useContext<any>(userConfigContext);

  return (valueDict) => toPlaceholderNotZero(valueDict[valueFieldDict[language]]);
}

export function useI18nStockName(): any {
  return useI18nField(createValueFieldDict(['name', 'tr_name']));
}

export function useI18nBlockName(): any {
  return useI18nField(createValueFieldDict(['BlockName', 'BlockName_T']));
}
