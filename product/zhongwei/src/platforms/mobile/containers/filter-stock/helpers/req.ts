import { QeqType, UnitMap } from '../constants';

export function parseReqParams(info: any): any {
  const { type, dimension } = info;
  let range: any = [];
  if (Array.isArray(info.range)) {
    const [min, max] = info.range || [0, 0];
    range = [min, max];
  } else {
    const { min, max } = info.range || { min: 0, max: 0 };
    range = [min, max];
  }
  if (type === QeqType.picker) {
    if (Array.isArray(info.value)) {
      return { dimension, val: [...info.value] };
    }
    if (info.value.indexOf(',') > -1) {
      return { dimension, val: info.value.split(',') };
    }

    return { dimension, val: [info.value] };
  }

  if (type === QeqType.slider) {
    const { conditions, period, subDim } = info;
    const [min, max] = range;
    const unit = +UnitMap[conditions] || 1;
    const params: any = {
      dimension,
      range: { min: min * unit, max: max * unit },
    };
    if (period) params.period = period;
    if (subDim) params.subDim = subDim;
    return params;
  }

  if (type === QeqType.address_list) {
    const { list } = info;

    return { dimension, val: list.map((item) => item.code) };
  }

  return info;
}

export function parseReqParamsObj(info: any): any {
  const list: any[] = [];

  Object.keys(info).forEach((key) => {
    list.push(parseReqParams(info[key]));
  });

  return list;
}
