import { ITableItemColumns } from '@/platforms/mobile/components/table-list/table-list';
import { getObjArrAttribute, numberClass, sliceString, thousandsChange } from '@/utils';
import { isArray, isNumber } from 'lodash-es';

interface Label {
  label: string | Array<string | JSX.Element> | JSX.Element;
  headerClassName?: string;
  split?: string;
}

export const setLabel = (props: Label) => {
  const { label: name, headerClassName = '', split = '|' } = props;
  let label = name;
  /** 如果为数组，使用split拼接 */
  if (isArray(name)) {
    label = name.map((n, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <span key={i}>
        {n}
        {i + 1 < name.length && split}
      </span>
    ));
  }
  return <div className={headerClassName}>{label}</div>;
};

interface ColItemProps {
  className?: string;
  color?: string; // 字体颜色
  size?: number; // 字体大小
  bold?: boolean; // 粗体
  riseFullColor?: boolean; // 应用涨跌颜色
  thousands?: boolean; // 千分位
  suffix?: string | JSX.Element; // 后缀
  map?: { name: string | JSX.Element; val: any }[];
}
export const setSingleValColItem = (
  key: string, // dataKey
  props: ColItemProps = {},
) => {
  const {
    className = '',
    color = '',
    size = 0,
    bold = false,
    riseFullColor = false,
    thousands = false,
    suffix = '',
    map = [],
  } = props;
  // eslint-disable-next-line func-names
  return function ({ rowData }) {
    let val = rowData[key];
    let classNames = `${className} `;

    if (color && !riseFullColor) classNames += `color-${color} `;
    if (size) classNames += `f-s-${size} `;
    if (bold) classNames += 'f-bold ';

    if (map.length > 0) {
      val = getObjArrAttribute(map, 'val', val, 'name');
    } else {
      if (isNumber(Number(val))) classNames += 'num-font ';
      if (thousands) val = thousandsChange(rowData[key]);
      if (riseFullColor) {
        classNames += numberClass(rowData[key], 'color-rise', 'color-full');
        if (isNumber(Number(val))) {
          val = sliceString(rowData[key], { sign: true });
        }
      }
    }

    return (
      <div className={classNames}>
        {val}
        {suffix}
      </div>
    );
  };
};

interface ColumnProps extends Label {
  colItemProps?: ColItemProps;
  className?: ITableItemColumns['className'];
  titleClassName?: ITableItemColumns['titleClassName'];
  sortable?: ITableItemColumns['sortable'];
  fixed?: ITableItemColumns['fixed'];
  align?: ITableItemColumns['align'];
  dataKey: ITableItemColumns['dataKey'];
  width?: ITableItemColumns['width'];
  render?: ITableItemColumns['render'];
}

export const setColumn = (props: ColumnProps) => {
  const {
    label,
    split = '|',
    headerClassName = '',
    colItemProps = {},
    dataKey,
    width = '25%',
    className = '',
    titleClassName = '',
    sortable = false,
    fixed = false,
    align = 'right',
    render = setSingleValColItem(dataKey, colItemProps),
  } = props;
  return {
    label: setLabel({ label, headerClassName, split }),
    dataKey,
    width,
    className,
    titleClassName,
    sortable,
    fixed,
    align,
    render,
  };
};
