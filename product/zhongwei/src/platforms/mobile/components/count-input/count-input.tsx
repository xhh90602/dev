/* eslint-disable react/no-unused-prop-types */
import { Input } from 'antd-mobile';
import IconSvg from '@mobile/components/icon-svg';

import './count-input.scss';
import { useIntl } from 'react-intl';
import { forwardRef, useRef, useState } from 'react';
import { InputRef } from 'antd-mobile/es/components/input';

interface ICountInput {
  value: string | number;
  change: (value: string) => void;
  plus: () => void;
  minus: () => void;
  placeholder: string;
  point: number;
  focus: () => void;
  blur: () => void;
  className: string;
  disabled: boolean;
  size: number;
  weight: string;
}

const CountInput = (props, ref) => {
  const { formatMessage } = useIntl();
  const {
    value,
    change,
    plus,
    minus,
    placeholder = formatMessage({ id: 'please_enter_qty' }),
    blur,
    focus,
    className,
    disabled,
    size = 26,
    weight = 400,
  } = props;

  const [f, setF] = useState(false);

  const numberRef = useRef<InputRef | null>(null);

  // 减
  const minusHandler = () => {
    if (disabled) return;
    minus();
  };

  // 加
  const plusHandler = () => {
    if (disabled) return;
    plus();
  };

  return (
    <div
      styleName="price-input"
      style={{ '--size': `${size / 100}rem`, '--weight': weight }}
      className={className}
      ref={ref}
    >
      <div styleName={`input-btn-minus ${disabled ? 'disabled' : ''}`} onClick={() => minusHandler()}>
        <IconSvg path="icon_sub" />
      </div>
      <div styleName="show-box">
        {(value || value === 0) && !f && (
          <div
            styleName="show-value"
            className="num-font"
            onClick={() => {
              numberRef.current?.focus();
            }}
          >
            {value}
          </div>
        )}
        <Input
          disabled={disabled}
          ref={numberRef}
          type="text"
          styleName={value && !f ? 'hidden' : ''}
          value={String(value)}
          placeholder={placeholder}
          onChange={(v) => change && change(v)}
          onFocus={() => {
            setF(true);
            if (focus) focus();
          }}
          onBlur={() => {
            setF(false);
            if (blur) blur();
          }}
        />
      </div>
      <div styleName={`input-btn-plus ${disabled ? 'disabled' : ''}`} onClick={() => plusHandler()}>
        <IconSvg path="icon_plus" />
      </div>
    </div>
  );
};

export default forwardRef<HTMLDivElement, Partial<ICountInput>>(CountInput);
