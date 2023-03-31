/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
import * as React from 'react';
import { useVirtual } from 'react-virtual';

import TableItem from './table-item';
import './index.scss';
import TableTitle, { ISortReturn } from './table-title';
import { normalToggleNativeGesture } from '../../helpers/native/msg';

const LoadingMore = () => <div styleName="loading-more">Loading...</div>;

export function convertUnit(
  target: string | number,
  rootFontSize = parseFloat(document.documentElement.style.fontSize),
) {
  const { width } = document.documentElement.getBoundingClientRect();

  if (!target) return 0;

  if (typeof target === 'number') return target;

  if (typeof target === 'string') {
    const pureTarget: number = Number.parseFloat(target);

    if (target.includes('px')) {
      return pureTarget;
    }

    if (target.includes('rem')) {
      return pureTarget * rootFontSize;
    }

    if (target.includes('%')) {
      return (pureTarget / 100) * width;
    }
  }

  return 40;
}

interface IRenderProps {
  rowData: Record<string, any>;
  value: any;
  index: number;
}

export interface ITableItemColumns {
  label: string | JSX.Element;
  dataKey: string;
  width?: string;
  className?: string;
  titleClassName?: string;
  sortable?: boolean;
  fixed?: boolean;
  align?: string;
  render?: (props: IRenderProps) => Element | JSX.Element | string;
}
type StrNum = string | number;
interface IDefaultProps {
  height: string;
  isLoading: boolean;
  isLoadingMore: boolean;
  scrollbg?: boolean;
  addDom: (v: {
    rowData: any,
    widthBox: React.CSSProperties
  }) => JSX.Element;
  onRowClick: (v: any) => void;
  loadingNode: React.ReactNode;
  loadingMoreNode: React.ReactNode;
  sort: (v: ISortReturn) => void;
  hiddenBox: any;
  titleHeight: StrNum;
  columnHeight: StrNum;
  onFooter: () => void | null;
  children: JSX.Element | null;
  wrapperPadding: [StrNum, StrNum];
  bodyHeight: StrNum;
  rootSize: number;
  childrenHeight: StrNum;
  onScroll: (e: HTMLDivElement) => void;
  colClassName: string;
  rowClassName: string;
  colTitleClassName: string;
  rowTitleClassName: string;
}

type IProps = {
  columns: ITableItemColumns[];
  data: Record<string, any>[];
} & Partial<IDefaultProps>;

let timeOut;

/**
 * 表格组件
 * @param columns 表头
 * -@parma sortable 排序
 * @param data 数据
 * @param height 表格数据高度
 * @param addDom 添加行
 * @param onRowClick 行点击事件
 * - active 选中高亮
 * @param sort 选中code
 * @param hiddenBox 隐藏盒子显示
 * @param onFooter 触底钩子函数
 */
