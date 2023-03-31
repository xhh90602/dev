interface IHSTrendTabs {
  name: string;
  type: number;
}

export const hsTrendTabs: IHSTrendTabs[] = [
  {
    name: '近一周',
    type: 1,
  },
  {
    name: '近一月',
    type: 3,
  },
  {
    name: '近三月',
    type: 6,
  },
  {
    name: '創建至今',
    type: 12,
  },
];
