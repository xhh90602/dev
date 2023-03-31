import IconSvg from '@/platforms/mobile/components/icon-svg';
import { useEffect, useMemo, useState } from 'react';
import rightArrowIcon from '@mobile/images/icon_arrow_down.svg';
import './broker-info.scss';
import { Input, Popup } from 'antd-mobile';
import { FormattedMessage, useIntl } from 'react-intl';
import { Data } from '@/hooks/stock-roll/use-stock-roll';
import { getTradeAccountInfo } from '@/api/module-api/trade';
import { TRADE_ACCOUNT_TYPE } from '@/constants/trade';
import SelectBorker from '../../view/select-borker/select-borker';

const BroketInfo = (props: { type: 'in' | 'out'; nextStep: () => void; data: Data; setData: (date: any) => void }) => {
  const { type, nextStep, data, setData } = props;
  const { formatMessage } = useIntl();
  const isIn = type === 'in';
  const prefix = isIn ? 'out' : 'in';
  const inName = formatMessage({ id: isIn ? 'accept' : 'roll_out' });
  const outName = formatMessage({ id: isIn ? 'roll_out' : 'accept' });
  const info = useMemo(() => data, [data]);
  const [visable, setVisable] = useState(false);
  const [otherBorker, setOtherBorker] = useState(false);
  const selectBorker = (item) => {
    setOtherBorker(item.letter === 'other');
    setData({
      [`${prefix}Broker`]: item.letter === 'other' ? '' : item.name,
      [`${prefix}Ccass`]: item.letter === 'other' ? '' : item.ccass,
    });
  };

  const [isFinan, setIsFinan] = useState(false);

  const fetchAccount = async () => {
    const { code, result } = await getTradeAccountInfo();
    if (code === 0) {
      setIsFinan(result.accountType === TRADE_ACCOUNT_TYPE.FINANCING);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const disableNext = useMemo(
    () => [
      info[`${prefix}Broker`],
      info[`${prefix}AccountName`],
      info[`${prefix}Account`], info[`${prefix}Ccass`],
    ].some(
      (item) => !item,
    ),
    [info],
  );

  return (
    <div styleName="container">
      <div styleName="account basic-card">
        <span>
          {inName}
          <FormattedMessage id="account" />
        </span>
        <div className="flex-l-c">
          <span styleName="icon">
            <IconSvg path="icon_account_logo" />
          </span>
          <span>
            <FormattedMessage id={isFinan ? 'zhongwei_finan_account' : 'zhongwei_cash_account'} />
          </span>
          <span className="num-font">
            (
            {data.clientAccount?.split('').reverse().slice(0, 4).reverse()
              .join('')}
            )
          </span>
        </div>
      </div>
      <div styleName="title">
        <FormattedMessage id="fill_in" />
        {outName}
        <FormattedMessage id="borker" />
        <FormattedMessage id="info" />
      </div>
      <div styleName="basic-card">
        <div styleName="info-item">
          <div styleName="label">
            {outName}
            <FormattedMessage id="borker" />
          </div>
          <div
            styleName="select-broker"
            data-desc={info[`${prefix}Broker`] === '' && !otherBorker}
            onClick={() => setVisable(true)}
          >
            {otherBorker ? '其他' : info[`${prefix}Broker`] || <FormattedMessage id="please_select" />}
            <img src={rightArrowIcon} alt="" />
          </div>
        </div>
        {otherBorker && (
          <div styleName="info-item">
            <div styleName="label">
              <FormattedMessage id="borker" />
              <FormattedMessage id="designation" />
            </div>
            <Input
              value={isIn ? info.outBroker : info.inBroker}
              placeholder={
                formatMessage({ id: 'please_enter' })
                + outName
                + formatMessage({ id: 'borker' })
                + formatMessage({ id: 'designation' })
              }
              onChange={(v) => setData({ [`${prefix}Broker`]: v })}
            />
          </div>
        )}
        <div styleName="info-item">
          <div styleName="label">
            <FormattedMessage id="borker" />
            CCASS
          </div>
          <Input
            value={isIn ? info.outCcass : info.inCcass}
            placeholder={`${formatMessage({ id: 'please_enter' }) + outName + formatMessage({ id: 'borker' })}CCASS`}
            onChange={(v) => setData({ [`${prefix}Ccass`]: v })}
          />
        </div>
        <div styleName="info-item">
          <div styleName="label">
            <FormattedMessage id="account" />
            <FormattedMessage id="number" />
          </div>
          <Input
            type="text"
            value={isIn ? info.outAccount : info.inAccount}
            placeholder={
              formatMessage({ id: 'please_enter' })
              + outName
              + formatMessage({ id: 'borker' })
              + formatMessage({ id: 'account' })
              + formatMessage({ id: 'number' })
            }
            onChange={(v) => setData({ [`${prefix}Account`]: v })}
          />
        </div>
        <div styleName="info-item">
          <div styleName="label">
            <FormattedMessage id="account" />
            <FormattedMessage id="name" />
          </div>
          <Input
            value={isIn ? info.outAccountName : info.inAccountName}
            placeholder={
              formatMessage({ id: 'please_enter' })
              + outName
              + formatMessage({ id: 'borker' })
              + formatMessage({ id: 'account' })
              + formatMessage({ id: 'name' })
            }
            onChange={(v) => setData({ [`${prefix}AccountName`]: v })}
          />
          <div styleName="desc">
            <FormattedMessage id="account_name_desc" />
          </div>
        </div>
      </div>
      <div styleName="next-btn" data-disable={disableNext} onClick={() => !disableNext && nextStep()}>
        <FormattedMessage id="next_step" />
      </div>

      <Popup visible={visable} position="right">
        <SelectBorker onSelect={selectBorker} close={() => setVisable(false)} />
      </Popup>
    </div>
  );
};

export default BroketInfo;
