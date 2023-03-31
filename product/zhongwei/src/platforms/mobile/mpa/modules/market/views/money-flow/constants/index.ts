interface IPeriodList {
  label: string;
  value: number;
}

export const periodList: IPeriodList[] = [
  {
    label: '今日',
    value: 0,
  },
  {
    label: '3日',
    value: 3,
  },
  {
    label: '5日',
    value: 5,
  },
  {
    label: '10日',
    value: 10,
  },
];

export const analyzeList: IPeriodList[] = [
  {
    label: '近1日',
    value: 1,
  },
  {
    label: '近5日',
    value: 5,
  },
  {
    label: '近20日',
    value: 20,
  },
  {
    label: '近60日',
    value: 60,
  },
];
