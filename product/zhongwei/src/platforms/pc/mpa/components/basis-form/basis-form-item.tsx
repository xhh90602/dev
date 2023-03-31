import { useIntl } from 'react-intl';
import { Input, Select, DatePicker, Radio, Button } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { FORM_ITEM_TYPE } from '@pc/constants/config';

interface IFormItemRrops {
  [propName: string]: any;
}

const BasisFormItem: React.FC<IFormItemRrops> = (props) => {
  const { formatMessage } = useIntl();
  const { config } = props;

  if (config.type === FORM_ITEM_TYPE.INPUT) {
    return <Input {...config} placeholder={formatMessage({ id: config.placeholder })} />;
  }

  if (config.type === FORM_ITEM_TYPE.SELECT) {
    return (
      <Select
        suffixIcon={<CaretDownOutlined />}
        {...config}
        placeholder={formatMessage({ id: config.placeholder })}
      />
    );
  }

  if (config.type === FORM_ITEM_TYPE.RADIO_GROUP) {
    return <Radio.Group {...config} />;
  }

  if (config.type === FORM_ITEM_TYPE.DATE_RANGE) {
    const { placeholder: startPlaceholder = '选择日期' } = config.startDateConfig;
    const { placeholder: endPlaceholder = '选择日期' } = config.endDateConfig;

    return (
      <>
        <DatePicker
          {...config.startDateConfig}
          placeholder={formatMessage({ id: startPlaceholder })}
        />
        <span className="range-picker-delimiter">-</span>
        <DatePicker
          {...config.endDateConfig}
          placeholder={formatMessage({ id: endPlaceholder })}
        />
      </>
    );
  }

  return <Button type={config.btnType} onClick={config.onClick}>{formatMessage({ id: config.btnLabel })}</Button>;
};

export default BasisFormItem;
