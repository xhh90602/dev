import { useEffect, useState } from 'react';
import { useResetState } from 'ahooks';
import { getTradeUserInfo } from '@/platforms/mobile/helpers/native/msg';
import { getUserInfo } from '@/api/module-api/combination-position';
import { Toast } from 'antd-mobile';
import { postStockTransfer } from '@/api/module-api/stocks_roll';

export interface Data {
  clientAccount: string; // 客户证券账号(交易账号)
  clientName: string; // 客户姓名
  currency?: string; // 单位
  inAccount: string; // 接收账户
  inAccountName: string; // 接收账户名称
  inBroker?: string; // 接收券商
  inCcass?: string; // 接收券商ccass
  outAccount: string; // 转出账户
  outAccountName: string; // 转出账户名称
  outBroker?: string; // 转出券商
  outCcass?: string; // 转出券商ccass
  outPrice?: number; // 转出费用（预估）
  settleDate?: string; // 上日收市日期
  stockInfo: {
    // 股票信息
    closingPrice: number; // 昨收价格
    market: string; // 小市场，前端用
    number: number; // 数量
    stock: string; // 股票代码
    stockName: string; // 股票名称
  }[];
  type: number; // 转股类型 [0 转入 1 转出]
}

interface IProps {
  type: 'in' | 'out'
}

/**
 * @description 股票转股
 * @param {string} type in-转入 out-转出
 */
const useStockRoll = (props: IProps) => {
  const { type } = props;
  // 是否转入
  const isIn = type === 'in';

  /* 转入提示弹窗开关 */
  const [inHintVisable, setInHintVisable] = useState(isIn);
  /* 步骤，值从0开始 */
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  const [data, setFormData, resetData] = useResetState<Data>({
    clientAccount: '',
    clientName: '',
    currency: '',
    inAccount: '',
    inAccountName: '',
    inCcass: '',
    inBroker: '',
    outAccount: '',
    outAccountName: '',
    outCcass: '',
    outBroker: '',
    outPrice: 0,
    stockInfo: [
      {
        closingPrice: 0,
        market: '',
        number: 0,
        stock: '',
        stockName: '',
      },
    ],
    type: isIn ? 0 : 1,
  });

  /**
   * @description 设置表单数据
   * @example
   * setData({ name: '张三' })
   */
  const setData = (obj: any) => {
    setFormData({
      ...data,
      ...obj,
    });
  };

  /**
   * @description 重置表单数据
   */
  const resetDataHandle = () => {
    resetData();
    fetchUserInfo();
  };

  /**
   * @description 获取用户信息
   */
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const tradeUserInfo = await getTradeUserInfo();
      const { result: userInfoRes = {} } = await getUserInfo({ clientId: tradeUserInfo?.account });

      const newData: any = {};
      if (isIn) {
        newData.inAccount = tradeUserInfo?.account || '';
        newData.inBroker = '中薇证券';
        newData.inCcass = 'B01969';
      } else {
        newData.outAccount = tradeUserInfo?.account || '';
        newData.outBroker = '中薇证券';
        newData.outCcass = 'B01969';
      }
      setData({
        ...newData,
        clientAccount: tradeUserInfo?.account || '',
        clientName: userInfoRes?.name || '',
        inAccountName: userInfoRes?.name || '',
        outAccountName: userInfoRes?.name || '',
      });
      setLoading(false);
    } catch (err) {
      console.log('获取用户信息失败', err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 转股市场
  const [stockMarket, setStockMarket] = useState('');

  /**
   * @description 选择市场
   * @param {string} market hk-港股 a-A股
   */
  const selectMarket = (market: 'hk' | 'a') => {
    console.log(market);
    setStockMarket(market);
    // 港股币种为HKD，A股为CNY
    setData({ currency: market === 'hk' ? ' HKD' : ' CNY' });
    setStep(step + 1);
  };

  /**
   * @description 去指引
   */
  const goToGuide = () => {
    Toast.show({
      content: '待接入',
    });
  };

  /**
   * @description 提交转股
   */
  const submitRoll = () => {
    setLoading(true);
    postStockTransfer(data)
      .then((res) => {
        const { code } = res;
        if (code === 0) {
          setStep(4);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    step,
    setStep,
    data,
    setData,
    loading,
    inHintVisable,
    setInHintVisable,
    resetDataHandle,
    stockMarket,
    selectMarket,
    goToGuide,
    submitRoll,
  };
};

export default useStockRoll;
