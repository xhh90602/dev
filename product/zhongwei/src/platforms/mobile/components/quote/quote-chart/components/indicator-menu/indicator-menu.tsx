import React from 'react';
import classNames from 'classnames';

import './indicator-menu.scss';

interface SelectKey {
  key: string;
  selectedKeys: string[];
}

interface IProps {
  list: { name: string, key: string; }[];
  selectedKeys: string[];
  onSelect: (info: SelectKey) => void;
  onDeselect: (info: SelectKey) => void;
}

const IndicatorMenu: React.FC<IProps> = (props) => {
  const { list, selectedKeys, onSelect, onDeselect } = props;

  const onClick = (key) => {
    if (selectedKeys.includes(key)) {
      onDeselect({ key, selectedKeys: selectedKeys.filter((keys: string) => keys !== key) });
    } else {
      onSelect({ key, selectedKeys: [...selectedKeys, key] });
    }
  };

  return (
    <ol styleName="indicator-menu">
      {
        list.map(({ key, name }) => (
          <li
            key={key}
            onClick={() => onClick(key)}
            styleName={classNames('indicator-items', {
              'indicator-items-active': selectedKeys.includes(key),
            })}
          >
            {name}
          </li>
        ))
      }
    </ol>
  );
};

export default IndicatorMenu;
