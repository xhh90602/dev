import { TRADE_ORDER_STATUS } from '@/constants/trade';
import { IconPosition } from '../components/tabs/tabs';

export const orderTypeA: {
  title: string;
  key: string;
  iconSvgName?: string;
  iconPositionSvg?: IconPosition;
  iconTransform?: [number, number];
}[] = [
  {
    title: '限价单',
    key: TRADE_ORDER_STATUS.LMT,
  },
  {
    title: '条件单',
    key: TRADE_ORDER_STATUS.CONDITION,
    iconSvgName: 'icon_hot',
    iconPositionSvg: 'top',
    iconTransform: [-50, -90],
  },
];

export const orderType: {
  title: string;
  key: string;
  iconSvgName?: string;
  iconPositionSvg?: IconPosition;
  iconTransform?: [number, number];
}[] = [
  {
    title: '市价单',
    key: TRADE_ORDER_STATUS.MKT,
  },
  {
    title: '限价单',
    key: TRADE_ORDER_STATUS.ELO,
  },
  {
    title: '条件单',
    key: TRADE_ORDER_STATUS.CONDITION,
    iconSvgName: 'icon_hot',
    iconPositionSvg: 'top',
    iconTransform: [-50, -90],
  },
  {
    title: '竞价单',
    key: TRADE_ORDER_STATUS.AO,
  },
];

/** 获取委托类型对应展示文本 */
export const getOrderTypeText = (str = ''): string => {
  const orderList = [
    {
      title: '竞价单',
      key: TRADE_ORDER_STATUS.AO,
    },
    {
      title: '竞价单',
      key: TRADE_ORDER_STATUS.AL,
    },
    {
      title: '限价单',
      key: TRADE_ORDER_STATUS.ELO,
    },
    {
      title: '限价单',
      key: TRADE_ORDER_STATUS.LMT,
    },
    {
      title: '市价单',
      key: TRADE_ORDER_STATUS.MKT,
    },
  ];

  const strTitle = orderList.find((o) => o.key === str);

  if (strTitle) return strTitle.title;

  return '条件单';
};
