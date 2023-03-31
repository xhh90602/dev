/* eslint-disable implicit-arrow-linebreak */
import { ensure, toPositiveSign } from '@dz-web/o-orange';
import { getUnit } from '@mobile/helpers/native/unit';
import { getClassNameByPriceChange } from '@dz-web/quote-client';

export default function getDefaultColumn(formatMessage, raise = 'red'): any[] {
  const showRender = ({ value }) => {
    const { unit, multi } = getUnit(value, formatMessage);
    return ensure(value, undefined, () => (
      <div className={`content-item ${getClassNameByPriceChange(value)}`}>
        {`${toPositiveSign((value / multi).toFixed(2))}${unit}`}
      </div>
    ));
  };
  return [
    {
      label: <div className="table-title-label">{formatMessage({ id: 'deal_date' })}</div>,
      dataKey: 'tradeDay',
      width: '1.3rem',
      sortable: true,
      align: 'left',
      // render: ({ value }) => ensure(value, null, () => <div className="content-item first-list">{value}</div>),
      render: ({ value }) => ensure(value, undefined, () => <div className="content-item first-list">{value}</div>),
    },
    {
      label: formatMessage({ id: 'good_hold' }),
      dataKey: 'goodHold',
      width: '1.9rem',
      align: 'right',
      render: showRender,
    },
    {
      label: formatMessage({ id: 'call' }),
      dataKey: 'subscribe',
      width: '1.9rem',
      align: 'right',
      render: showRender,
    },
    {
      label: formatMessage({ id: 'bull' }),
      dataKey: 'cattleCard',
      width: '1.9rem',
      align: 'right',
      render: showRender,
    },
    {
      label: formatMessage({ id: 'bad_hold' }),
      dataKey: 'badHold',
      width: '1.9rem',
      align: 'right',
      render: showRender,
    },
    {
      label: formatMessage({ id: 'put' }),
      dataKey: 'put',
      width: '1.9rem',
      align: 'right',
      render: showRender,
    },
    {
      label: formatMessage({ id: 'bear' }),
      dataKey: 'bear',
      width: '1.9rem',
      align: 'right',
      render: showRender,
    },
  ];
}
