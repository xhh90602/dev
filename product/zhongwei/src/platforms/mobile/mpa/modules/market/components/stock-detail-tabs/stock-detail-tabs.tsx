import React, { CSSProperties, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import './stock-detail-tabs.scss';

interface tabItem {
  value: number,
  label: string
}

interface IProps {
  tabData: tabItem[];
  onChange: (value) => void;
  styles?: CSSProperties;
  itemStyle?: CSSProperties;
}

const StockDetailTabs: React.FC<IProps> = ({ tabData, onChange, styles, itemStyle }) => {
  const [currentIndex, setCurrentIndex] = useState('');
  const { formatMessage } = useIntl();

  function switchIndex(idx: string): void {
    setCurrentIndex(idx);
    if (typeof onChange === 'function') {
      onChange(+idx);
    }
  }

  useEffect(() => {
    if (tabData?.length) {
      setCurrentIndex(`${tabData[0]?.value}`);
    }
  }, [tabData]);
  return (
    <div styleName="tab-list" style={styles}>
      {tabData?.map((k) => (
        <div
          style={itemStyle}
          key={k.value}
          styleName={classNames('tab-item', {
            active: `${k.value}` === currentIndex,
          })}
          onClick={() => {
            switchIndex(`${k.value}`);
          }}
        >
          {formatMessage({ id: k.label })}
        </div>
      ))}
    </div>
  );
};

StockDetailTabs.defaultProps = {
  styles: {
    background: '#f6f8ff',
  },
  itemStyle: {
    width: '2.23rem',
  },
};

export default StockDetailTabs;
