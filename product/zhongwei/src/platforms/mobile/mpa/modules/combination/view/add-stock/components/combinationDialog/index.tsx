import React, { memo, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Popup } from 'antd-mobile';
import { getCombination } from '@/api/module-api/combination';
import IconClose from '@/platforms/mobile/images/icon_close.svg';
import IconAdd from '@/platforms/mobile/images/icon_create.svg';
import IconNotSelect from '@/platforms/mobile/images/icon_not_select.svg';
import IconSelect from '@/platforms/mobile/images/icon_select.svg';
import Empty from '@/platforms/mobile/components/combination/empty';

import './index.scss';

const Dialog = memo((props: any) => {
  const {
    show = false,
    closeClick = () => null,
    confirmClick = () => null,
    createClick = () => null,
  } = props;
  const [list, setList] = useState<any>([]);
  const [portfolioId, setPortfolioId] = useState<any>(null);
  const { formatMessage } = useIntl();

  // 获取组合列表
  const getCombinationList = () => {
    getCombination({}).then((res: any) => {
      if (res && res.code === 0) {
        setList(res?.result || []);
      }
      return [];
    });
  };

  const qxClick = () => {
    closeClick();
    setPortfolioId(null);
  };

  const qrClick = () => {
    if (!portfolioId) return;
    confirmClick(portfolioId);
  };

  const itemClick = (id) => {
    setPortfolioId(id);
  };

  useEffect(() => {
    if (show) {
      setPortfolioId(null);
      getCombinationList();
    }
  }, [show]);

  return (
    <Popup
      visible={show}
      onMaskClick={() => {
        qxClick();
      }}
      bodyStyle={{ height: '60vh' }}
    >
      <div styleName="content-box">
        <div styleName="header-box">
          <div styleName="title">{formatMessage({ id: 'select_combination' })}</div>
          <img src={IconClose} alt="" onClick={() => qxClick()} />
        </div>
        <div styleName="create-portfolio">
          <img src={IconAdd} alt="" />
          <div styleName="create-text" onClick={() => createClick()}>{formatMessage({ id: 'create_portfolio' })}</div>
        </div>
        <div styleName="portfolio-list-box">
          {
            list && list.length ? list.map((item) => (
              <div styleName="item" key={item.portfolioId} onClick={() => itemClick(item.portfolioId)}>
                {
                  item.portfolioId === portfolioId ? (
                    <img src={IconSelect} alt="" />
                  ) : (
                    <img src={IconNotSelect} alt="" />
                  )
                }
                <div styleName="portfolio-name">{item?.name || ''}</div>
              </div>
            )) : (
              <div styleName="empty-box">
                <Empty text={formatMessage({ id: 'tip2' })} />
              </div>
            )
          }
        </div>
        <div styleName="confirm-box" onClick={() => qrClick()}>
          <div styleName="confirm">{formatMessage({ id: 'qr_confirm' })}</div>
        </div>
      </div>
    </Popup>
  );
});

export default Dialog;
