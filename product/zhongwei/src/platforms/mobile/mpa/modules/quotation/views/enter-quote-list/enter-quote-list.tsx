import { useEffect, useState } from 'react';
import { postPurchasedQuoteList } from '@/api/module-api/quotation';
import NoMessage from '@/platforms/mobile/components/no-message/no-message';
import BasicCard from '@mobile/components/basic-card/basic-card';

import './enter-quote-list.scss';
import { FormattedMessage } from 'react-intl';
import Loading from '@/platforms/mobile/components/loading/loading';

const ItemCard = (props) => {
  const { data } = props;

  const isHK = data.currency === 'HKD';

  return (
    <BasicCard styleName={isHK ? 'hk-card' : 'us-card'}>
      <div>
        <div styleName="name">{data.name}</div>
        <div>
          <FormattedMessage id="expiration_time" />
          ：
          {data.expireDate}
        </div>
      </div>
      <div styleName="description">{data.description}</div>
    </BasicCard>
  );
};

const EnterQuoteList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchPurchasedQuote = () => {
    setLoading(true);
    postPurchasedQuoteList().then((res) => {
      if (res.code === 0) {
        setList(res.result);
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPurchasedQuote();
  }, []);

  return (
    <Loading isLoading={loading}>
      <div styleName="page">
        {
        list.length ? list.map((l) => <ItemCard data={l} />) : <NoMessage />
      }
      </div>
    </Loading>
  );
};

export default EnterQuoteList;
