/* eslint-disable react/jsx-wrap-multilines */
import { Dropdown, Select } from 'antd-mobile';

import { useIntl } from 'react-intl';
import downArrow from '../../images/down-white.svg';
import './select-box.scss';

const { Option } = Select;

interface IOptionItem {
  content: string;
  value: number;
}

type Props = {
  optionArr: IOptionItem[];
  placeholderText: string;
  styles?: React.CSSProperties;
  getSelect: (data: any) => void;
  property: string;
  defaultType: string;
};

const SelectBox: React.FC<Props> = ({ optionArr, placeholderText, styles, getSelect, defaultType, property }) => {
  const { formatMessage } = useIntl();
  function handleChange(value) {
    getSelect({ [property]: value });
  }

  return (
    <div styleName="select-box" style={styles}>
      <Dropdown ref={dropdownRef} arrow={<img styleName="icon" src={downArrow} alt="" />}>
        <Dropdown.Item
          key="sorter1"
          title={renderDropdownTitle(
            formatMessage({ id: 'recovery_price_range' }),
            `${priceInterval}
                  ${currency()}`,
          )}
        >
          <ol styleName="dropdown-list">
            {priceIntervalList.map((item) => (
              <li
                styleName={classNames('dropdown-item', {
                  'dropdown-item--active': priceInterval === item,
                })}
                key={`${item}`}
                onClick={() => {
                  setPriceInterval(item);
                  dropdownRef.current.close();
                }}
              >
                {item}
                {currency()}
              </li>
            ))}
          </ol>
        </Dropdown.Item>

        <Dropdown.Item key="bizop" title={renderDropdownTitle('', tradeDay)}>
          <ol styleName="dropdown-list" className="special-list">
            {tradeDayList.map((item) => (
              <li
                styleName={classNames('dropdown-item', {
                  'dropdown-item--active': tradeDay === item,
                })}
                key={item}
                onClick={() => {
                  setTradeDay(item);
                  dropdownRef.current.close();
                }}
              >
                {item}
              </li>
            ))}
          </ol>
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};
export default SelectBox;
