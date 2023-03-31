import React, { useState, useEffect } from 'react';
import './activity-rules.scss';
import { getUrlParam } from '@/utils';
import { useIntl } from 'react-intl';
import { getActivityDetail } from '@/api/module-api/activity';
import dayjs from 'dayjs';
import Loading from '@mobile/components/loading/loading';

const ActivityRules: React.FC = () => {
  const { formatMessage } = useIntl();
  const searchParams = getUrlParam();
  const [activityTime, setActivityTime] = useState('--');
  const [intro, setIntro] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [object, setObject] = useState('--');
  const [list, setList] = useState<any>();

  useEffect(() => {
    if (!searchParams) return;
    getActivityDetail({ activityId: Number(searchParams.id) }).then((res) => {
      if (res.code === 0) {
        console.log(res.result);

        const activityTimeStr = res.result.activityTime.split('-')
          .map((item) => (dayjs(item).format('YYYY/MM/DD')))
          .join('-');
        setActivityTime(activityTimeStr);
        setIntro(res.result.ruleDescription);
        setObject(res.result.applicablePeople);
        const awardIntroList = [
          {
            id: 0,
            name: formatMessage({ id: 'wei_coin' }), // '薇币'
            intro: res.result.weicoinReward || '--',
          },
          {
            id: 1,
            name: formatMessage({ id: 'free_commission_card' }), // '免佣卡'
            intro: res.result.couponReward || '--',
          },
          {
            id: 2,
            name: '行情卡',
            intro: res.result.marketReward || '--',
          },
          {
            id: 3,
            name: formatMessage({ id: 'special_version' }), // '特别说明'
            intro: res.result.rewardDescription || '--',
          },
        ];
        setList(awardIntroList);
      }
    }).catch((err) => {
      console.log('err---->', err);
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <Loading isLoading={isLoading}>
      <div styleName="page">
        <div styleName="page-item">
          <div styleName="title">
            1.
            {formatMessage({ id: 'activity_time' })}
            ：
          </div>
          <div styleName="intro">{activityTime}</div>
        </div>
        <div styleName="page-item">
          <div styleName="title">2.活动对象：</div>
          <div styleName="intro">{object}</div>
        </div>
        <div styleName="page-item">
          <div styleName="title">
            3.
            {formatMessage({ id: 'active_object' })}
            ：
          </div>
          <div styleName="intro">{intro}</div>
        </div>
        <div styleName="page-item">
          <div styleName="title">
            4.
            {formatMessage({ id: 'awards_show' })}
            ：
          </div>
          <div styleName="intro">
            {
            list ? list.map((item) => (
              <div styleName="award" key={item.id}>
                {`${item.name}：${item.intro}`}
              </div>
            )) : null
          }
          </div>
        </div>
      </div>
    </Loading>

  );
};

export default ActivityRules;
