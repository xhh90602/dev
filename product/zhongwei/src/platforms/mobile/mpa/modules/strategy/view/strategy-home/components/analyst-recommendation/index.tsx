import React, { memo, useState, useEffect } from 'react';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { useIntl } from 'react-intl';
import { Toast } from 'antd-mobile';
import { getStrategyAnalystList } from '@/api/module-api/strategy';
import IconMore from '@/platforms/mobile/images/icon_zh_more.svg';
import AnalystCard from '@/platforms/mobile/mpa/modules/strategy/components/analyst-item-card';
import Empty from '@/platforms/mobile/components/combination/empty';
import './index.scss';

const AnalystRecommendDetail: React.FC<any> = memo(() => {
  const [list, setList] = useState<any>([]);
  const { formatMessage } = useIntl();

  const getList = () => {
    try {
      getStrategyAnalystList({ keyword: '', pageSize: 4, pageNum: 1 }).then((res) => {
        if (res && res.code === 0 && res.result) {
          setList(res.result || []);
        }
      }).catch((err) => {
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err) {
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  // 跳转到更多
  const goMorePage = () => {
    nativeOpenPage('analyst-recommend-detail.html', false, true);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div styleName="wrap">
      <div styleName="title-box">
        <div styleName="title">{formatMessage({ id: 'analyst_recommendation' })}</div>
        <img src={IconMore} alt="" onClick={() => goMorePage()} />
      </div>
      <div styleName="analyst-recommendation">
        {
          list && list.length ? (
            <div styleName="item-box">
              {
                list.map((item, index) => (
                  <AnalystCard key={item.id} item={item} index={index} />
                ))
              }
            </div>
          ) : (
            <div styleName="empty-box">
              <Empty type="strategy" />
            </div>
          )
        }
      </div>
    </div>
  );
});

export default AnalystRecommendDetail;
