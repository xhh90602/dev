import * as React from 'react';
import { InputNumber } from 'antd';
import './form.scss';

const t = (v) => v;
const regex = /^-?(0|0[.]\d*[1-9]+\d*)/;// 匹配0~1

export const RenderInputNumber = (props) => {
  const { value: defaultValue, isRequired, min = 1, max = 1000, onInput, paramName,
    errorTips = 'Missing Parameters', onError, randomKey, rowKey, readonly } = props;
  const [showError, setShowError] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const handleChange = (v) => {
    setValue(v);
    if (!v && v !== 0 && isRequired) {
      setShowError(true);
      return;
    }
    setShowError(false);
    if (onInput) onInput(rowKey, v);
  };

  React.useEffect(() => {
    setValue(defaultValue);
    setShowError(false);
  }, [defaultValue, randomKey]);

  React.useEffect(() => {
    if (!onError) return;
    onError(showError, rowKey);
  }, [showError]);

  if (!paramName) return null;

  return (
    <div styleName="input-wrapper">
      {
        readonly ? <div styleName="text">{value}</div>
          : (
            <InputNumber
              required={isRequired}
              style={{ width: '80%' }}
              min={min}
              max={max}
              precision={0}
              formatter={(val) => {
                const isInvalid = val === '.' || val === '-' || regex.test(`${val}`);
                return isInvalid ? '' : `${val}`;
              }}
              onChange={handleChange}
              value={value}
              className={`input-number-with-handler ${showError ? 'error-input' : ''}`}
            />
          )
      }
      {
        showError && <div className="red font12" styleName="error-tips">{t('quotes:is_required')}</div>
      }
    </div>
  );
};
