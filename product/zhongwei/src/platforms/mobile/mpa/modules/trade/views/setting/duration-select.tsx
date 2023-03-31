import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import iconOrangeSelect from '@mobile/images/icon_orange_select.svg';
import { useUpdateEffect } from 'ahooks';
import { updateUserTradeConfigInfo } from '@/platforms/mobile/helpers/native/msg';
import { updateSetting } from '@/api/module-api/setting';
import { useTradeStore } from '@/platforms/mobile/model/trade-store';
import { FormattedMessage } from 'react-intl';
import { getUrlParam } from '@/utils';
import { useState } from 'react';
import { Toast } from 'antd-mobile';
import { omit } from 'lodash-es';
import { pwdDurationOptions } from './setting';
import './setting.scss';

const DurationSelect: React.FC = () => {
  const { userTradeConfigInfo } = useTradeStore();

  const [duration, setDuration] = useState(getUrlParam().duration || '720m');
  const [oldDuration, setOldDuration] = useState('');

  const beforeUpdate = () => {
    setDuration(oldDuration);
    Toast.show({ content: 'update_fail' });
  };

  useUpdateEffect(() => {
    const config = { ...userTradeConfigInfo, idleAutoLockDuration: duration };
    updateSetting({
      code: 'TRADE',
      content: omit(config, ['faceId']),
    })
      .then((res) => {
        if (res.code === 0) {
          updateUserTradeConfigInfo(config);
        } else {
          beforeUpdate();
        }
      })
      .catch(() => {
        beforeUpdate();
      });
  }, [duration]);

  return (
    <div styleName="container">
      {pwdDurationOptions.map((item) => (
        <BasicCard
          key={item.value}
          styleName="basic-card"
          onClick={() => {
            setOldDuration(duration);
            setDuration(item.value);
          }}
        >
          <span>
            {item.name}
            {item.value === '720m' && (
              <>
                (
                <FormattedMessage id="default" />
                )
              </>
            )}
          </span>
          {item.value === duration && <img style={{ width: '1em' }} src={iconOrangeSelect} alt="" />}
        </BasicCard>
      ))}
    </div>
  );
};

export default DurationSelect;
