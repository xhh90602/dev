import { useEffect, useState } from 'react';

let stockCode = '';

/**
 * chong
 * @param props
 */
const useResetTradeForm = (props) => {
  const { code, market, stockInfo } = props;

  const [isFirst, setIsFirst] = useState(false);

  useEffect(() => {
    if (stockInfo.now) {
      // 是否首次变更code
      if (!isFirst) {
        setIsFirst(true);
      }
    }
  }, [stockInfo, isFirst]);

  useEffect(() => {
    if (stockCode !== code) {
      setIsFirst(false);
      stockCode = code;
    }
  }, [code]);
};

export default useResetTradeForm;
