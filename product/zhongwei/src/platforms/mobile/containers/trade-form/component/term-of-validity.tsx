import { VALIDITY_DATA } from '@/constants/trade';
import { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import '../trade-form.scss';

const TermOfValidity = (props) => {
  const { executeDateType = VALIDITY_DATA.N, setExecuteDateType } = props;

  return (
    <div styleName="tab-polygon">
      <div
        styleName={executeDateType === VALIDITY_DATA.N ? 'active' : ''}
        onClick={() => setExecuteDateType(VALIDITY_DATA.N)}
      >
        <FormattedMessage id="on_that_day" />
      </div>
      <div
        styleName={executeDateType === VALIDITY_DATA.E ? 'active' : ''}
        onClick={() => setExecuteDateType(VALIDITY_DATA.E)}
      >
        <FormattedMessage id="before_revoke" />
      </div>
    </div>
  );
};

export default memo(TermOfValidity);
