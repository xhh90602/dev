import React, { memo } from 'react';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { useIntl } from 'react-intl';
import Menu1 from '@/platforms/mobile/images/menu_01.png';
import Menu2 from '@/platforms/mobile/images/menu_02.png';
import Menu3 from '@/platforms/mobile/images/menu_03.png';
import Menu4 from '@/platforms/mobile/images/menu_04.png';

import './index.scss';

const StrategyClass: React.FC<any> = memo(() => {
  const { formatMessage } = useIntl();

  // 分类跳转
  const goPage = (id) => {
    if (id === 1) {
      nativeOpenPage('add-stock.html?source=celue', true);
    }
    if (id === 2) {
      nativeOpenPage('stock-pk.html', false);
    }
    if (id === 3) {
      nativeOpenPage('large-order-analysis.html', false);
    }
    if (id === 4) {
      nativeOpenPage('abnormal-detail.html', false, true);
    }
  };

  const list = [
    { id: 1, name: formatMessage({ id: 'stock_picker' }), icon: Menu1 },
    { id: 2, name: formatMessage({ id: 'stock_pk' }), icon: Menu2 },
    { id: 3, name: formatMessage({ id: 'large_order_analysis' }), icon: Menu3 },
    { id: 4, name: formatMessage({ id: 'job_transfer_list' }), icon: Menu4 },
  ];

  return (
    <div styleName="wrap">
      <div styleName="strategy-class">
        {
          list.map((item) => (
            <div styleName="item" key={item.id} onClick={() => goPage(item.id)}>
              <img src={item.icon} alt="" />
              <p>{item.name}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
});

export default StrategyClass;
