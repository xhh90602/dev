import { useState } from 'react';
import { useIntl } from 'react-intl';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { toThousand, toPercent } from '@dz-web/o-orange';
import { setPositiveSign } from '@/utils';
import { COMBINATION_POSITION_ROUTERS } from '@mobile-mpa/modules/combination-position/routers';
import { openNewPage, PageType, sharePage, CShareType, shareSourceType } from '@mobile/helpers/native/msg';

import dayjs from 'dayjs';
import classNames from 'classnames';
import IconSvg from '@mobile/components/icon-svg';
import BasicModal from '@/platforms/mobile/components/basic-modal/basic-modal';
import CombinationListItemTabs from '../combination-list-item-tabs/combination-list-item-tabs';
import './combination-list-item.scss';

interface IProps {
  data: Record<string, any>;
}

const CombinationListItem: React.FC<IProps> = (props) => {
  const { data } = props;

  const { formatMessage } = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [totalModalVisible, setTotalModalVisible] = useState<boolean>(false);
  const [todayModalVisible, settodayModalVisible] = useState<boolean>(false);

  const handleJump = (route: string) => openNewPage({
    pageType: PageType.HTML,
    path: `combination-position.html#${route}?portfolioId=${data?.portfolioId}`,
    replace: false,
    fullScreen: true,
  });

  const combinationShare = () => {
    const infoData = {
      id: data.portfolioId,
      combinationName: data.name,
      createTime: data.createTime,
      profitLoss: data.profitLoss,
      profitLossPct: data.profitLossRatio,
      totalProfitLoss: data.totalProfitLoss,
      totalProfitLossPct: data.totalProfitRatio,
      nearly30Profit: data.nearly30Profit,
      target: data.portfolioId,
      type: data.type,
      shareSource: shareSourceType.Combination,
    };

    sharePage({
      shareType: CShareType.Data,
      info: infoData,
    });
  };
  return (
    <>
      <div styleName="combination-list-item">
        <div
          onClick={() => {
            const hash = COMBINATION_POSITION_ROUTERS.COMBINATION_DETAIL;
            return handleJump(hash);
          }}
        >
          <div styleName="info-box">
            <div styleName="info-name">{data.name}</div>
            <div styleName="info-order-time">
              <span styleName="time-text">{dayjs(data.createTime).format('DD/MM/YYYY')}</span>
              <span>{formatMessage({ id: 'place_the_order' })}</span>
            </div>

            <div
              styleName="share-box"
              onClick={(e) => {
                e.stopPropagation();

                combinationShare();
              }}
            />
          </div>

          <div styleName="property-data-box">
            <div styleName="property-data-item">
              <div styleName="data-box">
                <div
                  styleName="content text-amplification"
                  className={classNames([getClassNameByPriceChange(data.totalProfitRatio)])}
                >
                  {setPositiveSign(data.totalProfitRatio)}
                </div>
                <div styleName="label">{formatMessage({ id: 'combined_order_up_to_now' })}</div>
              </div>

              <div styleName="data-box">
                <div styleName="content">{toThousand(data.marketValue)}</div>
                <div styleName="label">{formatMessage({ id: 'combined_total_assets' })}</div>
              </div>
            </div>

            <div styleName="property-data-item">
              <div styleName="data-box">
                <div styleName="content">{data.netValue}</div>
                <div styleName="label">{formatMessage({ id: 'combined_net_worth' })}</div>
              </div>

              <div styleName="data-box">
                <div styleName="content">{data.position}</div>
                <div styleName="label">{formatMessage({ id: 'combination_of_positions' })}</div>
              </div>
            </div>

            <div styleName="property-data-item">
              <div styleName="data-box">
                <div styleName="content" className={classNames([getClassNameByPriceChange(data.totalProfitLoss)])}>
                  {toThousand(setPositiveSign(data.totalProfitLoss))}
                </div>

                <div
                  styleName="label"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTotalModalVisible(true);
                  }}
                >
                  <IconSvg path="icon_hint" styleName="icon-hint" />
                  {formatMessage({ id: 'accumulative_total_profit_and_loss' })}
                </div>
              </div>

              <div styleName="data-box">
                <div styleName="content">
                  <p styleName="text-narrow" className={classNames([getClassNameByPriceChange(data.profitLossRatio)])}>
                    {setPositiveSign(toPercent(data.profitLossRatio))}
                  </p>

                  <p className={classNames([getClassNameByPriceChange(data.profitLoss)])}>
                    {toThousand(setPositiveSign(data.profitLoss))}
                  </p>
                </div>

                <div
                  styleName="label"
                  onClick={(e) => {
                    e.stopPropagation();
                    settodayModalVisible(true);
                  }}
                >
                  <IconSvg path="icon_hint" styleName="icon-hint" />
                  {formatMessage({ id: 'today_profit_and_loss' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div styleName="operation-box">
          <div styleName="warehouse-btns">
            <button
              type="button"
              styleName="combination-btn"
              onClick={() => {
                const hash = COMBINATION_POSITION_ROUTERS.COMBINATION_ORDER;
                return handleJump(hash);
              }}
            >
              {formatMessage({ id: 'combination_warehouse' })}
            </button>

            <button
              type="button"
              styleName="record-btn"
              onClick={() => {
                const hash = COMBINATION_POSITION_ROUTERS.COMBINATION_WAREHOUSE_RECORD;
                return handleJump(hash);
              }}
            >
              {formatMessage({ id: 'warehouse_record' })}
            </button>
          </div>

          <button
            type="button"
            styleName={classNames({
              'details-btn': true,
              'close-icon': isOpen,
              'unfold-icon': !isOpen,
            })}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        {isOpen && (
          <div styleName="details-box">
            <CombinationListItemTabs pid={data.portfolioId} data={data} />
          </div>
        )}
      </div>

      <BasicModal
        visible={totalModalVisible}
        title={formatMessage({ id: 'total_profit_and_loss_calc' })}
        confirmText={formatMessage({ id: 'i_know' })}
        onConfirm={() => setTotalModalVisible(false)}
      >
        <div>
          <p>{formatMessage({ id: 'total_profit_and_loss_calc_intro1' })}</p>
          <p>{formatMessage({ id: 'total_profit_and_loss_calc_intro2' })}</p>
        </div>
      </BasicModal>

      <BasicModal
        visible={todayModalVisible}
        title={formatMessage({ id: 'today_profit_and_loss_calc' })}
        confirmText={formatMessage({ id: 'i_know' })}
        onConfirm={() => settodayModalVisible(false)}
      >
        <div>
          <p>{formatMessage({ id: 'today_profit_and_loss_calc_intro1' })}</p>
          <p>{formatMessage({ id: 'today_profit_and_loss_calc_intro2' })}</p>
          <p styleName="profit-loss-tips">{formatMessage({ id: 'today_profit_and_loss_calc_intro3' })}</p>
        </div>
      </BasicModal>
    </>
  );
};

export default CombinationListItem;
