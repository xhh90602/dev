import './account-upgrade.scss';
import arrowDown from '@mobile/images/icon_arrow_down.svg';
import IconFinalEasy from '@mobile/images/account-upgrade/icon_final_easy.svg';
import IconIpoLevel from '@mobile/images/account-upgrade/icon_IPO_lever.svg';
import IconRateDiscounts from '@mobile/images/account-upgrade/icon_rate_discounts.svg';
import IconTradeLever from '@mobile/images/account-upgrade/icon_trade_lever.svg';
import checkedIcon from '@mobile/images/icon_circle_checked.svg';
import uncheckedIcon from '@mobile/images/icon_circle_unchecked.svg';
import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import { useIntl, FormattedMessage } from 'react-intl';
import { useEffect, useMemo, useState } from 'react';
import { getTradeUserInfo } from '@/platforms/mobile/helpers/native/msg';
import { useResetState, useSetState, useUpdateEffect } from 'ahooks';
import { getUserInfo } from '@/api/module-api/combination-position';
import { Picker } from 'antd-mobile';
import { cloneDeep } from 'lodash-es';
import { getObjArrAttribute } from '@/utils';

const finalFeatList = [
  {
    key: 'tradeLever',
    name: <FormattedMessage id="trade_leverage" />,
    icon: IconTradeLever,
  },
  {
    key: 'ipoLever',
    name: <FormattedMessage id="ipo_leverage" />,
    icon: IconIpoLevel,
  },
  {
    key: 'rateDiscounts',
    name: <FormattedMessage id="interest_rate_concession" />,
    icon: IconRateDiscounts,
  },
  {
    key: 'finalEasy',
    name: <FormattedMessage id="convenient_financing" />,
    icon: IconFinalEasy,
  },
];

interface Iprops {
  openList: any[];
  openKey: string;
  setStep: (step: number) => void;
}

