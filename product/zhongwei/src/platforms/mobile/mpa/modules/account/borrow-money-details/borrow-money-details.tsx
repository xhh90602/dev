import { useEffect, useState } from 'react';
import Tabs from '@mobile/components/tabs/tabs';
import { FormattedMessage } from 'react-intl';
import './borrow-money-details.scss';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { getObjArrAttribute, sliceString } from '@/utils';
import NoMessage from '@/platforms/mobile/components/no-message/no-message';
import Loading from '@/platforms/mobile/components/loading/loading';

const BorrowMoneyDetails: React.FC = () => {
  const tabList = [
    {
      title: <FormattedMessage id="borrow" />,
      key: 'borrow',
      children: null,
    },
    {
      title: <FormattedMessage id="refund" />,
      key: 'refund',
      children: null,
    },
  ];

  const [active, setActive] = useState('borrow');
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<{ date: string; price: number }[]>([]);
  const fetchList = async () => {
    setLoading(true);
    await sleep(1000);
    setList([{ date: '2022/01/03 09:34:09', price: 34909 }]);
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, [active]);

  return (
    <div styleName="container">
      <Tabs
        className="bg-bold radius-nomal m-x-32"
        activeKey={active}
        list={tabList}
        onChange={(v) => {
          setActive(v);
        }}
      />
      <div styleName="content">
        <Loading isLoading={loading}>
          {list.length > 0 && (
          <div className="flex-c-between f-s-24">
            <span className="color-assist">
              {getObjArrAttribute(tabList, 'key', active, 'title')}
              <FormattedMessage id="time" />
            </span>
            <span className="color-assist">
              {getObjArrAttribute(tabList, 'key', active, 'title')}
              <FormattedMessage id="amount" />
            </span>
          </div>
          )}
          {list.map((item) => (
            <div styleName="split-line" className="flex-c-between p-y-35 f-s-28 num-font" key={item.date}>
              <span>{item.date}</span>
              <span>
                {sliceString(item.price)}
                HKD
              </span>
            </div>
          ))}
          {list.length < 1 && <NoMessage />}
        </Loading>
      </div>
    </div>
  );
};

export default BorrowMoneyDetails;
