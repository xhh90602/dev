import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import dayjs from 'dayjs';
import { useSearchParam } from 'react-use';
import { Switch, Popover, Toast, InfiniteScroll } from 'antd-mobile';
import { getStrategyChangeList } from '@/api/module-api/strategy';
import { getSelf } from '@/api/module-api/combination';
import { goBack, goToSymbolPage } from '@/platforms/mobile/helpers/native/msg';
import { getClassNameByPriceChange, getMarketCategoryTag } from '@dz-web/quote-client';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import { userConfigContext } from '@mobile/helpers/entry/native';
import { FormattedMessage, useIntl } from 'react-intl';
import IconBack from '@/platforms/mobile/images/icon_back_black.svg';
import IconAbnormalType from '@/platforms/mobile/images/icon_filter_outline.svg';
import CheckedIcon from '@/platforms/mobile/images/icon_circle_checked.svg';
import UncheckedIcon from '@/platforms/mobile/images/icon_circle_unchecked.svg';
import Loading from '@/platforms/mobile/components/combination/loading';
import Empty from '@/platforms/mobile/components/combination/empty';
import { useGetState } from 'ahooks';
import './abnormal-detail.scss';
import { CheckTradeTime } from '@/utils/checkTradeTime';

const AbnormalDetail: React.FC = () => {
  const cardRef = useRef(null);
  const { formatMessage } = useIntl();
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 0;
  const [changeType, setChangeType] = useState<string>('');
  const [timeType, setTimeType] = useState<boolean>(false);
  const [checkedValue, setCheckedValue] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string[]>([]);
  const [selfList, setSelfList] = useState<any>([]);
  const [tableList, setTableList, getTableList] = useGetState<any>([]);
  const [changeList, setChangeList, getChangeList] = useGetState<any>([]);
  const [lang, setLang] = useState('zh-CN');
  const [isInit, setInit] = useState<boolean>(true);
  const [pages, setPages, getPage] = useGetState<any>({ pageNum: 0, pageSize: 50, pageTotal: 0 });
  const userConfig = useContext<any>(userConfigContext);

  const timer = useRef<any>(null);

  const selectList = [
    { key: '', name: '全部' },
    { key: '1', name: `${formatMessage({ id: 'up_and_down_by' })}5%` },
    { key: '2', name: `${formatMessage({ id: 'up_and_down_by' })}10%` },
    { key: '3', name: `${formatMessage({ id: 'up_and_down_by' })}20%` },
    // { key: '4', name: `${formatMessage({ id: 'up_and_down_by' })}20%以上` },
  ];

  const actionList = () => selectList.map(({ key, name }) => ({
    key,
    text: (
      <span styleName={changeType === key ? 'selected-active-style' : ''}>
        {name}
      </span>
    ),
  }));

  const dateFormat = (date = new Date()) => {
    const time = dayjs(date).format('YYYY/MM/DD').split('/');
    setCurrentTime(time);
  };

  const dataDiff = () => {
    let temp = [];
    if (selfList && selfList.length) {
      selfList.forEach((item) => {
        const arr = tableList.filter(
          (ele) => item.stockCode === ele.code && item.marketCode === (ele.market).toString(),
        );
        temp = temp.concat(arr);
      });
    }
    setLoading(false);
    setTableList(temp);
  };

  const getSelfList = () => {
    getSelf({}).then((res) => {
      if (res && res.code === 0 && res?.result && res?.result.length) {
        const data = res?.result[0];
        if (data && data?.stocks) {
          setSelfList(data?.stocks || []);
        } else {
          setSelfList([]);
        }
      }
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
    });
  };

  const getList = async (scroll = false) => {
    if (!hasMore) return;
    const { pageNum, pageSize } = getPage();
    const num = scroll ? pageNum + 1 : pageNum;
    try {
      await getStrategyChangeList({
        changeType,
        timeType: timeType ? 1 : 0,
        pageSize,
        pageNum: num,
      }).then((res) => {
        if (res && res?.code === 0) {
          const result = res?.result;
          if (result) {
            let temp = [];
            if (scroll) {
              temp = getTableList().concat(result?.records || []);
            } else {
              temp = result?.records || [];
            }
            const { current, size, total } = result;
            setPages({ pageNum: current, pageSize: size, pageTotal: total });
            setTableList([...temp]);
            setChangeList([...temp]);
            if (result.records && result.records.length !== pageSize && total === pages.pageTotal) {
              setHasMore(false);
            }
            setInit(false);
            dateFormat((result?.records && result?.records[0] && result?.records[0]?.time) || new Date());
          }
        } else {
          Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${res?.message}` });
        }
        setLoading(false);
      }).catch((err) => {
        setLoading(false);
        setTableList(tableList && tableList.length ? tableList : []);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      setLoading(false);
      setTableList(tableList && tableList.length ? tableList : []);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  const initerVal = () => {
    timer.current = window.setInterval(() => {
      if (CheckTradeTime({ marketType: 'HK' })) {
        getList();
      }
    }, 3000);
  };

  useEffect(() => {
    if (isInit) return;
    if (checkedValue) {
      if (selfList && selfList.length) {
        dataDiff();
      } else {
        setTableList([]);
      }
    } else {
      setTableList(changeList);
    }
  }, [checkedValue]);

  useEffect(() => {
    if (checkedValue) {
      if (tableList && tableList.length && selfList && selfList.length) {
        dataDiff();
      }
    }
  }, [tableList]);

  useEffect(() => {
    new Promise((resolve) => {
      setLoading(true);
      setHasMore(true);
      setPages({ pageNum: 0, pageSize: 50, pageTotal: 0 });
      setTableList(() => []);
      setChangeList(() => []);
      window.clearInterval(timer.current);
      resolve(true);
    }).then((res) => {
      if (res) {
        getList();
        initerVal();
      }
    });
  }, [changeType, timeType]);

  useEffect(() => {
    if (userConfig) {
      setLang(userConfig?.language || 'zh-CN');
      dateFormat();
    }
  }, [userConfig]);

  useEffect(() => {
    getSelfList();
    initerVal();
    return () => {
      window.clearInterval(timer.current);
    };
  }, []);

  // 市场转换
  const tradeMarketTransform = { HK: IconHK, SZ: IconSZ, SH: IconSH, US: IconUS };

  const fixed = (val) => (val ? (val * 100).toFixed(2) : 0.00);

  // 异动类型
  const changeTypeText = (type) => {
    let text = '';
    switch (type) {
      case '1':
        text = `${formatMessage({ id: 'soaring' })}5%`;
        break;
      case '2':
        text = `${formatMessage({ id: 'soaring' })}10%`;
        break;
      case '3':
        text = `${formatMessage({ id: 'soaring' })}15%`;
        break;
      case '4':
        text = `${formatMessage({ id: 'soaring' })}20%`;
        break;
      case '5':
        text = `${formatMessage({ id: 'plunge' })}5%`;
        break;
      case '6':
        text = `${formatMessage({ id: 'plunge' })}10%`;
        break;
      case '7':
        text = `${formatMessage({ id: 'plunge' })}15%`;
        break;
      case '8':
        text = `${formatMessage({ id: 'plunge' })}20%`;
        break;
      default:
        text = '';
        break;
    }
    return text;
  };

  const goStock = ({ market, code }) => {
    goToSymbolPage({ market, code });
  };

  const listDom = useMemo(() => {
    if (isLoading) {
      return (
        <div styleName="loading">
          <Loading />
        </div>
      );
    }
    if (tableList && tableList.length) {
      return (
        tableList.map((item: any) => (
          <div styleName="item" key={`${item.price}-${item.code}-${item.time}-${item.riseRate}`}>
            <div styleName="stock-info c1" onClick={() => goStock({ ...item })}>
              <div styleName="name">{lang === 'zh-CN' ? item.name : item.nameTw}</div>
              <div styleName="market-code">
                <img
                  styleName="market"
                  src={tradeMarketTransform[getMarketCategoryTag(item?.market) || '']}
                  alt=""
                />
                <div styleName="code">{item.code}</div>
              </div>
            </div>
            <div styleName="date c2">{`${dayjs(item.time).format('HH:mm:ss')}`}</div>
            <div
              styleName="value c3"
              className={getClassNameByPriceChange(item.riseRate)}
            >
              {`${fixed(item.riseRate)}%`}
            </div>
            <div styleName="value c4">{changeTypeText(item.monitorType)}</div>
          </div>
        ))
      );
    }
    return (
      <div styleName="empty-box">
        <Empty type="strategy" />
      </div>
    );
  }, [tableList, isLoading]);

  return (
    <div styleName="abnormal-detail">
      <div styleName="sticky">
        <div styleName="full-content">
          <div styleName="head-top" style={{ paddingTop: `${+safeAreaTop}px` }}>
            <img styleName="back-img" src={IconBack} alt="" onClick={() => goBack()} />
            <div styleName="title">{formatMessage({ id: 'abnormal' })}</div>
            <Popover.Menu
              trigger="click"
              placement="bottom-start"
              getContainer={cardRef.current}
              actions={actionList()}
              onAction={(node: any) => {
                setChangeType(node.key);
              }}
            >
              <div styleName="abnormal-type-con">
                <img styleName="filter-img" src={IconAbnormalType} alt="" />
                <span styleName="abnormal-type-name">
                  <FormattedMessage id="job_transfer_type" />
                </span>
              </div>
            </Popover.Menu>
          </div>
        </div>
        <div styleName="filter-criteria">
          <div styleName="day-style">{currentTime[2]}</div>
          <div styleName="month-style">
            <span styleName="slash-style">/</span>
            <span>{currentTime[1]}</span>
          </div>
          <div styleName="year-style">{currentTime[0]}</div>
          {
            currentTime[2] === dayjs().format('DD') ? (
              <div styleName="today-style">今天</div>
            ) : ''
          }
          <div styleName="filter-minutes">
            <FormattedMessage id="only_fifteen_minutes_ago" />
          </div>
          <Switch
            checked={timeType}
            onChange={(val) => {
              setTimeType(val);
            }}
          />
        </div>
        <div styleName="onlyself-selected-shares">
          <div styleName="onlyself-style" onClick={() => !isLoading && setCheckedValue(!checkedValue)}>
            {checkedValue ? (
              <img styleName="checked-icon" src={CheckedIcon} alt="" />
            ) : (
              <img styleName="checked-icon" src={UncheckedIcon} alt="" />
            )}
            <span styleName="text-content">
              <FormattedMessage id="optional_shares" />
            </span>
          </div>
        </div>
      </div>
      <div styleName="table-container">
        <div styleName="content">
          <div styleName="header">
            <div styleName="item c1">{formatMessage({ id: 'stock_name' })}</div>
            <div styleName="item c2">{formatMessage({ id: 'change_time' })}</div>
            <div styleName="item c3">{formatMessage({ id: 'job_transfer_data' })}</div>
            <div styleName="item c4">{formatMessage({ id: 'job_transfer_type' })}</div>
          </div>
          <div styleName="box">
            <div styleName="item-box">
              {listDom}
            </div>
            <InfiniteScroll
              threshold={100}
              loadMore={async () => {
                if (!isInit && tableList.length && !isLoading) {
                  getList(true);
                }
              }}
              hasMore={hasMore}
            >
              {
                !hasMore && changeList.length ? (
                  <span>
                    ~
                    {formatMessage({ id: 'notMore' })}
                    ~
                  </span>
                ) : null
              }
            </InfiniteScroll>
          </div>
        </div>
      </div>
      <div styleName="text-tip">{formatMessage({ id: 'footer_tip_text' })}</div>
    </div>
  );
};

export default AbnormalDetail;
