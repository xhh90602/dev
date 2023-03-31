import produce from 'immer';
import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { queryFilterStockTotal } from '@/api/module-api/filter-stock';

import { parseReqParamsObj } from '../helpers/req';

interface ConditionStore {
  value: any;
  region: string;
  valueList: any[];
  valueLength: number;
  resultTotal: number;
  regionTotal: number;
  setCondition: (newValue: any) => void;
  delCondition: (key: string) => void;
  setRegion: (key: string) => void;
  getFilterStock: () => void;
}

export const useConditionStore = create(subscribeWithSelector<ConditionStore>((set, get) => ({
  region: '',
  value: {},
  valueList: [],
  valueLength: 0,
  resultTotal: 0,
  regionTotal: 0,
  isInit: true,
  setRegion: (value: string) => set(produce((state) => {
    state.getRegionStock(value, state);
    Object.assign(state, { region: value, value: {}, valueLength: 0, resultTotal: 0 });
  })),
  setCondition: (newValue) => set(produce((state) => {
    const newVal = (Object.assign(state.value, newValue));

    state.valueList = Object.keys(newVal).map((key) => newVal[key]);
    state.valueLength = Object.keys(newVal).length;
  })),
  delCondition: (key: string) => set(produce((state) => {
    delete state.value[key];
    state.valueLength = Object.keys(state.value).length;
  })),
  getRegionStock: (val: string) => {
    if (!val) return;
    queryFilterStockTotal([{
      dimension: 'region',
      val: [val],
    }])
      .then((res) => {
        set(produce((state) => {
          state.isInit = false;
          state.regionTotal = res.body.total || 0;
        }));
      })
      .catch((err) => {
        console.log(err, '<-- err');
      });
  },
  getFilterStock: () => {
    if (!get().region) return;
    queryFilterStockTotal([...parseReqParamsObj(get().value), {
      dimension: 'region',
      val: [get().region],
    }])
      .then((res) => {
        set(produce((state) => {
          state.resultTotal = res?.body?.total || 0;
        }));
      })
      .catch((err) => {
        console.log(err, '<-- err');
      });
  },
})));

useConditionStore.subscribe(
  (state) => state.value,
  useConditionStore.getState().getFilterStock,
  {
    fireImmediately: false,
  },
);
