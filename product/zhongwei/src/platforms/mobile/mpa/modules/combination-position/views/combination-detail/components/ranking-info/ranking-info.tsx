import { useEffect } from 'react';
import { useLockFn, useSetState } from 'ahooks';
import { useIntl } from 'react-intl';
import { Checkbox, Toast } from 'antd-mobile';
import { toPercent, toPlaceholder, toUnit, UNIT_LAN } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { setPositiveSign } from '@/utils';
import { openNativePage, PageType, NativePages } from '@mobile/helpers/native/msg';
import { nativeOpenPage } from '@mobile/helpers/native/url';
import { subApply, subSeekApply } from '@/api/module-api/combination-position';

import useCombinationRanking from '@/hooks/combination-position/use-combination-ranking';
import BasicModal from '@mobile/components/basic-modal/basic-modal';
import Subscription from '@mobile/components/combination/subscription';
import IconSvg from '@mobile/components/icon-svg';

import './ranking-info.scss';

interface IProps {
  info: Record<string, any>;
  refreshHanlde: (...args: any[]) => any;
}

const RankingInfo: React.FC<IProps> = (props) => {
  const { info, refreshHanlde } = props;

  const { formatMessage } = useIntl();
  const { isLoading, rankingList, handleRanking, fetchCombinationRanking } = useCombinationRanking();

  const [{ visible, agreeProtocol }, setRankModal] = useSetState<Record<string, boolean>>({
    visible: false,
    agreeProtocol: false,
  });
  const [subscriptionInfo, setSubscriptionInfo] = useSetState<Record<string, any>>({
    showModal: false,
    name: '',
    subInfo: {},
    userId: '',
    subType: '',
    portfolioType: '',
  });

  useEffect(() => {
    if (info?.profitRanking === '0') {
      fetchCombinationRanking(info.portfolioId);
    }
  }, []);

  const confirmHandle = () => {
    if (agreeProtocol) {
      handleRanking(() => {
        setRankModal({ visible: false });
        Toast.show({ content: formatMessage({ id: 'success_in_ranking' }) });
      });
      return;
    }

    Toast.show({ content: formatMessage({ id: 'please_check_protocol' }) });
  };

  // 订阅确认
  const subConfirmClick = useLockFn(async (obj: Record<string, any>) => {
    const { userSub } = info;

    // 开启了订阅，申请订阅
    if (userSub === '0') {
      return subApply({ ...obj }).then((res: any) => {
        if (res?.code !== 0) return;

        setSubscriptionInfo({
          subType: '10',
          subInfo: res?.result || {},
        });

        refreshHanlde();
        Toast.show({ content: formatMessage({ id: 'subscription_success' }) });
      });
    }

    // 没有开启订阅，申请开启订阅
    return subSeekApply({ ...obj }).then((res: any) => {
      if (res?.code !== 0) return;

      setSubscriptionInfo({
        subType: '1',
        subInfo: res?.result || {},
      });

      refreshHanlde();
      Toast.show({ content: formatMessage({ id: 'subscription_request_success' }) });
    });
  });

  const subscriptionInfoNode = () => {
    if (['-1', '0'].includes(info.userSub)) {
      return (
        <p
          styleName="subscription-btn"
          onClick={() => {
            setSubscriptionInfo({
              showModal: true,
              subType: '-1',
            });
          }}
        >
          {formatMessage({ id: 'subscription' })}
        </p>
      );
    }

    if (info.userSub === '1') {
      return <p styleName="subscription-btn-now">{formatMessage({ id: 'subscription' })}</p>;
    }

    return (
      <>
        <p styleName="subscription-info-num">{toUnit(info.subNum || 0, { lanType: UNIT_LAN.ZH_TW })}</p>
        <p styleName="subscription-info-label">{formatMessage({ id: 'subscription_number' })}</p>
      </>
    );
  };

  return (
    <>
      <div styleName="subscription-info-box">
        <div styleName="combination-info">
          <div styleName="combination-info-name-box">
            <p styleName="combination-info-name">{info.name}</p>

            {info?.profitRanking === '1' && (
              <div styleName="ranking-box" onClick={() => setRankModal({ visible: true })}>
                <span>{formatMessage({ id: 'participate_in_ranking' })}</span>
                <IconSvg path="icon_ranking_arrow" />
              </div>
            )}
          </div>
          <p styleName="combination-info-describe">{info.sketch}</p>
        </div>

        <div styleName="subscription-info">{subscriptionInfoNode()}</div>
      </div>

      {!isLoading && (
        <div
          styleName="ranking-info-box"
          onClick={() => {
            // 跳转至组合盈亏榜单
            openNativePage({
              pageType: PageType.NATIVE,
              path: NativePages.bangdan,
              data: { portfolioId: info.portfolioId },
              fullScreen: true,
            });
          }}
        >
          {rankingList.map(({ key, value }) => (
            <div styleName="ranking-item" key={key}>
              <p styleName="ranking-item-num">{toPlaceholder(value.sort)}</p>
              <p styleName="ranking-item-label">{formatMessage({ id: key })}</p>
              <p styleName="profit-num" className={`${getClassNameByPriceChange(value.profitRatio)}`}>
                {setPositiveSign(toPercent(value.profitRatio, { multiply: 100 }))}
              </p>
            </div>
          ))}
        </div>
      )}

      <Subscription
        dialogType={subscriptionInfo.subType}
        show={subscriptionInfo.showModal}
        info={subscriptionInfo.subInfo}
        portfolioId={info.portfolioId}
        userId={info.userId}
        subId={info.subId}
        name={info.name}
        type={info.type}
        closeClick={() => setSubscriptionInfo({ showModal: false })}
        confirmClick={(obj: Record<string, any>) => subConfirmClick(obj)}
      />

      <BasicModal
        visible={visible}
        title={formatMessage({ id: 'participation_ranking_tips' })}
        cancelText={formatMessage({ id: 'cancel' })}
        confirmText={formatMessage({ id: 'determine' })}
        onCancel={() => setRankModal({ visible: false, agreeProtocol: false })}
        onConfirm={confirmHandle}
      >
        <div styleName="ranking-modal-content">
          <p styleName="ranking-desc">{formatMessage({ id: 'participation_ranking_desc' })}</p>

          <Checkbox checked={agreeProtocol} onChange={(val: boolean) => setRankModal({ agreeProtocol: val })}>
            <span>{formatMessage({ id: 'agree_to_subscription_and_comply' })}</span>
            <span
              styleName="leaderboard-rules"
              onClick={(e) => {
                e.preventDefault();
                nativeOpenPage('protocol.html?type=2');
              }}
            >
              {formatMessage({ id: 'leaderboard_service_rules' })}
            </span>
          </Checkbox>
        </div>
      </BasicModal>
    </>
  );
};

export default React.memo(RankingInfo);
