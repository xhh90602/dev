import { FormattedMessage } from 'react-intl';
import { getUrlParam } from '@/utils';
import { TRADE_ORDER_STATUS } from '@/constants/trade';
import { editUrlParams } from '@/utils/navigate';
import IconSvg from '@mobile/components/icon-svg';
import { useNavigate } from 'react-router-dom';
import { TRADE_ROUTERS } from '../../mpa/modules/trade/routers';
import { openNewPage, PageType } from '../../helpers/native/msg';
import { useTradeStore } from '../../model/trade-store';

/** 展开 dom */
const ExpandDom = (props) => {
  const {
    current,
    setCurrent,
    setVisible,
    cancelOrder,
    bg = false,
  } = props;

  const navigate = useNavigate();
  const param = getUrlParam();
  const { userTradeConfigInfo } = useTradeStore();
  const goToEdit = () => {
    const url = editUrlParams(
      {
        market: current.smallMarket,
        code: current.stockCode,
        id: current.conditionNo,
        active_key: TRADE_ORDER_STATUS.CONDITION,
        edit: 'true',
      },
      current.bs === 'B'
        ? TRADE_ROUTERS.BUY
        : TRADE_ROUTERS.SELL,
    );
    navigate(url, { replace: param.edit === 'true' });
  };

  const goToDetail = () => {
    openNewPage({
      path: `trade.html#${TRADE_ROUTERS.INFO_CONDITION}?conditionNo=${current.conditionNo}`,
      pageType: PageType.HTML,
      title: '订单详情',
    });
  };

  return (
    (
      <div
        className="expand-box f-s-22"
        style={{
          width: '100%',
          '--bg': bg ? 'var(--expand-index-bg)' : 'var(--expand-bg)',
        }}
        onClick={() => {
          setCurrent(current);
        }}
      >
        <div
          className="t-c"
          onClick={goToEdit}
        >
          <div className="expand-icon">
            <IconSvg path="icon_edit" />
          </div>
          <FormattedMessage id="edit" />
        </div>
        <div
          className="t-c"
          onClick={goToDetail}
        >
          <div className="expand-icon">
            <IconSvg path="icon_info" />
          </div>
          <FormattedMessage id="detail" />
        </div>
        <div
          className="t-c"
          onClick={() => {
            if (userTradeConfigInfo.orderToConfirmByDialog) {
              setVisible(true);
            } else {
              cancelOrder();
            }
          }}
        >
          <div className="expand-icon">
            <IconSvg path="icon_back_order" />
          </div>
          <FormattedMessage id="revoke" />
        </div>
      </div>
    )
  );
};

export default ExpandDom;
