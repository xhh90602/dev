/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { DatePicker, Picker } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';

import TableList from '@mobile/components/table-list/table-list';

import StockDetailTabs from '@mobile/mpa/modules/market/components/stock-detail-tabs/stock-detail-tabs';
import { getUrlParam } from '@/utils';

import './oversell-rank.scss';
import { useGetUserConfig } from '@/helpers/multi-platforms';
import NoMessage from '@/platforms/mobile/components/no-message/no-message';
import getDefaultColumn from '../../components/get-column/get-column';

const tabData = [
  {
    value: 1,
    label: 'short_sales_per_day_number',
  },
  {
    value: 2,
    label: 'short_sales_per_day_ratio',
  },
  {
    value: 3,
    label: 'short_sales_average_per_day_number',
  },
  {
    value: 4,
    label: 'short_sales_average_per_day_ratio',
  },
  {
    value: 5,
    label: 'take_position_number',
  },
  {
    value: 6,
    label: 'take_position_ratio',
  },
];

const beforeTimeTab = [
  {
    value: 1,
    label: 'last_week',
  },
  {
    value: 2,
    label: 'last_mount',
  },
];

const bazaarOptions = [
  {
    label: '港股',
    value: '1',
  },
  {
    label: '美股',
    value: '2',
  },
];

const getBeforeDate = (num, precision, format = 'YYYY-MM-DD') => {
  const date: any[] = [];
  for (let i = 0; i < num; i++) {
    date.push({
      label: dayjs().subtract(i, precision).format(format),
      value: dayjs().subtract(i, precision).format(format),
    });
  }

  return date;
};

const SelectNav: React.FC = ({ value, onChange }) => {
  const [bazaar, setBazaar] = useState('1');
  // const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [pickerType, setPickerType] = useState('');

  return (
    <>
      {/* <div
        styleName="bazaar-select"
        className="flex-c-between"
        onClick={() => {
          setPickerType('bazaar');
          console.log(pickerType);
        }}
      >
        <span>{bazaarOptions.find((item) => item.value === bazaar)?.label}</span>
        <DownOutline />
      </div> */}
      <div
        styleName="date-select"
        className="flex-c-between"
        onClick={() => {
          setPickerType('date');
          console.log(pickerType);
        }}
      >
        <span className="num-font">
          {value}
          {/* {dayjs(date).format('MM/DD/YYYY')} */}
        </span>
        <DownOutline />
      </div>

      <Picker
        columns={[bazaarOptions]}
        visible={pickerType === 'bazaar'}
        onClose={() => {
          setPickerType('');
          console.log(pickerType);
        }}
        onConfirm={(v) => {
          if (v[0]) setBazaar(v[0]);
        }}
      />
      {/* <DatePicker
        title="日期选择"
        precision="week"
        visible={pickerType === 'date'}
        onClose={() => {
          setPickerType('');
        }}
        max={new Date()}
        onConfirm={(val) => {
          setDate(val);
        }}
      /> */}
      <Picker
        columns={[getBeforeDate(24, 'week')]}
        visible={pickerType === 'date'}
        onClose={() => {
          // setVisible(false);
          setPickerType('');
        }}
        value={[value]}
        onConfirm={(val) => {
          // setValue(v);
          console.log(val, 'val');
          onChange(val[0]);
          // setDate(val[0]);
        }}
      />
    </>
  );
};

const OversellAnalyze: React.FC = () => {
  const { wsClient, isWsClientReady } = useQuoteClient();
  const { formatMessage } = useIntl();
  const { language } = useGetUserConfig();

  const [listType, setListType] = useState<string|number>('1');
  const [listDateAvg, setListDateAvg] = useState<string | number>('1');
  const [listDate, setListListDate] = useState<string>('2022-07-05');

  const [tableData, setTableData] = useState<any[]>([]);

  // const { code } = getUrlParam();

  const getValue = (val: string) => {
    console.log(val);
    setListType(val);
  };

  useEffect(() => {
    if (!isWsClientReady) return;

    let bodyParam = {
      list_type: listType,
      language,
      list_date: listDate,
      // list_date_avg: 2,
      column: 'ss_volume',
      asc: 0,
      page_num: 1,
      page_size: 10,
    };

    if (listType === 3 || listType === 4) {
      bodyParam = { ...bodyParam, list_date_avg: listDateAvg };
    }

    wsClient
      ?.send({
        mf: '7',
        sf: '3006',
        body: {
          ...bodyParam,
        },
      })
      .then((res) => {
        if (res.code !== 0) return;

        const { body } = res;
        setTableData(body);

        // body.record_dates = body.record_dates.map((item) => dayjs(item).format('MM/DD'));

        // setTakePositionAmountData(body);
      })
      .catch((err) => console.log(err, '空頭持倉數量 err'));
  }, [isWsClientReady, listType, listDateAvg, listDate]);

  return (
    <div styleName="container">
      <div styleName="tab-nav">
        <StockDetailTabs tabData={tabData} onChange={(value) => getValue(value)} styles={{ background: '#ebedf5' }} />
      </div>

      <div styleName="select-nav" className="flex-c-between">
        {listType === 3 || listType === 4 ? (
          <StockDetailTabs
            tabData={beforeTimeTab}
            onChange={(value) => setListDateAvg(value)}
            styles={{ background: '#ebedf5' }}
          />
        ) : (
          <SelectNav value={listDate} onChange={(v) => setListListDate(v)} />
        )}
      </div>

      <div styleName="rank">
        <TableList
          data={tableData}
          wrapperPadding={['0.32rem', '0.32rem']}
          hiddenBox={<NoMessage />}
          columns={getDefaultColumn(formatMessage, listType)}
          titleHeight={28}
          columnHeight={28}
        />
      </div>
    </div>
  );
};

export default OversellAnalyze;
