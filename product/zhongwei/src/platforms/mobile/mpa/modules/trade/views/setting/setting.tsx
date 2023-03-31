import { Switch, Toast } from 'antd-mobile';
import { PageType, openNewPage, updateUserTradeConfigInfo } from '@/platforms/mobile/helpers/native/msg';
import { useDeepCompareEffect, useSetState } from 'ahooks';
import { updateSetting } from '@/api/module-api/setting';
import { FormattedMessage } from 'react-intl';
import { useTradeStore } from '@/platforms/mobile/model/trade-store';
import { useContext, useState } from 'react';
import { omit } from 'lodash-es';
import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import iconRightArrow from '@mobile/images/icon_zh_more.svg';
import './setting.scss';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { BiometricsType } from '@/platforms/mobile/hooks/use-init-native';

export const pwdDurationOptions = [
  {
    name: (
      <>
        30
        <FormattedMessage id="minute" />
      </>
    ),
    value: '30m',
  },
  {
    name: (
      <>
        60
        <FormattedMessage id="minute" />
      </>
    ),
    value: '60m',
  },
  {
    name: (
      <>
        12
        <FormattedMessage id="hour" />
      </>
    ),
    value: '720m',
  },
  {
    name: (
      <>
        24
        <FormattedMessage id="hour" />
      </>
    ),
    value: '1440m',
  },
];

const Setting: React.FC = () => {
  const { userTradeConfigInfo } = useTradeStore();
  const { biometricsType } = useContext(userConfigContext);

  const [config, setConfig] = useSetState(userTradeConfigInfo);
  const [oldConfig, setOldConfig] = useState({});

  /* 监听app更新 */
  useDeepCompareEffect(() => {
    console.log('app更新交易设置');
    setConfig(userTradeConfigInfo);
  }, [userTradeConfigInfo]);

  /* 更新失败，回到更新前 */
  const beforeUpdate = () => {
    setConfig(oldConfig);
    Toast.show({ content: 'update_fail' });
  };

  const updateConfig = (key: string, value: any) => {
    /* 保存更新前的设置 */
    setOldConfig(config);
    setConfig({ [key]: value } as any);
    const newConfig = { ...config, [key]: value };
    /* faceId不走服务器存储 */
    if (key === 'faceId') {
      setConfig({ [key]: value } as any);
      updateUserTradeConfigInfo(newConfig);
    } else {
      updateSetting({
        code: 'TRADE',
        content: omit(newConfig, ['faceId']),
      })
        .then((res) => {
          const { code } = res;
          if (code === 0) {
            /* 请求成功之后通知app更新 */
            updateUserTradeConfigInfo(newConfig);
          } else {
            beforeUpdate();
          }
        })
        .catch(() => {
          beforeUpdate();
        });
    }
  };

  return (
    <div styleName="container">
      <BasicCard styleName="basic-card">
        <FormattedMessage id="trade_order_toast_confirm" />
        <Switch
          checked={config.orderToConfirmByDialog}
          onChange={(v) => {
            updateConfig('orderToConfirmByDialog', v);
          }}
        />
      </BasicCard>
      <div className="f-s-22 color-desc p-x-20 p-y-15">
        <FormattedMessage id="trade_order_toast_confirm_hint" />
      </div>
      <BasicCard styleName="basic-card">
        <FormattedMessage id="order_pwd_confirm" />
        <Switch
          checked={config.orderToConfirmByPwd}
          onChange={(v) => {
            updateConfig('orderToConfirmByPwd', v);
          }}
        />
      </BasicCard>
      <BasicCard styleName="basic-card">
        <FormattedMessage id="trade_pwd_duration" />
        <span
          className="color-assist flex-c-c"
          onClick={() => {
            openNewPage({
              pageType: PageType.HTML,
              path: `trade.html#/duration-select?duration=${config.idleAutoLockDuration}`,
            });
          }}
        >
          {pwdDurationOptions.find((v) => v.value === config.idleAutoLockDuration)?.name}
          <img style={{ height: '0.8em', width: '1.5em' }} src={iconRightArrow} alt="" />
        </span>
      </BasicCard>
      {biometricsType && biometricsType !== BiometricsType.None && (
        <>
          <BasicCard styleName="basic-card">
            <FormattedMessage id={biometricsType === BiometricsType.FaceID ? 'face_id' : 'finger_print_id'} />
            <div
              onClick={() => {
                openNewPage({
                  pageType: PageType.NATIVE,
                  path: 'set_biometric',
                });
              }}
            >
              <Switch checked={config.faceId} />
            </div>
          </BasicCard>
          <div className="f-s-22 color-desc p-x-20 p-y-15">
            <FormattedMessage id={biometricsType === BiometricsType.FaceID ? 'face_id_hint' : 'finger_print_id_hint'} />
            <span className="t-link">
              《
              <FormattedMessage id="face_id_protocol" />
              》
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default Setting;
