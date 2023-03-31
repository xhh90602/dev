import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { SearchOutlined } from '@ant-design/icons';
import { FORM_ITEM_TYPE } from '@pc/constants/config';
import { getSubscribeRecord } from '@/api/module-api/ipo';
import dayjs from 'dayjs';

export interface IUseIpo {
  isLoading: boolean;
  subscribeRecords: any[];
  searchFormConfig: Record<string, any>[] | Record<string, any>[][];
  searchData: Record<string, any>;
}

const forMat = 'YYYY-MM-DD';
const initData = {
  type: '',
  status: '',
  stockName: '',
  startDate: '',
  endDate: '',
  orderStartDate: '',
  orderEndDate: '',
  dateRange: '',
};

export default function useIpoSubscribeRecord(): IUseIpo {
  const { formatMessage } = useIntl();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subscribeRecords, setSubscribeRecords] = useState<any[]>([]);
  const [searchData, setSearchData] = useState<Record<string, any>>({ ...initData });

  const searchFormConfig = useMemo(
    () => [
      [
        {
          id: 1,
          type: FORM_ITEM_TYPE.SELECT,
          label: '中签状态',
          placeholder: '请选择状态',
          value: searchData.status,
          options: [
            {
              label: '全部',
              value: '',
            },
            {
              label: formatMessage({ id: '申购中' }),
              value: '1',
            },
            {
              label: formatMessage({ id: '已中签' }),
              value: '2',
            },
            {
              label: formatMessage({ id: '未中签' }),
              value: '3',
            },
            {
              label: formatMessage({ id: '取消申购' }),
              value: '4',
            },
          ],
          onChange: (val: string) => {
            setSearchData({ ...searchData, status: val });
          },
        },
        {
          id: 2,
          type: FORM_ITEM_TYPE.INPUT,
          label: '股票',
          placeholder: '请输入股票名称/代码',
          prefix: <SearchOutlined />,
          value: searchData.stockName,
          onChange: (e: any) => {
            const val = e.target.value;
            setSearchData({ ...searchData, stockName: val });
          },
        },
        {
          id: 3,
          type: FORM_ITEM_TYPE.SELECT,
          label: '认购方式',
          placeholder: '请选择认购方式',
          value: searchData.type,
          options: [
            {
              label: formatMessage({ id: '全部' }),
              value: '',
            },
            {
              label: formatMessage({ id: '现金认购' }),
              value: 'Z',
            },
            {
              label: formatMessage({ id: '融资认购' }),
              value: 'O',
            },
          ],
          onChange: (val: string) => {
            setSearchData({ ...searchData, type: val });
          },
        },
      ],
      [
        {
          id: 4,
          type: FORM_ITEM_TYPE.DATE_RANGE,
          label: '认购时间',
          startDateConfig: {
            value: searchData.orderStartDate,
            onChange: (date: string) => {
              setSearchData({ ...searchData, orderStartDate: date });
            },
          },
          endDateConfig: {
            value: searchData.orderEndDate,
            onChange: (date: string) => {
              setSearchData({ ...searchData, orderEndDate: date });
            },
          },
        },
        {
          id: 5,
          type: FORM_ITEM_TYPE.DATE_RANGE,
          label: '公布时间',
          startDateConfig: {
            value: searchData.startDate,
            onChange: (date: string) => {
              setSearchData({ ...searchData, startDate: date });
            },
          },
          endDateConfig: {
            value: searchData.endDate,
            onChange: (date: string) => {
              setSearchData({ ...searchData, endDate: date });
            },
          },
        },
        {
          id: 6,
          type: FORM_ITEM_TYPE.RADIO_GROUP,
          optionType: 'button',
          buttonStyle: 'solid',
          value: searchData.dateRange,
          options: [
            {
              label: formatMessage({ id: '今天' }),
              value: 1,
            },
            {
              label: formatMessage({ id: '近一周' }),
              value: 2,
            },
            {
              label: formatMessage({ id: '近1月' }),
              value: 3,
            },
            {
              label: formatMessage({ id: '近3月' }),
              value: 4,
            },
          ],
          onChange: (e: any) => {
            const val = e.target.value;
            let startDate: any;

            switch (val) {
              case 2:
                startDate = dayjs().subtract(7, 'days');
                break;
              case 3:
                startDate = dayjs().subtract(30, 'days');
                break;
              case 4:
                startDate = dayjs().subtract(90, 'days');
                break;
              default:
                startDate = dayjs();
                break;
            }
            setSearchData({ ...searchData, dateRange: val, startDate, endDate: dayjs() });
          },
        },
        {
          id: 7,
          type: FORM_ITEM_TYPE.BUTTON,
          btnLabel: '重置',
          onClick: () => {
            setSearchData({ ...initData });
            fetchRecord({ ...initData });
          },
        },
        {
          id: 8,
          type: FORM_ITEM_TYPE.BUTTON,
          btnType: 'primary',
          btnLabel: '查询',
          onClick: () => {
            fetchRecord({ ...searchData });
          },
        },
      ],
    ],
    [searchData],
  );

  const fetchRecord = (data = searchData) => {
    const { startDate, endDate, orderStartDate, orderEndDate } = data;

    const params: Record<string, any> = {
      ...data,
      startDate: startDate ? startDate.format(forMat) : startDate,
      endDate: endDate ? endDate.format(forMat) : endDate,
      orderStartDate: orderStartDate ? orderStartDate.format(forMat) : orderStartDate,
      orderEndDate: orderEndDate ? orderEndDate.format(forMat) : orderEndDate,
    };

    delete params.dateRange;

    getSubscribeRecord(params)
      .then((res) => {
        if (res?.code === 0) {
          setSubscribeRecords(res?.result);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);

    fetchRecord();
  }, []);

  return {
    isLoading,
    subscribeRecords,
    searchFormConfig,
    searchData,
  };
}
