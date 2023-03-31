import { useLockFn, useSetState } from 'ahooks';
import { combinationRevokeOrders } from '@/api/module-api/combination-position';

interface IUseRevocationOrders {
  modalInfo: Record<string, any>;
  setModalInfo: (...args: any[]) => any;
  handleRevokeOrders: (...args: any[]) => any;
}

export default function useRevocationOrders(): IUseRevocationOrders {
  const [modalInfo, setModalInfo] = useSetState<Record<string, any>>({
    visible: false,
    orderInfo: {},
  });

  // 撤单
  const handleRevokeOrders = useLockFn(async (callback: (...args: any[]) => any) => {
    const { orderInfo } = modalInfo;

    return combinationRevokeOrders({ orderNo: orderInfo.orderNo, refNo: orderInfo.refNo })
      .then((res) => {
        if (res.code !== 0) return;

        setModalInfo({ visible: false });
        callback();
      })
      .catch((error) => {
        console.log('【实盘组合撤单请求错误】', error);
      });
  });

  return {
    modalInfo,
    setModalInfo,
    handleRevokeOrders,
  };
}
