import * as React from 'react';
import Loading from '@/platforms/mobile/components/loading/loading';
// import NoData from '@/platforms/mobile/components/no-data/no-data';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import TableInfo from '@mobile/mpa/modules/market/components/table-info/table-info';
import { dateTransformSymbol } from '@/platforms/mobile/mpa/modules/market/utils/date-transform-symbol';
import { useIntl } from 'react-intl';
import './hk-shareholder.scss';
import { useContext } from 'react';
import NoMessage from '@/platforms/mobile/components/no-message/no-message';
import { toUnit } from '@dz-web/o-orange';

interface IProps {
  tableData: any
}

const shareholderHeadArr = (language) => [
  {
    Header: 'nameDate',
    accessor: 'sd_name',
    subTitle: 'decl_date',
    Cell: ({ column, data, value, row }) => {
      const { index } = row;
      const { subTitle } = column;
      return (
        <>
          <span>{value}</span>
          <br />
          <span>{dateTransformSymbol(data[index][subTitle], '/')}</span>
        </>
      );
    },
  },
  {
    Header: 'stockCount',
    accessor: 'hold_vol',
    subTitle: 'operation',
    Cell: ({ column, data, value, row }) => {
      const { index } = row;
      const { subTitle } = column;
      return (
        <>
          <span styleName="share-holding">{toUnit(value, { lanType: language })}</span>
          <br />
          <span>{data[index][subTitle]}</span>
        </>
      );
    },
  },
  {
    Header: 'stockAfterCount',
    accessor: 'hold_vol_after',
    subTitle: 'hold_vol_ratio_after',
    Cell: ({ column, data, value, row }) => {
      const { index } = row;
      const { subTitle } = column;
      return (
        <>
          <span>{toUnit(value, { lanType: language })}</span>
          <br />
          <span>{data[index][subTitle] || '--'}</span>
        </>
      );
    },
  },
];

const HkShareholder:React.FC<IProps> = ({ tableData }) => {
  // const { formatMessage } = useIntl();
  const userConfig = useContext<any>(userConfigContext);
  const { language } = userConfig;

  return (
    <>
      {!tableData && (
        <div styleName="loading">
          <Loading isLoading />
        </div>
      )}
      {tableData && <TableInfo pageType="share" columns={shareholderHeadArr(language)} data={tableData} />}
      {tableData && !tableData.length && (
        <div styleName="nodata">
          {/*
          <NoData text={formatMessage({ id: 'noData' })} width="0.8rem" height="0.8rem" theme={userConfig.theme} /> */}
          <NoMessage />
        </div>
      )}
    </>
  );
};

export default HkShareholder;
