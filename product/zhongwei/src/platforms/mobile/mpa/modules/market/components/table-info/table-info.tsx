import * as React from 'react';
import { useTable } from 'react-table';
import { useIntl } from 'react-intl';
import { useEffect, useRef } from 'react';
import './table-info.scss';

interface IProps {
  columns: any[],
  data: any[]
  nextPage?: () => void
  pageType: string
}

const TableInfo:React.FC<IProps> = ({ columns = [], data = [], nextPage, pageType }) => {
  const domRef = useRef<HTMLTableSectionElement | null>(null);
  const timerRef = useRef(null);
  const { formatMessage } = useIntl();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });
  const tableProps = getTableProps().role;
  const tableBodyProps = getTableBodyProps().role;

  useEffect(() => {
    if (!domRef.current) return null;
    const scrollHandle = () => {
      const { scrollTop, scrollHeight, clientHeight } = domRef.current;
      clearTimeout(timerRef.current);
      if (scrollTop + clientHeight + 30 > scrollHeight) {
        timerRef.current = setTimeout(() => {
          nextPage();
        }, 100);
      }
    };
    const scrollDom = domRef.current;
    scrollDom.addEventListener('scroll', scrollHandle);
    return () => scrollDom.removeEventListener('scroll', scrollHandle);
  }, [domRef.current]);

  return (
    <div styleName="table-wrap">
      <table role={tableProps}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr role={headerGroup.getHeaderGroupProps().role}>
              {headerGroup.headers.map((column) => (
                <th role={column.getHeaderProps().role}>{formatMessage({ id: column.render('Header') })}</th>
              ))}
            </tr>
          ))}
        </thead>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <tbody role={tableBodyProps} ref={domRef} style={{ position: `${pageType === 'dividend' ? 'absolute' : ''}` }}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr role={row.getRowProps().role}>
                {row.cells.map((cell) => <td role={cell.getCellProps().role}>{cell.render('Cell')}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

TableInfo.defaultProps = {
  nextPage: () => console.log(''),
};

export default TableInfo;
