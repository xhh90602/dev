import { useEffect, useState } from 'react';
import { useQuoteClient } from 'quote-client-react';
import { useIntl } from 'react-intl';

export interface IUseIpo {
  selectWidth: (...args: any[]) => any;
  dan: (...args: any[]) => any;
  setGauge: (...args: any[]) => any;
  dataInfo: any;
  getMoney: number;
  saleMoney: number;
}

// 请求资金流向
const gangguFlow = {
  ReqType: 1201,
  ReqID: 1,
  Block: -1,
  // 1999 港股 7700恒指 7701港中资 7702 国指
  // Data: [{ BlockID: 1999 }, { BlockID: 7700 }, { BlockID: 7701 }, { BlockID: 7702 }],
};

export default function useFliterData(indexStr): IUseIpo {
  // const { indexStr } = props;
  const { wsClient, isWsClientReady: isQuoteReady } = useQuoteClient();

  const [dataInfo, setDataInfo]: any = useState({}); // 上涨，持平，下跌数据
  const [getMoney, setGetMoney] = useState(0); // 流入
  const [saleMoney, setSaleMoney] = useState(0); // 流出

  const { formatMessage } = useIntl();

  // 比例条
  function selectWidth(data, keyType) {
    const { Fall, NoChange, Raise } = data;
    let colorT;
    let Bcolor = '';
    switch (keyType) {
      case 'up':
        colorT = (Raise / (Fall + NoChange + Raise)) * 100;
        Bcolor = '#2d9e00 transparent transparent';
        break;
      case 'nochange':
        colorT = (NoChange / (Fall + NoChange + Raise)) * 100;
        break;
      case 'down':
        colorT = (Fall / (Fall + NoChange + Raise)) * 100;
        Bcolor = 'transparent transparent #f23030';
        break;
      default:
    }
    return {
      width: `${colorT}%`,
      borderColor: Bcolor,
    };
  }

  // 数据K,M,B单位
  function dan(num) {
    const data = num.toFixed(0).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    if (data.includes(',')) {
      const data2 = data.split(',');
      if (data2.length >= 4) return `${(num / 1000000000).toFixed(2)}B`;
      if (data2.length === 3) return `${(num / 100000).toFixed(2)}M`;
      if (data2.length === 2) return `${(num / 1000).toFixed(2)}K`;
    }
    return data;
  }

  // 绘制的图表
  const setGauge = (get, sale) => ({
    tooltip: {
      trigger: 'item',
    },
    color: ['#ea4e4e', '#0fcc4e'],
    // color: [riseFallColor.fallColor, riseFallColor.riseColor],
    series: [
      {
        hoverAnimation: false,
        name: formatMessage({ id: '当日资金流向' }),
        type: 'pie',
        radius: '75%',
        data: [
          { value: sale, name: '流出' },
          { value: get, name: '流入' },
        ],
        emphasis: {
          scale: false,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },

        // itemStyle: {
        //   borderColor: getStyle(),
        //   borderWidth: 0,
        // },
      },
    ],
  });

  // 请求数据
  const getUpDownData = async (data) => {
    console.log(data, '--------data');

    const { BlockID, Code, Market } = data;
    const option1 = { ReqType: 1260, ReqID: 1, Data: { Type: '0', Code, Market } };
    const option2 = { ...gangguFlow, Data: [{ BlockID }] };
    // console.log(option1, '---------------option1');
    console.log(option2, '---------------option2');

    // 发送涨跌分布参数;
    const res1 = await wsClient?.send(option1).promise;
    const res2 = await wsClient?.send(option2).promise;

    const { StaticList } = res1.Data;
    setDataInfo(StaticList[0]);
    console.log(res2);

    const aimArr = res2.Data;
    if (aimArr.length) {
      const Buy = aimArr[0].ExBigBuyAmount + aimArr[0].BigBuyAmount + aimArr[0].MidBuyAmount + aimArr[0].SmallBuyAmount;
      // eslint-disable-next-line max-len
      const Sale = aimArr[0].ExBigSellAmount + aimArr[0].BigSellAmount + aimArr[0].MidSellAmount + aimArr[0].SmallSellAmount;
      setGetMoney(Buy);
      setSaleMoney(Sale);
      console.log(getMoney);
      console.log(saleMoney);
    }
  };

  useEffect(() => {
    if (!isQuoteReady) return;
    getUpDownData(indexStr);
  }, [indexStr, isQuoteReady]);

  return { selectWidth, dan, setGauge, dataInfo, getMoney, saleMoney };
}
