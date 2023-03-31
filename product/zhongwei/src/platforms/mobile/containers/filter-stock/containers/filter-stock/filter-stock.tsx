import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { queryCategory } from '@/api/module-api/filter-stock';
import { useSearchParam } from 'react-use';
import { Toast } from 'antd-mobile';
import Filter from '../../components/filter/filter';
import { marketList } from '../../constants';
import { useConditionStore } from '../../model';

import './filter-stock.scss';

interface FilterStockProps {
  isEdit?: boolean;
  setIsShowFilterResult: (v: boolean) => void;
}

const FilterStock: React.FC<FilterStockProps> = (props) => {
  const { setIsShowFilterResult } = props;
  const mk = useSearchParam('mk') || 'hk';
  const source = useSearchParam('source') || '';
  const strategyId = Number(useSearchParam('strategyId')) || '';
  const region = useConditionStore((state) => state.region);
  const setRegion = useConditionStore((state) => state.setRegion);
  const resultTotal = useConditionStore((state) => state.resultTotal);
  const conditionLength = useConditionStore((state) => state.valueLength);

  const [categoryData, setCategoryData] = useState<any>([]);

  const viewTheResults = () => {
    setIsShowFilterResult(true);
  };

  const marketFormatList = useMemo(() => {
    if (strategyId && source === 'celue') {
      return marketList.filter((item) => item.key === mk);
    }
    return marketList;
  }, [source]);

  useEffect(() => {
    let unmount = false;
    if (!region) {
      setRegion(marketFormatList[0].key);
      return undefined;
    }

    queryCategory(region)
      .then((res) => {
        if (unmount) return;
        setCategoryData(res.result);
      })
      .catch((err) => {
        Toast.show({ content: `接口异常：${err.message}` });
      });

    return () => {
      unmount = true;
    };
  }, [region]);

  return (
    <div styleName="page" className="page">
      <ol styleName="nav" className="nav">
        {
          marketFormatList.map((item) => (
            <li
              key={item.key}
              onClick={() => {
                if (region === item.key) return;
                setRegion(item.key);
              }}
              styleName={classNames('nav-items', {
                'nav-items-active': region === item.key,
              })}
            >
              {item.name}
            </li>
          ))
        }
      </ol>

      <div styleName="main">
        <Filter category={categoryData} />
      </div>

      <div styleName="footer">
        <p>
          已选
          <span styleName="footer-mark" className="num-font">{conditionLength}</span>
          项，共
          <span styleName="footer-mark" className="num-font">{resultTotal}</span>
          只股票
        </p>

        <div styleName="go-to-result" onClick={viewTheResults}>查看结果</div>
      </div>
    </div>
  );
};

export default FilterStock;
