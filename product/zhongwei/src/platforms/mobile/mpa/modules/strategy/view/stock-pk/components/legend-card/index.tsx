import React, { memo, useMemo, useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Popover } from 'antd-mobile';
import IconDown from '@/platforms/mobile/images/icon_down.svg';

import './index.scss';

const LegendCard: React.FC<any> = memo((props: any) => {
  const { list, colors, getLegend = () => null, currency, getCurrency = () => null } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [legend, setlegend] = useState<any>({});
  const cardRef = useRef(null);
  const { formatMessage } = useIntl();

  const emptyList = useMemo(() => {
    const leng = (list && list.length) || 0;
    if (!list || leng <= 0) {
      return [0, 1, 2, 3];
    }
    const temp: any = [];
    for (let i = 4; i > leng; i -= 1) {
      temp.push(leng + 4 - i);
    }
    const obj: any = {};
    list.forEach((item) => {
      obj[item.name] = true;
    });
    setlegend(obj);
    return temp;
  }, [list]);

  const legendClick = (name) => {
    if (!name) return;
    legend[name] = !legend[name];
    setlegend({ ...legend });
  };

  const popoverList = [
    { key: 'HKD', text: 'HKD' },
    { key: 'USD', text: 'USD' },
    { key: 'CNY', text: 'CNY' },
  ];

  useEffect(() => {
    getLegend(legend);
  }, [legend]);

  return (
    <div styleName="legend-box-sticky">
      <div styleName="legend-box">
        <Popover.Menu
          actions={popoverList}
          trigger="click"
          placement="bottom-start"
          onAction={(node: any) => getCurrency(node.text)}
          onVisibleChange={(v: boolean) => setVisible(v)}
          getContainer={cardRef.current}
        >
          <div styleName="currency-company-box">
            <div styleName="currency-company-text">{formatMessage({ id: 'currency_unit' })}</div>
            <div styleName="currency-text">
              {currency}
              <img styleName={visible ? 'rotate' : ''} src={IconDown} alt="" />
            </div>
          </div>
        </Popover.Menu>
        <div styleName="legend-item-box">
          <div styleName="scroll-box">
            {
              list && list.map((item, index) => (
                <div
                  styleName={legend[item.name] ? 'legend-item' : 'legend-item active'}
                  key={item.code}
                  onClick={() => legendClick(item.name)}
                >
                  <div styleName="name" style={{ color: colors[index] }}>{item.name}</div>
                  <div styleName="currency">{currency}</div>
                </div>
              ))
            }
            {
              emptyList.map((item) => (
                <div styleName="legend-item" key={item} onClick={() => legendClick(null)}>
                  <div styleName="name" style={{ color: colors[item] }}>--</div>
                  <div styleName="currency" style={{ color: colors[item] }}>--</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
});

export default LegendCard;
