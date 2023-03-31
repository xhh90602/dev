/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import './my-wei-coin.scss';
import dayjs from 'dayjs';
import { Picker } from 'antd-mobile';
import { useSearchParam } from 'react-use';
import { openNewPage, PageType, goBack, pageBack } from '@/platforms/mobile/helpers/native/msg';
import { useIntl } from 'react-intl';
import { getMyWeiCoin, getMyWeiCoinWallet } from '@/api/module-api/activity';
import DateModal from '@/platforms/mobile/components/date-modal/date-modal';
import NoData from './components/no-data/no-data';
import backIcon from './images/icon_return.png';
import myWeiCoin from './images/my-coin.png';
import drapDown from './images/icon_drop_down.png';
import weiCoinLogo from './images/icon_wei_coin.png';

const MyWeiCoin: React.FC = () => {
  const { formatMessage } = useIntl();
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 27;
  const [dateVisible, setDateVisible] = useState(false);
  const [filterDate, setFilterDate] = useState<any>();// 时间
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState<any[]>([]);// 状态
  const [allAWeiCoinCount, setAllAWeiCoinCount] = useState();
  const [walletList, setWalletList] = useState<any>([]);// 流水记录
  const [pageNum, setPageNum] = useState(1);
  const [pramas, setPramas] = useState<any>({
    // type: null, // 类型,1获取 2消耗
    // time: '', // 时间，格式"yyyy-MM"
    pageNum, // 当前页（默认1）
    pageSize: 20, // 每页大小（默认20）
  });
  const [pages, setPages] = useState();
  const [currentPage, setCurrentPage] = useState();
  const [hasNextPage, sethasNextPage] = useState(false);

  const basicColumns = [
    [
      { label: '全部状态', value: '' },
      { label: '已获取', value: '1' },
      { label: '已消耗', value: '2' },
    ],
  ];
  // 跳转到清零查询
  const goPage = () => {
    openNewPage({
      fullScreen: true,
      pageType: PageType.HTML,
      path: 'reset-wei-coin.html',
      replace: false,
    });
  };

  const getWeinCoinData = () => {
    getMyWeiCoin({ currency: 'balance' }).then((res) => {
      if (res.code === 0) {
        setAllAWeiCoinCount(res.result);
      }
    }).catch((err) => {
      console.log('err===>', err);
    });
  };

  const getMyWeiCoinWalletData = (data) => {
    getMyWeiCoinWallet(data).then((res) => {
      if (res.code === 0) {
        console.log('res===>', res);
        setWalletList([...walletList, ...res.result.getRecords]);
        setPages(res.result.pages);
        setCurrentPage(res.result.current);
      }
    }).catch((err) => {
      console.log('err===>', err);
    });
  };

  useEffect(() => {
    getWeinCoinData();
  }, []);

  useEffect(() => {
    setPageNum(1);
    setWalletList([]);
    let newPramas = { ...pramas };
    if (values) {
      newPramas = {
        ...newPramas,
        type: Number(values[0]),
      };
    }
    if (!newPramas.type || newPramas.type === '') {
      delete newPramas.type;
    }
    setPramas(newPramas);
  }, [values]);

  useEffect(() => {
    setPageNum(1);
    setWalletList([]);
    let newPramas = { ...pramas };
    if (filterDate) {
      newPramas = {
        ...newPramas,
        time: filterDate,
      };
    }
    if (!newPramas.time || newPramas.time === '') {
      delete newPramas.time;
    }
    setPramas(newPramas);
  }, [filterDate]);

  useEffect(() => {
    let newPramas = { ...pramas };
    newPramas = {
      ...newPramas,
      pageNum,
    };
    setPramas(newPramas);
  }, [pageNum]);

  useEffect(() => {
    getMyWeiCoinWalletData(pramas);
  }, [pramas]);

  console.log(currentPage, pages);
  // 底部加载更多
  const mainRef = React.useRef<any>(null);
  const lazyLoading = () => {
    const { scrollTop } = mainRef.current;
    const { clientHeight, scrollHeight } = mainRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 1) { // 如果滚动到接近底部，加载下一页
      // 事件处理
      console.log(currentPage, pages);
      console.log('底部加载更多底部加载更多');
      if (currentPage === pages) {
        sethasNextPage(false);
      } else {
        sethasNextPage(true);
        setPageNum(pageNum + 1);
      }
    }
  };

  useEffect(() => {
    mainRef.current.addEventListener('scroll', lazyLoading);
    return () => mainRef.current.removeEventListener('scroll', lazyLoading);
  }, [walletList, currentPage, pages]);

  return (
    <div styleName="page" style={{ paddingTop: `${+safeAreaTop}px` }}>
      <div styleName="page-title">
        <img src={backIcon} alt="" onClick={() => pageBack()} />
        <div styleName="page-title-center">我的薇币</div>
        <div styleName="page-title-right" onClick={goPage}>清零查询</div>
      </div>
      <div styleName="page-bg">
        <img src={myWeiCoin} alt="" />
      </div>
      <div styleName="page-main">
        <div styleName="coin">我的薇币</div>
        <div styleName="coin-num">{allAWeiCoinCount || 0}</div>
        <div styleName="filter">
          <div styleName="filter-tap" onClick={() => setVisible(true)}>
            <span>
              {
              values.length && values[0] !== '' ? basicColumns[0].find((val) => val.value === values[0])?.label : '全部状态'
              }
            </span>
            <span><img src={drapDown} alt="" /></span>
          </div>
          <div styleName="filter-tap" onClick={() => setDateVisible(true)}>
            <span>{filterDate || '全部月份'}</span>
            <span><img src={drapDown} alt="" /></span>
          </div>
        </div>
        <div styleName="scroll-box" ref={mainRef}>
          {
            walletList.length ? walletList.map((item: any, index) => (
              <div styleName="coin-list-box" key={index}>
                <div styleName="coin-list-title">{item.month}</div>
                <div styleName="coin-list-item">
                  <div styleName="coin-item-top">
                    <div>
                      获取：
                      <span>{item.income}</span>
                    </div>
                    <div>
                      已消耗：
                      <span>{item.expend}</span>
                    </div>
                  </div>
                  {
                    item.list && item.list.map((val, idx) => (
                      <div styleName="coin-item-bottom" key={idx}>
                        <div styleName="coin-bottom-content">
                          <div styleName="coin-bottom-title">{val.payExplain}</div>
                          <div styleName="coin-bottom-num">
                            <div styleName="coin-num-value">
                              <img src={weiCoinLogo} alt="" />
                              <span>薇币</span>
                            </div>
                            <div styleName="coin-num-text get-coin-num-text">{Number(val.amount).toFixed(2)}</div>
                          </div>
                        </div>
                        <div styleName="coin-bottom-main">
                          <div styleName="coin-bottom-intro">{val.payType}</div>
                          <div styleName="coin-bottom-time">{dayjs(val.time).format('MM-DD HH:mm')}</div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )) : <NoData />
          }
          {
            walletList.length ? (
              <div styleName="more">
                {
                  hasNextPage ? '~ 加载中 ~' : '~ 没有更多了 ~'
                }
              </div>
            ) : null
          }

        </div>
      </div>
      <DateModal
        visible={dateVisible}
        start={new Date('2000')}
        end={new Date()}
        precision="month"
        value={filterDate}
        onOk={(v) => {
          console.log(v);
          setFilterDate(dayjs(v).format('YYYY-MM'));
          setDateVisible(false);
        }}
        onCancel={() => { setDateVisible(false); }}
      />

      <Picker
        columns={basicColumns}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        value={values}
        onConfirm={(v) => {
          setValues(v);
        }}
      />
    </div>
  );
};

export default MyWeiCoin;
