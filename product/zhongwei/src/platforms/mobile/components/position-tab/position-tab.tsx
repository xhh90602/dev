import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import './position-tab.scss';

const textTabItem = [
  {
    label: <FormattedMessage id="all_warehose" />,
    value: 'all',
  },
  {
    label: '1/2',
    value: '2',
  },
  {
    label: '1/3',
    value: '3',
  },
  {
    label: '1/4',
    value: '4',
  },
];

/**
 * @param active 选中
 * @param activeChange 选中更改函数
 * @param resetDeps 重置依赖
 */
const PositionTab = (props) => {
  const { active, activeChange, resetDeps = [] } = props;

  useEffect(() => {
    activeChange('');
  }, resetDeps);

  return (
    <div className="flex-c-between i-flex-c">
      {
        textTabItem.map((item) => (
          <div
            key={item.value}
            className="t-c"
            styleName={item.value === active ? 'active position-item' : 'position-item'}
            onClick={() => {
              activeChange(item.value);
            }}
          >
            {
              item.label
            }
          </div>
        ))
      }
    </div>
  );
};

export default PositionTab;
