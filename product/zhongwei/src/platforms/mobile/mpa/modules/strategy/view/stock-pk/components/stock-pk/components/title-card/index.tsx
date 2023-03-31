import React, { memo, useRef, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Popover } from 'antd-mobile';
import IconDown from '@/platforms/mobile/images/drop-down-icon.svg';
import IconTop from '@/platforms/mobile/images/icon_top.svg';

import './index.scss';

const TitleCard: React.FC<any> = memo((props: any) => {
  const {
    title = '',
    showTitle = true,
    showCondition = false,
    open = false,
    showText = false,
    setOpen = () => null,
    cycle = 'Q1',
    setCycle = () => null,
  } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const cardRef = useRef(null);
  const { formatMessage } = useIntl();

  const popoverList = [
    { key: 'Q1', text: formatMessage({ id: 'near3' }) },
    { key: 'Q2', text: formatMessage({ id: 'near6' }) },
    { key: 'Q3', text: formatMessage({ id: 'near9' }) },
    { key: 'Q4', text: formatMessage({ id: 'near12' }) },
    { key: 'Y3', text: formatMessage({ id: 'near36' }) },
  ];

  const text = useMemo(() => (cycle && popoverList.filter((item) => item.key === cycle)[0]?.text) || '', [cycle]);

  return (
    <div styleName="title-card">
      <div styleName="title-card-box">
        {
          showTitle ? (
            <>
              <div styleName="left">
                <div styleName="title">{title}</div>
                {
                  open && showCondition && (
                    <Popover.Menu
                      styleName="tool-popover-bar"
                      actions={popoverList}
                      trigger="click"
                      placement="bottom-start"
                      onAction={(item: any) => setCycle(item)}
                      onVisibleChange={(v: boolean) => setVisible(v)}
                      getContainer={cardRef.current}
                    >
                      <div styleName="select-box">
                        {text}
                        <img styleName={visible ? 'rotate' : ''} src={IconDown} alt="" />
                      </div>
                    </Popover.Menu>
                  )
                }
              </div>
              <div styleName="right" onClick={() => setOpen(!open)}>
                {
                  showText && (
                    <div styleName="text">
                      {open ? `${formatMessage({ id: 'stow' })}` : `${formatMessage({ id: 'open' })}`}
                    </div>
                  )
                }
                <img styleName={open ? '' : 'rotate'} src={IconTop} alt="" />
              </div>
            </>
          ) : null
        }
      </div>
    </div>
  );
});

export default TitleCard;