const AccountOpen: React.FC<Iprops> = ({ openList, setStep, openKey }) => {
  const { formatMessage } = useIntl();

  /** 衍生品认识弹窗 */
  const [derivativeVisible, setDerivativeVisible] = useState(false);
  /** 衍生品认识/不认识 */
  const [derivativeValue, setDerivativeValue] = useState('yes');
  /** 衍生品认识列表 */
  const derivativePickerColumns = [
    [
      { label: formatMessage({ id: 'Have_a_sense_of' }), value: 'yes' },
      { label: formatMessage({ id: 'be_ignorant_of' }), value: 'no' },
    ],
  ];
  /** 衍生品题目列表 */
  const [derivativeTopic, setDerivativeTopic, resetDerivativeTopic] = useResetState([
    {
      checked: false,
      text: formatMessage({ id: 'derivatives_products_check_1' }),
    },
    {
      checked: false,
      text: formatMessage({ id: 'derivatives_products_check_2' }),
    },
    {
      checked: false,
      text: formatMessage({ id: 'derivatives_products_check_3' }),
    },
  ]);
  /** 是否确认衍生品声明 */
  const [derivativeChecked, setDerivativeChecked] = useState(false);
  /** 开通按钮禁用态 */
  const openBtnDisable = useMemo(() => {
    if (openKey === 'derivative') {
      const topicChecked = derivativeValue === 'yes' ? derivativeTopic.some((item) => item.checked) : true;
      return !(topicChecked && derivativeChecked);
    }
    return false;
  }, [openKey, derivativeValue, derivativeTopic, derivativeChecked]);

  /* 账户信息 */
  const [accountInfo, setAccountInfo] = useSetState({
    isFinan: false,
    account: 'DZ114',
    name: '',
    nameEn: '',
    derivatives: false,
  });

  const fetchUserInfo = async () => {
    try {
      const tradeUserInfo = await getTradeUserInfo();
      const { result: userInfoRes = {} } = await getUserInfo({ clientId: tradeUserInfo?.account });

      setAccountInfo({
        account: tradeUserInfo?.account || '',
        name: userInfoRes?.name || '',
        nameEn: userInfoRes?.nameEn || '',
        derivatives: userInfoRes?.derivatives || false,
      });
    } catch (err) {
      console.log('获取用户信息失败', err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useUpdateEffect(() => {
    setDerivativeVisible(false);
    setDerivativeValue('yes');
    resetDerivativeTopic();
    setDerivativeChecked(false);
    fetchUserInfo();
  }, [openKey]);

  return (
    <>
      <img styleName="open-bg-tag" src={getObjArrAttribute(openList, 'key', openKey, 'icon', '')} alt="" />
      <div styleName="open-view">
        <div className="f-s-48 f-bold p-l-20 m-b-50">{getObjArrAttribute(openList, 'key', openKey, 'label', '')}</div>
        {openKey !== 'derivative' && (
          /* 账户信息 */
          <BasicCard styleName="basic-card">
            <div className="p-x-15 p-y-30 flex-c-between">
              <span className="color-desc">
                <FormattedMessage id="name" />
              </span>
              <span className="f-s-30">
                {accountInfo.name}
                /
                {accountInfo.nameEn}
              </span>
            </div>
            <div className="p-x-15 p-y-30 flex-c-between">
              <span className="color-desc">
                <FormattedMessage id="account_number" />
              </span>
              <span className="f-s-30 f-bold">{accountInfo.account}</span>
            </div>
            <div className="p-x-15 p-y-30 flex-c-between">
              <span className="color-desc">
                <FormattedMessage id="account_type" />
              </span>
              <span className="f-s-30">
                <FormattedMessage id="cash_account" />
              </span>
            </div>
          </BasicCard>
        )}

        {openKey === 'final' && (
          <>
            {/* 融资功能 */}
            <BasicCard styleName="final-feat">
              {finalFeatList.map((item) => (
                <div key={item.key}>
                  <img styleName="final-feat-img" src={item.icon} alt="" />
                  <br />
                  <span className="f-s-24 color-desc">{item.name}</span>
                </div>
              ))}
            </BasicCard>

            {/* 开通融资账户提示 */}
            <div styleName="footer-hint">
              <FormattedMessage id="warm_prompt" />

              <br />
              <FormattedMessage id="finan_account_hint" />
            </div>
          </>
        )}

        {/* 开通沪深股通提示 */}
        {openKey === 'shszhk' && (
          <div styleName="footer-hint">
            <FormattedMessage id="warm_prompt" />
            <br />
            <FormattedMessage id="sh_sz_hk_hint" />
          </div>
        )}

        {/* 开通衍生品交易 */}
        {openKey === 'derivative' && (
          <BasicCard styleName="basic-card" className="p-x-24 color-assist">
            <div className="f-s-26 p-t-15">
              <FormattedMessage id="knowledge_of_derivatives" />
            </div>
            <div
              styleName="derivative-select"
              onClick={() => {
                setDerivativeVisible(true);
              }}
            >
              {getObjArrAttribute(derivativePickerColumns[0], 'value', derivativeValue, 'label', '')}
              <img styleName="arrow" src={arrowDown} alt="" />
            </div>

            {/* 题目列表 */}
            {derivativeValue === 'yes'
              && derivativeTopic.map((topic, i) => (
                <div className="flex-l-t m-b-40 p-x-15">
                  <img
                    styleName="check-icon"
                    src={topic.checked ? checkedIcon : uncheckedIcon}
                    alt=""
                    onClick={() => {
                      const temp = cloneDeep(derivativeTopic);
                      temp[i].checked = !temp[i].checked;
                      setDerivativeTopic(temp);
                    }}
                  />
                  <span className="t-justify">{topic.text}</span>
                </div>
              ))}

            {/* 衍生品声明 */}
            <div className="flex-l-t p-y-40 p-x-15 border-top-1-desc">
              <img
                styleName="check-icon"
                src={derivativeChecked ? checkedIcon : uncheckedIcon}
                alt=""
                onClick={() => {
                  setDerivativeChecked(!derivativeChecked);
                }}
              />
              <span className="t-justify color-desc f-s-24">
                <FormattedMessage id="derivatives_confirm_text" />
              </span>
            </div>

            {/* 衍生品认识选择器 */}
            <Picker
              columns={derivativePickerColumns}
              visible={derivativeVisible}
              onClose={() => {
                setDerivativeVisible(false);
              }}
              value={[derivativeValue]}
              onConfirm={(v) => {
                console.log(v);
                if (v && v[0]) setDerivativeValue(v[0]);
              }}
            />
          </BasicCard>
        )}
      </div>

      {/* 开通按钮 */}
      <div
        styleName="footer-btn"
        data-disable={openBtnDisable}
        onClick={() => {
          if (!openBtnDisable) setStep(3);
        }}
      >
        <FormattedMessage id="open_immediately" />
      </div>
    </>
  );
};

export default AccountOpen;
