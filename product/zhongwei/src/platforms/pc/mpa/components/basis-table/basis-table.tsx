import { useRef, useState, useEffect } from 'react';
import { Table } from 'antd';
import classnames from 'classnames';
import './basis-table.scss';

interface TableProps {
  dataSource: Record<string, any>[]; // 数据源
  columns: Record<string, any>[]; // 表格列的配置
  rowKey: string; // 表格行 key 的取值
  isLoading: boolean; // 页面是否加载中
  pagination?: any; // 分页器 boolean: 是否显示
  size?: any; // 表格大小
  isJumpColor?: boolean; // 表格行是否跳色
  isShadow?: boolean; // 表格行下方是否展示线条
  fixedTitle?: boolean; // 表格锁定表头
  expandable?: Record<string, any>; // 表格行下方展开功能的配置
  onRow?: (record: any) => Record<string, any>; // 表格行下方展开功能的配置
}

const BaseTable: React.FC<TableProps> = (prop) => {
  const {
    dataSource,
    columns,
    pagination = false,
    rowKey,
    isLoading,
    size,
    isJumpColor = false,
    isShadow,
    expandable,
    fixedTitle = true,
    onRow = undefined,
  } = prop;

  const tableBoxRef = useRef<any>(null);
  const [tableHeight, setTableHeight] = useState(0);

  useEffect(() => {
    console.log(tableBoxRef, '----> tableRef.current');
    if (tableBoxRef.current) {
      // 计算表格body最大高度, 固定表头。
      // 40: 表头的高度
      const { height = 0 } = tableBoxRef.current.getBoundingClientRect();
      setTableHeight(height - 40);
    }
  }, [tableBoxRef.current]);

  return (
    <div
      ref={tableBoxRef}
      styleName={classnames('base-table', { 'table-color': isJumpColor, 'table-shadow': isShadow })}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowKey={rowKey}
        size={size || 'small'}
        scroll={fixedTitle ? { y: tableHeight } : undefined}
        expandable={expandable || {}}
        loading={isLoading}
        onRow={onRow}
      />
    </div>
  );
};

export default BaseTable;
