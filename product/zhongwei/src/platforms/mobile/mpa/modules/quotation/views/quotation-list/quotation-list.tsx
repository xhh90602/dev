import { postQuoteHistoryList } from '@/api/module-api/quotation';
import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import NoMessage from '@/platforms/mobile/components/no-message/no-message';
import { useEffect, useState } from 'react';

import './quotation-list.scss';
import { FormattedMessage } from 'react-intl';
import Loading from '@/platforms/mobile/components/loading/loading';

const QuotationItem = (props) => {
  const { item } = props;

  const list = [
    {
      label: 'duration_of_order',
      content: item.period,
    },
    {
      label: 'expected_effective_time',
      content: item.enableStartDate,
    },
    {
      label: 'expiration_time',
      content: item.enableEndDate,
      color: true,
    },
    {
      label: 'order_time',
      content: item.createTime,
    },
    {
      label: 'current_state',
      content: item.status,
    },
  ];

  return (
    <BasicCard styleName="item">
      <div styleName="title">
        <img src={item.packageImage} alt="" />
        <span>{item.name}</span>
      </div>
      {
        list.map((d) => (
          <div styleName="item-item" key={d.label}>
            <div styleName="label">
              <FormattedMessage id={d.label} />
            </div>
            <div className={d.color ? 'orange-color' : ''}>{d.content}</div>
          </div>
        ))
      }
    </BasicCard>
  );
};

const QuotationList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    postQuoteHistoryList().then((res) => {
      console.log(res);
      if (res && res.code === 0) {
        setList(res.result);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <Loading isLoading={loading}>
      <div styleName="list-box">
        {
        list.length ? list.map((item) => <QuotationItem item={item} />) : <NoMessage />
      }
      </div>
    </Loading>
  );
};

export default QuotationList;
