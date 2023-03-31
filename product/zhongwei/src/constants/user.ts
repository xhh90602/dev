// 证件类型
export enum ID_TYPE {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  S = 'S',
  H = 'H',
  P = 'P',
  Q = 'Q',
  Z = 'Z',
}

export const ID_TYPE_DICT = {
  [ID_TYPE.A]: '大陆身份证',
  [ID_TYPE.B]: '香港身份证',
  [ID_TYPE.C]: '美国身份证',
  [ID_TYPE.D]: '驾驶证',
  [ID_TYPE.S]: '商业登记证',
  [ID_TYPE.H]: '港澳通行证',
  [ID_TYPE.P]: '大陆护照',
  [ID_TYPE.Q]: '海外护照',
  [ID_TYPE.Z]: '其他',
};
