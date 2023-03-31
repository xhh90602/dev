import { VALIDITY_DATA } from '@/constants/trade';
import DateModal from '@/platforms/mobile/components/date-modal/date-modal';
import IconSvg from '@/platforms/mobile/components/icon-svg';
import { Input } from 'antd-mobile';
import dayjs from 'dayjs';
import { memo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import '../trade-form.scss';

const TermOfValidity = (props) => {
  const { executeDate, setExecuteDate, executeDateType, setExecuteDateType } = props;
  const [dateVisible, setDateVisible] = useState(false);
  const { formatMessage } = useIntl();
  return (
    <div>
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
        <div
          styleName={executeDateType === VALIDITY_DATA.A ? 'active' : ''}
          onClick={() => setExecuteDateType(VALIDITY_DATA.A)}
        >
          <FormattedMessage id="assign_date" />
        </div>
      </div>
      <DateModal
        visible={dateVisible}
        value={executeDate}
        onOk={(v) => {
          setExecuteDate(v);
          setDateVisible(false);
        }}
        onCancel={() => { setDateVisible(false); }}
      />
      {
        executeDateType === VALIDITY_DATA.A && (
          <div
            className="t-r"
            styleName="diy-date"
            onClick={() => {
              setDateVisible(!dateVisible);
            }}
          >
            <Input
              value={dayjs(executeDate).format('YYYY-MM-DD')}
              placeholder={formatMessage({ id: 'please_select_the_date' })}
              readOnly
            />
            <IconSvg path="icon_arrow_right" />
          </div>
        )
      }
    </div>
  );
};

export default memo(TermOfValidity);