const Table = (props, ref) => {
  const {
    columns,
    data,
    isLoading = false,
    isLoadingMore = false,
    loadingNode = '加载中...',
    loadingMoreNode = <LoadingMore />,
    wrapperPadding = [0, 0],
    addDom = null,
    onRowClick = () => ({}),
    scrollbg = true,
    sort = null,
    hiddenBox = <div style={{ textAlign: 'center', paddingTop: '10px' }}>暂无数据</div>,
    titleHeight = '',
    bodyHeight = 0,
    columnHeight = 'auto',
    onFooter = null,
    children = null,
    childrenHeight = 0,
    onScroll = (e) => null,
    colClassName = '',
    rowClassName = '',
    colTitleClassName = '',
    rowTitleClassName = '',
  } = props;
  const [sortName, setSortName] = React.useState('');
  const [topBoxScroll, setTopBoxScroll] = React.useState(0);
  const [showData, setShowData] = React.useState(data);

  React.useEffect(() => {
    setShowData(data);
  }, [data]);

  function sortNameChange(v) {
    if (v === sortName) return;
    setSortName(v);
  }

  // 表头数据过滤
  const title = React.useMemo(
    () =>
      columns.map((v) => ({
        label: v.label,
        dataKey: v.dataKey,
        width: v.width || '100px',
        sortable: v.sortable || false,
        fixed: v.fixed || false,
        align: v.align || 'left',
        className: v.titleClassName || '',
      })),
    [columns],
  );

  // 固定表格宽度计算
  const widthBox = React.useMemo(() => {
    const widthMap = columns.reduce((pre, val) => {
      const valWidth = convertUnit(val?.width || 0);
      return pre + valWidth;
    }, 0);

    const wrapperWidth = (wrapperPadding as [number, number]).reduce((pre, val) => pre + convertUnit(val), 0);

    return {
      width: `${widthMap - wrapperWidth}px`,
    };
  }, [columns, data, wrapperPadding]);
  const titleRef = React.useRef<any>(null);

  // 固定表头样式
  const fixedHeadStyle = React.useMemo<any>(() => {
    if (titleHeight) {
      return {
        position: 'absolute',
        // top: '0',
        top: `${topBoxScroll}px`,
        zIndex: '99',
        // transform: `translate3d(0, ${topBoxScroll}px, 0)`,
      };
    }

    return {};
  }, [titleHeight, topBoxScroll, titleRef.current]);

  const fixedTitleStyle = React.useMemo<any>(() => (titleHeight ? {
    paddingTop: `${titleHeight}px`,
  } : {}), [titleHeight]);

  const [childrenFlag, setChildrenFlag] = React.useState(data.map(() => false));

  function changeChildrenFlag(index) {
    setChildrenFlag(
      childrenFlag.map((v, i) => {
        if (i === index) {
          return !v;
        }
        return v;
      }),
    );
  }

  const resetChildrenFlag = () => {
    setChildrenFlag(
      childrenFlag.map(() => false),
    );
  };

  const tableTitleColumn = ({ titleData }) => (
    <table ref={titleRef} cellSpacing="0" style={{ ...widthBox, ...fixedHeadStyle }}>
      <thead>
        <tr className={rowTitleClassName}>
          {titleData.map((v: any, i) => (
            <TableTitle
              resetChildrenFlag={resetChildrenFlag}
              columns={titleData}
              key={v.dataKey}
              currentData={data}
              data={showData}
              setData={setShowData}
              sort={sort}
              item={v}
              index={i}
              sortNameChange={(val) => sortNameChange(val)}
              sortName={sortName}
              titleHeight={String(titleHeight)}
              colClassName={colTitleClassName}
            />
          ))}
        </tr>
      </thead>
    </table>
  );

  const columnsStyle = React.useMemo<any>(
    () =>
      titleHeight
        ? {
            overflow: 'hidden scroll',
            maxHeight: '100%',
          }
        : {
            overflow: 'hidden scroll',
          },
    [titleHeight],
  );

  const containerRef = React.useRef<any>(null);
  const wrapperRef = React.useRef<any>(null);

  const list = useVirtual({
    size: data.length,
    parentRef: containerRef,
    estimateSize: React.useCallback(
      (index) => {
        const height = convertUnit(columnHeight);
        const childrenPure = convertUnit(childrenHeight);

        if (childrenFlag[index]) {
          return height + childrenPure;
        }

        return height;
      },
      [childrenFlag],
    ),
    overscan: 10,
    paddingStart: titleHeight ? convertUnit(titleHeight) : 0,
    paddingEnd: isLoadingMore ? convertUnit('0.64rem') : 0,
  });

  const bodyStyle = React.useMemo<any>(() => {
    const commonStyle = {
      overflow: 'hidden auto',
      ...widthBox,
    };

    if (bodyHeight) {
      console.log(bodyHeight, '----> bodyHeight');
      return {
        height: `${convertUnit(bodyHeight)}px`,
        ...commonStyle,
      };
    }
    return commonStyle;
  }, [bodyHeight, widthBox]);

  const onScrollX = (e: any) => {
    // x轴滚动
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      const el = e.target?.parentElement?.parentElement?.parentElement;

      if (e.target?.scrollLeft) {
        el?.setAttribute('data-scroll', 'true');
      } else {
        el?.setAttribute('data-scroll', 'false');
      }
      if (parseFloat(widthBox.width) > (
        wrapperRef.current?.clientWidth
        + e.target?.scrollLeft + 3
      ) && scrollbg) {
        el?.setAttribute('data-end-scroll', 'true');
      } else {
        el?.setAttribute('data-end-scroll', 'false');
      }
    }, 100);
  };

  const handLeave = React.useRef(true);

  const onScrollY = (e: any) => {
    const hasTitle = titleRef.current && titleRef.current.style;

    if (hasTitle && topBoxScroll) {
      titleRef.current.style.top = 0;
      titleRef.current.style.visibility = 'hidden';
    }

    if (!e.target.scrollTop && hasTitle) {
      titleRef.current.style.visibility = 'visible';
    }

    onScroll(e);
    // y轴滚动
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      setTopBoxScroll(e.target.scrollTop);
      if ((handLeave.current || !topBoxScroll) && hasTitle) {
        titleRef.current.style.visibility = 'visible';
      }

      if (!e.target || !onFooter) return;
      if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight - 10 < 0) {
        onFooter();
      }
    }, 100);
  };

  React.useEffect(() => () => {
    clearTimeout(timeOut);
  }, []);

  React.useEffect(() => {
    setChildrenFlag(showData.map(() => false));
  }, [showData.length]);

  const showContent = React.useCallback(
    (content) => {
      if (isLoading) {
        return <div style={{ height: '100%', textAlign: 'center', padding: '20px 0' }}>{loadingNode}</div>;
      }

      if (!showData.length) {
        return hiddenBox;
      }

      return content;
    },
    [isLoading, loadingNode, hiddenBox, showData],
  );

  const tableRef = React.useRef<any>(null);

  React.useLayoutEffect(() => {
    if (tableRef.current && (parseFloat(widthBox.width) > wrapperRef.current?.clientWidth) && scrollbg) {
      tableRef.current?.setAttribute('data-end-scroll', 'true');
    }
  }, [widthBox, wrapperRef, tableRef]);

  return (
    <div
      ref={tableRef}
      styleName="--table"
      data-end-scroll="false"
      data-scroll="false"
      data-scrolltime="false"
      onTouchStart={() => normalToggleNativeGesture(0)}
      onTouchEnd={() => normalToggleNativeGesture(1)}
    >
      {bodyHeight ? (
        <div
          ref={containerRef}
          style={{
              ...bodyStyle,
              width: '100%',
            }}
          onScroll={onScrollY}
          onTouchStart={() => {
              handLeave.current = false;
            }}
          onTouchEnd={() => {
              handLeave.current = true;
              titleRef.current.style.visibility = 'visible';
            }}
        >
          <div
            ref={wrapperRef}
            styleName="wrapper-table-box"
            style={{
                height: `${((!showData.length || isLoading) && convertUnit(bodyHeight)) || list.totalSize}px`,
                ...fixedTitleStyle,
              }}
            onScroll={onScrollX}
          >
            {tableTitleColumn({ titleData: title })}
            {showContent(
                list.virtualItems.map((item: any) => (
                  <TableItem
                    // eslint-disable-next-line react/no-array-index-key
                    key={item.index}
                    {...{
                      fixedBodyStyle: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        transform: `translateY(${item.start}px)`,
                      },
                      widthBox,
                      index: item.index,
                      dataItem: showData[item.index],
                      columns,
                      onRowClick,
                      addDom,
                      columnHeight,
                      item,
                      childrenFlag: childrenFlag[item.index],
                      changeChildrenFlag,
                      rowClassName,
                      colClassName,
                    }}
                  />
                )),
              )}
            {/* 加载更多 */}
            {isLoadingMore && (
            <div styleName="loading-more" style={{ position: 'absolute', bottom: '0' }}>
              {loadingMoreNode}
            </div>
              )}
          </div>
        </div>
        ) : (
          <div
            style={columnsStyle}
            ref={ref}
            onScroll={onScrollY}
          >
            <div style={{ ...bodyStyle, width: '100%' }}>
              <div
                styleName="wrapper-table-box"
                ref={wrapperRef}
                style={fixedTitleStyle}
                onScroll={onScrollX}
              >
                {tableTitleColumn({ titleData: title })}
                {showContent(
                  showData.map((v: any, i: number) => (
                    <TableItem
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      {...{
                        fixedBodyStyle: {},
                        widthBox,
                        index: i,
                        dataItem: showData[i],
                        columns,
                        onRowClick,
                        columnHeight,
                        addDom,
                        childrenFlag: childrenFlag[i],
                        changeChildrenFlag,
                        rowClassName,
                        colClassName,
                      }}
                    />
                  )),
                )}
                {/* 加载更多 */}
                {isLoadingMore && <div styleName="loading-more">{loadingMoreNode}</div>}
              </div>
            </div>
          </div>
        )}
      <div styleName="sticky-children">{children}</div>
    </div>
  );
};

export default React.forwardRef<any, IProps>(Table);
