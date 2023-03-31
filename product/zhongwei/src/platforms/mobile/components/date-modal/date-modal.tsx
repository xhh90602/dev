/* eslint-disable react/require-default-props */
import { DatePickerView, Popup } from 'antd-mobile';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import type { Precision } from 'antd-mobile/es/components/date-picker/date-picker-utils';
import './date-modal.scss';

const now = new Date();

interface IDateModal {
  visible: boolean;
  value: Date;
  title?: string;
  start?: Date,
  end?: Date,
  onOk?: (v: any) => void;
  onCancel?: () => void;
  precision?: Precision;
}
/**
 * 日期区间选择
 * @param visible 是否展开
 * @param title 标题
 * @param start 开始时间
 * @param end 结束时间
 * @param cancelText 取消展示文本
 * @param okText 完成展示文本
 * @param onOk 完成回调函数
 * @param onCancel 取消回调函数
 */
const DateModal = (props: IDateModal) => {
  const {
    visible,
    value,
    title = '',
    start = now,
    end,
    onOk = () => undefined,
    onCancel = () => undefined,
    precision = 'day',
  } = props;

  const [time, setTime] = useState(value);

  function onClose() {
    if (onCancel) onCancel();
  }

  function onConfirm() {
    if (onOk) { onOk(time); }
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={() => {
        onClose();
      }}
    >
      <div
        style={{ display: visible ? 'block' : 'none' }}
        styleName="bottom"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div styleName="title">
          <span styleName="btn" className="t-desc" onClick={onClose}>
            <FormattedMessage id="取消" />
          </span>
          <span>{title}</span>
          <span styleName="btn" className="orange-color" onClick={onConfirm}>
            <FormattedMessage id="确定" />
          </span>
        </div>

        <DatePickerView
          className="search-form"
          value={time as Date}
          min={start}
          max={end}
          defaultValue={new Date()}
          onChange={(val) => {
            setTime(val);
          }}
          precision={precision}
        />
      </div>
    </Popup>
  );
};

export default DateModal;
