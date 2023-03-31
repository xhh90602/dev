export const data = {
  code: 0,
  message: '请求成功',
  result: [
    {
      id: 8,
      name: '股票范围',
      parentId: 0,
      vos: [
        {
          id: 9,
          name: '市场',
          type: 'select',
          parentId: 8,
        },
        {
          id: 11,
          name: '指数成分',
          type: 'select',
          parentId: 8,
        },
        {
          id: 10,
          name: '行业',
          type: 'select',
          parentId: 8,
        },
      ],
    },
    {
      id: 1,
      name: '公司信息',
      parentId: 0,
      vos: [
        {
          id: 12,
          name: '总市值',
          type: 'popup',
          parentId: 1,
        },
        {
          id: 13,
          name: '流通市值',
          type: 'popup',
          parentId: 1,
        },
        {
          id: 14,
          name: '总股本',
          type: 'popup',
          parentId: 1,
        },
        {
          id: 15,
          name: '流通股本',
          type: 'popup',
          parentId: 1,
        },
      ],
    },
    {
      id: 2,
      name: '偿债指标',
      parentId: 0,
      vos: [
        {
          id: 33,
          name: '资产负债率',
          type: 'popup',
          parentId: 2,
        },
        {
          id: 34,
          name: '流动比率',
          type: 'popup',
          parentId: 2,
        },
        {
          id: 35,
          name: '速动比率',
          type: 'popup',
          parentId: 2,
        },
        {
          id: 36,
          name: '利息覆盖倍数',
          type: 'popup',
          parentId: 2,
        },
      ],
    },
    {
      id: 3,
      name: '成长指标',
      parentId: 0,
      vos: [
        {
          id: 28,
          name: '总资产同比增长率',
          type: 'popup',
          parentId: 3,
        },
        {
          id: 29,
          name: '净资产同比增长率',
          type: 'popup',
          parentId: 3,
        },
        {
          id: 30,
          name: '固定资产同比增长率',
          type: 'popup',
          parentId: 3,
        },
        {
          id: 31,
          name: '营业收入同比增长率',
          type: 'popup',
          parentId: 3,
        },
        {
          id: 32,
          name: '净利润同比增长率',
          type: 'popup',
          parentId: 3,
        },
      ],
    },
    {
      id: 4,
      name: '收入指标',
      parentId: 0,
      vos: [
        {
          id: 20,
          name: '营业收入',
          type: 'popup',
          parentId: 4,
        },
        {
          id: 21,
          name: 'EBITDA',
          type: 'popup',
          parentId: 4,
        },
        {
          id: 22,
          name: 'EBIT',
          type: 'popup',
          parentId: 4,
        },
        {
          id: 23,
          name: '净利润',
          type: 'popup',
          parentId: 4,
        },
      ],
    },
    {
      id: 5,
      name: '经营指标',
      parentId: 0,
      vos: [
        {
          id: 37,
          name: '存货周转率',
          type: 'popup',
          parentId: 5,
        },
      ],
    },
    {
      id: 6,
      name: '市值指标',
      parentId: 0,
      vos: [
        {
          id: 16,
          name: '市盈率（TTM）',
          type: 'popup',
          parentId: 6,
        },
        {
          id: 17,
          name: '市盈率（静）',
          type: 'popup',
          parentId: 6,
        },
        {
          id: 18,
          name: '市净率',
          type: 'popup',
          parentId: 6,
        },
        {
          id: 19,
          name: '市销率（TTM）',
          type: 'popup',
          parentId: 6,
        },
      ],
    },
    {
      id: 7,
      name: '盈利指标',
      parentId: 0,
      vos: [
        {
          id: 24,
          name: '毛利率',
          type: 'popup',
          parentId: 7,
        },
        {
          id: 25,
          name: '净利率',
          type: 'popup',
          parentId: 7,
        },
        {
          id: 26,
          name: '股息率',
          type: 'popup',
          parentId: 7,
        },
        {
          id: 27,
          name: '每股盈利',
          type: 'popup',
          parentId: 7,
        },
      ],
    },
  ],
  success: true,
};
