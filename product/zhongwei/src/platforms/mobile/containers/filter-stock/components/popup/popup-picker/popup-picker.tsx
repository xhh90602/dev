import { useState, useMemo, useEffect } from 'react';
import { PickerView } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { QeqType } from '../../../constants';
import PopupFooter from '../footer/footer';
import { useConditionStore } from '../../../model';
import './popup-picker.scss';

interface IProps {
  visible: boolean;
  onMaskClick: () => void;
  condition: any;
  title: string;
  field: string;
  onConfirm: (info: any) => any;
}

const PopupPicker: React.FC<IProps> = (props) => {
  const { condition = [], title, field, onMaskClick } = props;

  const remoteConditionValue = useConditionStore((state) => state.value[field]);
  const [value, setValue] = useState<string[]>([]);
  const [valueInfo, setValueInfo] = useState<any>({});

  const columns = useMemo(() => [condition.map((item) => ({
    label: item.name,
    value: item.value,
  }))], [condition]);

  const onChange = (v: any[]) => {
    setValue(v);
    setValueInfo(condition.find((item) => item.value === v[0]));
  };

  const getData = () => ({ [field]: {
    dimension: field,
    type: QeqType.picker,
    value: valueInfo.value,
    conditionName: valueInfo.name,
    title,
  } });

  useEffect(() => {
    if (!remoteConditionValue) return;

    setValue([remoteConditionValue.value]);
    setValueInfo(condition.find((item) => item.value === remoteConditionValue.value));
  }, [remoteConditionValue, condition]);

  return (
    <div styleName="stock-scope">
      {/* <h3 styleName="title">{title}</h3> */}
      <div styleName="title-container">
        <CloseOutline
          fontSize={18}
          color="#717686"
          onClick={onMaskClick}
          styleName="close-icon"
        />
        <span styleName="title-style">{title}</span>
      </div>

      <PickerView
        columns={columns}
        onChange={onChange}
        value={value}
      />

      <PopupFooter getData={getData} confirmCallback={onMaskClick} />
    </div>
  );
};

export default PopupPicker;
