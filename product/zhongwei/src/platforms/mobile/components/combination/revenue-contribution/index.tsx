import React, { memo, useState, useEffect } from 'react';
import { getStockContribution } from '@/api/module-api/combination';
import { useIntl } from 'react-intl';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import IconMore from '@/platforms/mobile/images/icon_zh_more.svg';
import Empty from '@/platforms/mobile/components/combination/empty';
import Table from './table';

import './index.scss';

const WarehouseRecord: React.FC<any> = memo((props) => {
  const { portfolioId } = props;
  const [list, setList] = useState<any>();
  const { formatMessage } = useIntl();

  // 获取收益走势数据
  const getStockContributionList = () => {
    getStockContribution({
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0) {
        setList(res?.result?.stockContributeVOList || []);
      }
      return [];
    });
  };

  useEffect(() => {
    getStockContributionList();
  }, []);

  const goDetail = () => {
    if (list && list.length) {
      nativeOpenPage(`contribution-record.html?portfolioId=${portfolioId}`);
    }
  };

  return (
    <div styleName="warp">
      <div
        styleName="title"
        onClick={() => goDetail()}
      >
        <span styleName="title-header">{formatMessage({ id: 'revenue_contribution' })}</span>
        {
          list && list.length ? (
            <img styleName="go-detail" src={IconMore} alt="" />
          ) : ''
        }
      </div>
      {
        list && list.length ? (
          <Table list={list} />
        ) : (
          <div styleName="empty-box"><Empty /></div>
        )
      }
    </div>
  );
});

export default WarehouseRecord;
