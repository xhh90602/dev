/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import './reset-wei-coin.scss';
import { openNewPage, PageType, goBack, pageBack } from '@/platforms/mobile/helpers/native/msg';
import { useSearchParam } from 'react-use';
import { useIntl } from 'react-intl';
import { getRetsetWeiCoincount, getRetsetWeiCoinWallet } from '@/api/module-api/activity';
import backIcon from './images/icon_return.png';
import weiCoinLogo from './images/icon_wei_coin.png';
import noDataIcon from './images/icon_no_data.png';

const ResetWeiCoin: React.FC = () => {
  const { formatMessage } = useIntl();
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 0;
  const [count, setCount] = useState(0);
  const [dataList, setDataList] = useState<any>([]);
  const [pageNum, setPageNum] = useState(1);
  const [pages, setPages] = useState();
  const [currentPage, setCurrentPage] = useState();
  const [hasNextPage, sethasNextPage] = useState(false);

  const getweiCoinCount = () => {
    getRetsetWeiCoincount({ currency: 'balance' }).then((res) => {
      console.log('res====>', res);
      if (res.code === 0) {
        setCount(res.result);
      }
    }).catch((err) => {
      console.log('err', err);
    }).finally();
  };

  const getList = () => {
    getRetsetWeiCoinWallet({
      currency: 'balance', // 币种，默认传
      pageNum, // 当前页（默认1）
      pageSize: 20, // 每页大小（默认20）
    }).then((res) => {
      if (res.code === 0) {
        console.log('res====>', res);
        const newResult = res.result.records.map((item, index) => ({
          ...item, id: index,
        }));
        setDataList(newResult);
        setPages(res.result.pages);
        setCurrentPage(res.result.current);
      }
    }).catch((err) => {
      console.log('err', err);
    }).finally();
  };

  useEffect(() => {
    getweiCoinCount();
  }, []);

  useEffect(() => {
    getList();
  }, [pageNum]);

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
    if (!mainRef.current) return undefined;
    mainRef.current.addEventListener('scroll', lazyLoading);
    return () => mainRef.current.removeEventListener('scroll', lazyLoading);
  }, [dataList, currentPage, pages]);

  return (
    <div styleName="page" style={{ paddingTop: `${+safeAreaTop}px` }}>
      <div styleName="page-title">
        <img src={backIcon} alt="" onClick={() => pageBack()} />
        <div>
          {formatMessage({ id: 'reset_check' })}
          {/* 清零查询 */}
        </div>
      </div>
      <div styleName="query">
        <div>
          <img src={weiCoinLogo} alt="" />
          <span>
            {formatMessage({ id: 'about_to_expire_number_of_count' })}
            {/* 即将过期的薇币数量 */}
          </span>
        </div>
        <div styleName="query-num">{count}</div>
      </div>
      {
        dataList.length ? (
          <div styleName="query-main" ref={mainRef}>
            <div styleName="query-main-title">
              {/* 已过期 */}
              {formatMessage({ id: 'expired' })}
            </div>
            <div styleName="query-main-row">
              <span>
                {formatMessage({ id: 'wei_coin_count' })}
                {/* 薇币数wei_coin_count */}
              </span>
              <span>
                {formatMessage({ id: 'expired_time' })}
                {/* 过期时间 */}
              </span>
            </div>
            {
              dataList.map((value, index) => (
                <div styleName="query-main-item" key={index}>
                  <div>
                    <img src={weiCoinLogo} alt="" />
                    <span>{value.amount}</span>
                  </div>
                  <div styleName="time">{value.expireTime}</div>
                </div>
              ))
            }
            {
            dataList.length ? (
              <div styleName="more">
                {
                  hasNextPage ? `~ ${formatMessage({ id: 'loading' })} ~` : `~ ${formatMessage({ id: 'no_more' })} ~`
                }
                {/* {
                  hasNextPage ? '~ 加载中 ~' : '~ 没有更多了 ~'
                } */}
              </div>
            ) : null
          }

          </div>
        ) : (
          <div styleName="no-data">
            <div styleName="no-data-title">
              {/* 已过期 */}
              {formatMessage({ id: 'expired' })}
            </div>
            <div styleName="no-data-item">
              <img src={noDataIcon} alt="" />
              <div>
                {formatMessage({ id: 'no_data' })}
                {/* 暂无数据 */}
              </div>
            </div>
          </div>
        )
      }

    </div>
  );
};

export default ResetWeiCoin;
