/* eslint-disable react/require-default-props */
import { formatToString } from '@/utils/date';
import { DatePickerView, Popup, Toast } from 'antd-mobile';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import './date-interval-modal.scss';
import useComponentsIntl from '../../hooks/components-i18n/useComponentsIntl';

const now = new Date();

const yearStart = new Date(now.getFullYear().toString());

const dayTime = 24 * 60 * 60 * 1000;

const listDate = [
  {
    label: 'today',
    key: 'today',
    start: now.getTime(),
  },
  {
    label: 'last_5_days',
    key: '5day',
    start: now.getTime() - 4 * dayTime,
  },
  {
    label: 'last_weeks',
    key: '1week',
    start: now.getTime() - 6 * dayTime,
  },
  {
    label: 'last_months',
    key: '1month',
    start: now.getTime() - 29 * dayTime,
  },
  {
    label: 'last_three_months',
    key: '3month',
    start: now.getTime() - 89 * dayTime,
  },
  {
    label: 'year_to_date',
    key: 'year',
    start: yearStart.getTime(),
  },
];

interface IDateIntervalModal {
  visible: boolean;
  defalutKey?: string;
  selectListKey?: string[];
  start: Date;
  end: Date;
  max?: Date;
  min?: Date;
  cancelText?: string;
  okText?: string;
  onOk?: (obj: { startTime: Date; endTime: Date }) => void;
  onCancel?: () => void;
  container?: HTMLElement | null;
}
/**
 * 日期区间选择
 * @param visible 是否展开
 * @param start 开始时间
 * @param end 结束时间
 * @param cancelText 取消展示文本
 * @param okText 完成展示文本
 * @param onOk 完成回调函数
 * @param onCancel 取消回调函数
 */
const DateIntervalModal = (props: IDateIntervalModal) => {
  const { formatMessage } = useComponentsIntl();

  const {
    visible,
    start,
    end,
    defalutKey = '',
    selectListKey = ['1week', '1month', '3month'],
    cancelText = '',
    max = undefined,
    min = undefined,
    okText = '',
    onOk = () => undefined,
    onCancel = () => undefined,
    container = document.body,
  } = props;

  const [checkType, setCheckType] = useState(defalutKey);
  const [startTime, setStartTime] = useState(start);
  const [endTime, setEndTime] = useState(end);
  const [time, setTime] = useState(now);
  const [visibleDate, setVisibleDate] = useState(false);
  const [currentTime, setCurrentTime] = useState<'start' | 'end' | ''>('');

  const initStart = useRef(start);
  const initEnd = useRef(end);

  const initTime = () => {
    setStartTime(initStart.current);
    setEndTime(initEnd.current);
  };

  const dateTitle = useMemo(() => {
    if (currentTime === 'start') {
      return formatMessage({ id: 'please_select_start_time' });
    }
    return formatMessage({ id: 'please_select_end_time' });
  }, [currentTime]);

  useEffect(() => {
    if (!visible) {
      setCurrentTime('');
      setVisibleDate(false);
    }
  }, [visible]);

  useEffect(() => {
    if (visibleDate) {
      setTime(currentTime === 'start' ? startTime : endTime);
      setCheckType('');
    } else {
      setCurrentTime('');
    }
  }, [visibleDate]);

  function onClose() {
    setVisibleDate(false);
  }

  function onConfirm() {
    if (currentTime === 'start') {
      if (endTime < time) {
        Toast.show(formatMessage({ id: 'start_time_cannot_be_later_than_end_time' }));
        return;
      }
      setStartTime(time);
    } else {
      if (startTime > time) {
        Toast.show(formatMessage({ id: 'end_time_must_be_no_later_than_start_time' }));
        return;
      }
      setEndTime(time);
    }
    setVisibleDate(false);
  }

  const reset = () => {
    setCheckType(defalutKey);
    initTime();
  };

  const boxRef = useRef(null);

  const boxRect = container?.getBoundingClientRect();

  return (
    <div
      ref={boxRef}
      style={{
        display: visible ? 'block' : 'none',
        top: `${boxRect?.top}px`,
      }}
      styleName="date-box"
      onClick={() => {
        onCancel();
      }}
    >
      <Popup
        visible={visible}
        getContainer={boxRef.current}
        mask={false}
        position="top"
        style={{ position: 'absolute' }}
        bodyStyle={{ position: 'absolute' }}
      >
        <div>
          <div
            styleName="top"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {selectListKey.length > 0 && (
            <div styleName="check-time">
              <div className="desc-title">{formatMessage({ id: 'quick_time_select' })}</div>
              <div styleName="check-box">
                {listDate
                  .filter((date) => selectListKey.indexOf(date.key) > -1)
                  .map((v) => (
                    <div
                      styleName={`${checkType === v.key ? 'active' : ''} check-icon`}
                      key={v.key}
                      onClick={() => {
                        setCheckType(v.key);
                        setStartTime(new Date(v.start));
                        setEndTime(now);
                      }}
                    >
                      {formatMessage({ id: v.label })}
                    </div>
                  ))}
              </div>
            </div>
            )}
            <div styleName="time-interval">
              <div className="desc-title">{formatMessage({ id: 'date_range_select' })}</div>
              <div styleName="time-interval-box">
                <div
                  styleName={`${currentTime === 'start' ? 'active' : ''} time`}
                  onClick={() => {
                    setCurrentTime('start');
                    setVisibleDate(true);
                  }}
                >
                  {formatToString(startTime, 'dd/MM/yyyy')}
                </div>
                <div className="t-desc">{formatMessage({ id: 'to' })}</div>
                <div
                  styleName={`${currentTime === 'end' ? 'active' : ''} time`}
                  onClick={() => {
                    setCurrentTime('end');
                    setVisibleDate(true);
                  }}
                >
                  {formatToString(endTime, 'dd/MM/yyyy')}
                </div>
              </div>
            </div>
            <div styleName="tool">
              <div
                styleName="cancel-btn"
                onClick={() => {
                  reset();
                }}
              >
                {cancelText || formatMessage({ id: 'reset' })}
              </div>
              <div
                styleName="ok-btn"
                onClick={() => {
                  onOk({ startTime, endTime });
                }}
              >
                {okText || formatMessage({ id: 'confirm' })}
              </div>
            </div>
          </div>
          <Popup
            visible={visibleDate}
            mask={false}
            getContainer={boxRef.current}
          >
            <div
              styleName="bottom"
            // style={{ display: visibleDate ? 'block' : 'none' }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div styleName="title">
                <span styleName="btn" className="t-desc" onClick={onClose}>
                  {formatMessage({ id: 'cancel' })}
                </span>
                <span>{dateTitle}</span>
                <span styleName="btn" className="orange-color" onClick={onConfirm}>
                  {formatMessage({ id: 'confirm' })}
                </span>
              </div>

              <DatePickerView
                className="search-form"
                value={time as Date}
                max={max}
                min={min}
                onChange={(val) => {
                  setTime(val);
                }}
              />
            </div>
          </Popup>
        </div>
      </Popup>
    </div>
  );
};

export default memo(DateIntervalModal);
