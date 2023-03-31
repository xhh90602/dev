import './quote-order-finish.scss';
import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import IconSuccess from '@/platforms/mobile/images/icon_success.svg';
import { pageClose } from '@/platforms/mobile/helpers/native/msg';
import { FormattedMessage } from 'react-intl';

const QuoteOrderFinish = () => (
  <div styleName="page">
    <BasicCard styleName="finish-box">
      <img src={IconSuccess} alt="" />
      <div styleName="title">
        <FormattedMessage id="order_success" />
      </div>
      <div styleName="desc">
        <FormattedMessage id="order_success_desc" />
      </div>
      <div
        styleName="button"
        onClick={() => {
          pageClose({
            closeAllHTML: true,
          });
        }}
      >
        <FormattedMessage id="finish" />
      </div>
    </BasicCard>
  </div>
);

export default QuoteOrderFinish;
