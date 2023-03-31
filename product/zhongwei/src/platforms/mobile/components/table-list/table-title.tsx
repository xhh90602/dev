/* eslint-disable react/require-default-props */
import { orderBy } from 'lodash-es';
import * as React from 'react';
import { itemStyle, itemStyleName } from './helper';
import './index.scss';

export interface ISortReturn {
  type: ArrowType;
  data: any;
  index: number;
  key: string;
}

interface ITitleProps {
  resetChildrenFlag?: any;
  data: any;
  sort?: (v: ISortReturn) => void;
  item: any;
  index: number;
  sortNameChange?: (v) => void;
  sortName?: string;
  titleHeight?: string;
  columns: any;
  setData: any;
  currentData: any;
  colClassName?: string;
}

type ArrowType = '' | 'up' | 'down';

// 状态文本
function* arrowTypeText() {
  yield 'up';
  yield 'down';
  return '';
}

// 上下默认箭头
const Arrow = ({ type, click }) => (
  <div onClick={click} className={`${type} arrow_icon`}>
    <div className="up_arrow" />
    <div className="down_arrow" />
  </div>
);

/**
 * 表头
 * @param data 表格数据
 * @param sort 排序回调函数
 * @param item 当前表头参数
 * @param index 第几个
 * @param sortNameChange 当前排序名称切换
 * @param sortName 当前排序的名称
 */
const TableTitle = (props: ITitleProps) => {
  const {
    data, setData, currentData, sort, item, index, sortNameChange = () => undefined, sortName, titleHeight, columns,
    resetChildrenFlag,
    colClassName = '',
  } = props;
  const [arrowType, setArrowType] = React.useState<ArrowType>('');
  const arrowTypeTextRef = React.useRef<Generator>(arrowTypeText());

  // 重置排序状态
  function resetSortType() {
    arrowTypeTextRef.current = arrowTypeText();
  }

  const arrowTypeComputed = React.useMemo(() => (item.dataKey === sortName ? arrowType : ''), [arrowType, sortName]);

  const tdStyle = React.useMemo(() => ({
    textAlign: item.align || 'left',
    height: titleHeight || 'auto',
    width: item.width,
    left: item.fixed
      ? `calc(${columns.slice(0, index).reduce(
        (pre: any, val: { width: any }) => (`${pre} + ${val.width}`),
        '0rem',
      )}) ` : '0',
  }), [item]);

  const className = React.useMemo(() => {
    let name = colClassName;
    if (item.className) {
      name += ` ${item.className}`;
    }
    return name;
  }, [item.className, colClassName]);

  return (
    <th
      className={className}
      styleName={`${itemStyleName(item.fixed)}`}
      style={tdStyle}
    >
      <div
        style={{
          height: titleHeight || 'auto',
        }}
        className={item.sortable ? '__arrow_padding' : ''}
      >
        {item.label}
      </div>
      {
          item.sortable && (
            <Arrow
              click={() => {
                if (!item.sortable) return;
                // 箭头切换 -- start
                const { value, done } = arrowTypeTextRef.current.next();
                setArrowType(value);

                if (done) resetSortType();

                sortNameChange(item.dataKey);
                const sortReturn: ISortReturn = {
                  data: data[index],
                  key: item.dataKey,
                  index,
                  type: value,
                };

                if (resetChildrenFlag) {
                  resetChildrenFlag();
                }

                if (sort) {
                  sort(sortReturn);
                  return;
                }

                if (value) {
                  setData(
                    orderBy(data, [item.dataKey], value === 'up' ? 'asc' : 'desc'),
                  );
                  return;
                }
                setData(currentData);
                // 箭头切换 -- end
              }}
              type={arrowTypeComputed}
            />
          )
        }
    </th>
  );
};

TableTitle.defaultProps = {
  sort: () => ({}),
  sortNameChange: () => ({}),
  sortName: '',
  titleHeight: 'auto',
};

export default TableTitle;
