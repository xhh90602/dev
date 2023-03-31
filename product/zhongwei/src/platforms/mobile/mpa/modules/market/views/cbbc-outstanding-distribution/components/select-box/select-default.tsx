/* eslint-disable react/jsx-wrap-multilines */
import { useState } from 'react';
import { Select } from 'antd';
import downArrow from '../../images/down-white.svg';
import './select-box.scss';

const { Option } = Select;

interface IOptionItem {
  content: string;
  value: number;
}

type Props = {
  optionArr: IOptionItem[];
  styles?: React.CSSProperties;
  onChange?: (data: any) => void;
};

const SelectDefault: React.FC<Props> = ({ optionArr, styles, onChange }) => {
  const [selectValue, setSelectValue] = useState<null | number | string>(optionArr[0].value);
  function handleChange(value) {
    setSelectValue(value);
    if (typeof onChange === 'function') {
      onChange(value);
    }
  }
  return (
    <div styleName="select-box" style={styles}>
      <Select
        suffixIcon={
          <div styleName="icon-box">
            <img src={downArrow} alt="" />
          </div>
        }
        onSelect={(val) => handleChange(val)}
        value={selectValue}
      >
        {optionArr.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.content}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectDefault;
