/* eslint-disable react/no-array-index-key */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
import { useState, useEffect, useMemo, useRef } from 'react';
import { Slider, Popover } from 'antd-mobile';
import { isTrue, toPercent } from '@dz-web/o-orange';
import classNames from 'classnames';
import { DownFill, CloseOutline } from 'antd-mobile-icons';
import { queryFilterStockTotal } from '@/api/module-api/filter-stock';
import Dialog from './dialog';
import { QeqType } from '../../../constants';
import { parseReqParams } from '../../../helpers/req';
import PopupFooter from '../footer/footer';
import { useConditionStore } from '../../../model';

import './popup-slider.scss';

interface IProps {
  visible: boolean;
  title: string;
  condition: any;
  dialogInfo: any;
  field: string;
  onMaskClick: () => void;
}

const PopupSlider: React.FC<IProps> = (props) => {
  const { title, condition, dialogInfo, onMaskClick, field } = props;
  const arr = ['ma', 'macd', 'boll', 'rsi', 'kdj'];
  let keyField = field;
  if (arr.includes(dialogInfo.parentValue)) {
    keyField = `${dialogInfo.parentValue}-${field}`;
  }
  const remoteConditionValue = useConditionStore((state) => state.value[keyField]);
  const valueList = useConditionStore((state) => state.value);
  const delCondition = useConditionStore((state) => state.delCondition);
  const region = useConditionStore((state) => state.region);
  const regionTotal = useConditionStore((state) => state.regionTotal);

  const [chosenInfo, setChosenInfo] = useState<any>({});
  const [ratioName, setRatioName] = useState('');
  const [conditionValue, setConditionValue] = useState<any>({});
  const [switchList1, setSwitchList1] = useState([]); // 右中位置
  const [periodList, setPeriodList] = useState<any[]>([]); // 日期列表
  const PopoverRef = useRef(null);
  const [quickRange, setQuickRange] = useState<any>(null);
  const [customVisible, setCustomVisible] = useState(false);

  const rangeValue = useMemo(() => {
    if (!conditionValue.range) return chosenInfo.isRange ? [0, 0] : 0;

    if (chosenInfo.isRange) return [...conditionValue.range];

    return conditionValue.range[1];
  }, [chosenInfo.isRange, conditionValue.range]);

  const conditionNameParse = useMemo(() => {
    if (!chosenInfo.conditionDesc || !conditionValue.range) return '';
    const conditionText = chosenInfo.conditionDesc
      .replace(/\$\{min\}/, conditionValue.range[0])
      .replace(/\$\{max\}/, conditionValue.range[1]);
    return conditionText;
  }, [chosenInfo.conditionDesc, conditionValue.range]);

  const switchPeriod = (period: string) => {
    const curr = periodList.find((item) => item.value === period);
    setConditionValue((v) => ({ ...v, period, periodText: curr.name }));
  };

  const getData = () => {
    // ['ma', 'macd', 'boll', 'rsi', 'kdj']的只能选一个
    const { dimension } = conditionValue;
    if (arr.includes(dimension)) {
      const list = Object.keys(valueList);
      list.forEach((key) => {
        const keyLength = list.findIndex((item) => (dimension === item.split('-')[0]));
        if (key.split('-')[0] === dimension && keyLength >= 0) {
          delCondition(key);
        }
      });
    }
    if (arr.includes(dimension)) {
      keyField = `${dimension}-${field}`;
    }
    const { point, subDim } = chosenInfo;
    const obj: any = {};
    if (point) {
      obj.point = point;
    }
    if (arr.includes(dimension)) {
      keyField = `${dimension}-${field}`;
      obj.subDim = [+subDim];
    } else if (subDim) {
      obj.subDim = subDim;
    }
    if (conditionNameParse) {
      obj.conditionName = conditionNameParse;
    }
    const data = { ...conditionValue, title, ...obj };
    return { [keyField]: { ...data } };
  };

  const switch1 = (info: any) => {
    const { point = '', defMin, defMax, min = 0, max = 100, periodVos, type, conditions } = info || {};
    const isRange = point ? point === 'both' : false;
    if (periodVos) {
      setPeriodList(periodVos);
    }
    if (!remoteConditionValue) {
      let conditionValuePad: any = {};
      if (type !== 'Kline') {
        conditionValuePad = {
          range: [+defMin || min, +defMax || max],
          type: QeqType.slider,
          dimension: field,
        };
      }

      if (type === 'unit') {
        conditionValuePad.conditions = conditions;
      }

      if (type === 'common') {
        conditionValuePad.range = [+defMin || min, +defMax || max];
        conditionValuePad.type = QeqType.slider;
        conditionValuePad.conditions = conditions;
        conditionValuePad.subDim = conditions;
      }
      if (type === 'Kline') {
        conditionValuePad.dimension = dialogInfo.parentValue;
        conditionValuePad.period = periodVos[0].value;
        conditionValuePad.subDim = [+info.conditions];
      }

      if (periodVos) {
        conditionValuePad.period = periodVos[0].value;
        conditionValuePad.periodText = periodVos[0].name;
      }
      setConditionValue(conditionValuePad);
    }

    const data = {
      ...info,
      min,
      max,
      range: [+defMin || min, +defMax || max],
      isRange,
      subDim: conditions || '',
    };
    setChosenInfo({ ...data });
  };

  useEffect(() => {
    if (!field || !isTrue(conditionValue.range)) return;
    queryFilterStockTotal([parseReqParams(conditionValue), {
      dimension: 'region',
      val: [region],
    }])
      .then((res) => {
        if (res && res?.code !== 0) return;
        const total = res?.body?.total ?? 0;
        if (chosenInfo?.ratioName) {
          setRatioName(chosenInfo.ratioName
            .replace(/\$\{stock\}/, res.body.total || 0)
            .replace(/\$\{ratio\}%/, toPercent(total / regionTotal, { multiply: 100 })));
        }
      })
      .catch((err) => {
        console.log(err, '<-- err');
      });
  }, [field, conditionValue, regionTotal, region]);

  useEffect(() => {
    if (!condition) return;
    const conditionInfo = condition.condition;
    Object.keys(conditionInfo).forEach((group) => {
      if (group === 'no') {
        setSwitchList1([]);
        const [deafultChosenInfo = {}] = conditionInfo[group];
        switch1(deafultChosenInfo);
      } else if (group === 'unit' || group === 'common') {
        let [deafultChosenInfo = {}] = conditionInfo[group];
        if (remoteConditionValue) {
          deafultChosenInfo = conditionInfo[group].find((item) => item.conditions === remoteConditionValue.conditions);
          const [min, max] = remoteConditionValue.range;
          deafultChosenInfo.defMin = min;
          deafultChosenInfo.defMax = max;
        }
        switch1(deafultChosenInfo);
        setSwitchList1(conditionInfo[group]);
      } else if (group === 'Kline') {
        let [deafultChosenInfo = {}] = conditionInfo[group];
        if (remoteConditionValue) {
          const val = conditionInfo[group].find((item) => +item.conditions === remoteConditionValue.subDim[0]);
          if (val) {
            deafultChosenInfo = conditionInfo[group].find(
              (item) => item.conditions === remoteConditionValue.conditions
                || +item.conditions === remoteConditionValue.subDim[0],
            );
          }
        }
        switch1(deafultChosenInfo);
        setSwitchList1([]);
      } else if (group === 'sharePric') {
        setSwitchList1([]);
        const [deafultChosenInfo = {}] = conditionInfo[group];
        switch1(deafultChosenInfo);
      }
    });
  }, [condition, remoteConditionValue]);

  useEffect(() => {
    if (remoteConditionValue) {
      const newData = { ...remoteConditionValue };
      if (remoteConditionValue.range && !Array.isArray(remoteConditionValue.range)) {
        const { min, max } = remoteConditionValue.range;
        newData.range = [min, max];
      }
      setConditionValue({ ...newData });
    }
  }, [remoteConditionValue]);

  const setRangFun = (value = conditionValue?.range) => {
    if (value) {
      let rangeStr = '';
      if (Array.isArray(value)) {
        rangeStr = value.join('~');
      } else {
        rangeStr = `${value}`;
      }
      if (chosenInfo && chosenInfo?.sectionVos && chosenInfo?.sectionVos.length) {
        const idx = chosenInfo.sectionVos.findIndex((item) => rangeStr === item.value);
        if (idx > -1) {
          setQuickRange(idx);
        } else {
          setQuickRange(null);
        }
      }
    }
  };

  useEffect(() => {
    if (conditionValue && Object.keys(conditionValue).length) {
      setRangFun();
    }
  }, [chosenInfo]);

  const slide = (value: number | number[]) => {
    setConditionValue((v) => ({ ...v, range: chosenInfo.isRange ? value : [chosenInfo.min, value] }));
    setRangFun(chosenInfo.isRange ? value : [chosenInfo.min, value]);
  };

  const customClick = () => {
    setCustomVisible(true);
  };

  const customRange = useMemo(() => {
    const { isRange, min, max } = chosenInfo;
    if (customVisible) {
      if (isRange) {
        return { min: rangeValue[0], max: rangeValue[1] };
      }
      return { min, max: rangeValue };
    }
    return { min, max };
  }, [customVisible]);

  return (
    <div styleName="popup-slider">
      <div styleName="head-title-div">
        <span styleName="title">{title}</span>
        <CloseOutline fontSize={18} color="#717686" onClick={onMaskClick} />
      </div>

      <p styleName="desc">
        {chosenInfo.descriptionName}
      </p>

      {
        !!periodList.length
        && (
          <ol styleName="tabs">
            {
              periodList.map((item) => (
                <li
                  key={item.value}
                  styleName={classNames('tabs-items', { 'tabs-items-active': conditionValue.period === item.value })}
                  onClick={() => switchPeriod(item.value)}
                >
                  {item.name}
                </li>
              ))
            }
          </ol>
        )
      }

      {
        chosenInfo.type !== 'Kline' && (
          <div>
            <div styleName="range-preview" ref={PopoverRef}>
              <p className="num-font" styleName="range-preview-text">{conditionNameParse}</p>
              {
                !!switchList1.length
                && (
                  <div>
                    <Popover.Menu
                      actions={switchList1?.map((item: any) => ({
                        ...item,
                        key: item?.conditionName,
                        text: item?.conditionName,
                        icon: null,
                      }))}
                      placement="bottomRight"
                      onAction={(node: any) => {
                        const { min, max, conditions } = node;
                        setConditionValue({ ...conditionValue, range: [min, max], conditions });
                        switch1({ ...node });
                      }}
                      getContainer={PopoverRef.current}
                      trigger="click"
                      styleName="popover-div"
                    >
                      <div styleName="drop-down-div">
                        <span styleName="selecte-value">
                          {chosenInfo?.conditionName || ''}
                        </span>

                        <DownFill color="#b5bbcf" />
                      </div>
                    </Popover.Menu>
                  </div>
                )
              }
            </div>

            {
              ratioName ? (
                <p styleName="sub-desc">
                  {ratioName}
                </p>
              ) : null
            }

            {
              chosenInfo?.customInputType ? (
                <div styleName="custom-text">
                  <div onClick={() => customClick()}>自定义</div>
                </div>
              ) : null
            }

            {
              chosenInfo && chosenInfo?.sectionVos ? (
                <div styleName="quick-select-range">
                  {
                    chosenInfo.sectionVos.length ? chosenInfo.sectionVos.map((item, index) => (
                      <div
                        styleName={quickRange === index ? 'item active' : 'item'}
                        key={`${item.name}-${item.value}-${index}`}
                        onClick={() => {
                          let value: any = null;
                          const idx = item.value.indexOf('~');
                          if (idx > -1) {
                            value = item.value.split('~').map(Number);
                          } else {
                            value = Number(item.value);
                          }
                          slide(value);
                          setQuickRange(index);
                        }}
                      >
                        {item.name}
                      </div>
                    )) : null
                  }
                </div>
              ) : null
            }
            <Slider
              min={chosenInfo.min}
              max={chosenInfo.max}
              value={rangeValue}
              step={chosenInfo?.scale || 1}
              range={!!chosenInfo.isRange}
              onAfterChange={(data) => {
                slide(data);
              }}
            />

            <div styleName="tick">
              <span>{chosenInfo.min}</span>
              <span>
                {chosenInfo.max}
                {chosenInfo.unit}
              </span>
            </div>
          </div>
        )
      }

      <PopupFooter getData={getData} confirmCallback={onMaskClick} />

      {/* 自定义输入框 */}
      <Dialog
        visible={customVisible}
        title={title}
        type={chosenInfo.isRange ? 'range' : 'alone'}
        range={{ min: customRange.min, max: customRange.max }}
        defaRange={{ min: chosenInfo.min, max: chosenInfo.max }}
        onClick={(type, data) => {
          if (type === 'cancel') {
            setCustomVisible(false);
          } else {
            slide(chosenInfo.isRange ? [data?.min || 0, data?.max || 0] : data?.max);
            setCustomVisible(false);
          }
        }}
      />
    </div>
  );
};

export default PopupSlider;
