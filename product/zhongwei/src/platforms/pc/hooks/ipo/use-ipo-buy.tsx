import { useEffect, useState } from 'react';
import { useInRouterContext } from 'react-router-dom';
import { parseUrlBySearch } from '@dz-web/o-orange';
import { useIntl } from 'react-intl';
import { useSetState, useLockFn } from 'ahooks';
import { handleNavigate } from '@/utils/navigate';
import { getIpoDetails, getIpoPoundage, submittedSubscribe, getProspectus } from '@/api/module-api/ipo';
import { SUBSCRIBE_TYPE_ALIAS } from '@pc/constants/ipo';
import { sub } from '@/utils/num';
import { message } from 'antd';

export interface IUseIpo {
  isLoading: boolean;
  submitLoading: boolean;
  subscribeInfo: Record<string, any>;
  modalVisible: Record<string, boolean>;
  setSubscribeInfo: (...arg: any[]) => any;
  setModalVisible: (...arg: any[]) => any;
  handleSwitchType: (...arg: any[]) => any;
  handleSwitchNumber: (...arg: any[]) => any;
  handleSubmit: (...ary: any[]) => any;
  handleSubmittedSubscribe: (...arg: any[]) => any;
  handleSwitchPage: (...arg: any[]) => any;
  openProspectus: (...arg: any[]) => any;
}

export default function useIpoBuy(): IUseIpo {
  const { formatMessage } = useIntl();

  const isRouterContext = useInRouterContext();
  const ipoCode = parseUrlBySearch('code');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const [subscribeInfo, setSubscribeInfo] = useSetState<Record<string, any>>({
    subscribeType: SUBSCRIBE_TYPE_ALIAS.CASH, // 现金认购
    detailsData: {}, // 新股详情
    subscribeAmount: {}, // 认购数量/股数
    poundageRecord: {}, // 费用
    lendingPercent: 0, // 融资比例
    isAgree: false, // 是否同意申购声明
  });

  const [modalVisible, setModalVisible] = useSetState<Record<string, boolean>>({
    confirmModal: false, // 认购确认Modal
    successfulModal: false, // 认购成功Modal
  });

  useEffect(() => {
    setIsLoading(true);

    getIpoDetails({
      stockCode: ipoCode,
    })
      .then((res) => {
        if (res?.code !== 0) {
          return;
        }

        const { applyQtyList = [] } = res.result;
        const defaultAty = applyQtyList[0];

        setSubscribeInfo({
          detailsData: res.result,
          subscribeAmount: defaultAty,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const { detailsData, subscribeAmount, lendingPercent } = subscribeInfo;
    const isFlag = !detailsData.iFpurchase && subscribeAmount.qty;

    if (isFlag) {
      // 获取手续费
      getIpoPoundage({
        ipoCode: detailsData.ipoCode,
        appliedQty: subscribeAmount.qty,
        lendingPercentage: lendingPercent,
      }).then((res) => {
        if (res?.code === 0) {
          setSubscribeInfo({
            poundageRecord: res?.result,
          });
        }
      });
    }
  }, [subscribeInfo.subscribeType, subscribeInfo.subscribeAmount, subscribeInfo.lendingPercent]);

  // 切换认购类型
  const handleSwitchType = (e: any) => {
    const type = e.target.value;

    if (type === SUBSCRIBE_TYPE_ALIAS.FINANCING) {
      // 认购类型 = 融资认购
      const { lendingPercentList = [] } = subscribeInfo.detailsData;

      return setSubscribeInfo({
        subscribeType: type,
        lendingPercent: lendingPercentList[0]?.lendingPercentage,
      });
    }

    return setSubscribeInfo({
      subscribeType: type,
      lendingPercent: 0,
    });
  };

  // 切换认购数量
  const handleSwitchNumber = (val: number) => {
    const {
      detailsData: { applyQtyList = [], ipoBuyingPower, ipoBuyingPowerFinanc },
      subscribeType,
    } = subscribeInfo;

    // 查询认购数量详情
    const reuslt = applyQtyList.find((item: Record<string, number>) => item.qty === val);
    // IPO最大购买力 现金
    let purchasableAmount = ipoBuyingPower;

    // 当前认购类型 = 融资认购
    if (subscribeType === SUBSCRIBE_TYPE_ALIAS.FINANCING) {
      purchasableAmount = ipoBuyingPowerFinanc;
    }

    if (sub(purchasableAmount, reuslt.amount) < 0) {
      return message.error({ content: formatMessage({ id: '您的IPO购买力不足' }) });
    }

    return setSubscribeInfo({
      subscribeAmount: reuslt,
    });
  };

  // 提交申请
  const handleSubmit = () => {
    if (!subscribeInfo.isAgree) {
      return message.error({ content: formatMessage({ id: '请勾选声明' }) });
    }

    return setModalVisible({ confirmModal: true });
  };

  // 最终提交认购
  const handleSubmittedSubscribe = useLockFn(async () => {
    setSubmitLoading(true);

    const {
      subscribeType,
      lendingPercent,
      detailsData,
      subscribeAmount,
      poundageRecord: { appliedAmount, interestRate },
    } = subscribeInfo;

    const params: Record<string, string | number> = {
      type: 0, // 0 新增
      amount: appliedAmount,
      qty: subscribeAmount.qty,
      stockCode: detailsData.stockCode,
      orderId: detailsData.ipoCode,
      purchaseType: subscribeType === SUBSCRIBE_TYPE_ALIAS.CASH ? 0 : 1,
    };

    // 如果是融资认购
    if (params.purchaseType) {
      params.financeRate = interestRate;
      params.financeRatio = lendingPercent;
    }

    submittedSubscribe(params)
      .then((res) => {
        if (res?.code === 0) {
          setModalVisible({
            confirmModal: false,
            successfulModal: true,
          });
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  });

  // 跳转至其他页面
  const handleSwitchPage = (fileName: string) => {
    let path = `/${fileName}.html`;

    if (isRouterContext) {
      path = `/trade.html#/${fileName}`;
    }

    handleNavigate(path);
  };

  // 打开招股书
  const openProspectus = (code: string | number) => {
    getProspectus({
      code,
    }).then((res) => {
      if (res?.code === 0) {
        const { stockPath } = res.result;
        const newWindow: any = window.open(stockPath);
        newWindow.opener = null;
      }
    });
  };

  return {
    isLoading,
    submitLoading,
    subscribeInfo,
    modalVisible,
    setSubscribeInfo,
    setModalVisible,
    handleSwitchType,
    handleSwitchNumber,
    handleSubmit,
    handleSubmittedSubscribe,
    handleSwitchPage,
    openProspectus,
  };
}
