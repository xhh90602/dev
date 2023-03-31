/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React, { memo, useState, useEffect, useContext, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Popover, Toast } from 'antd-mobile';
import dayjs from 'dayjs';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import IconSvg from '@/platforms/mobile/components/icon-svg';
import IconNew from '@/platforms/mobile/images/icon_new.png';
import { CommonApi } from '@/api/module-api/strategy';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { openNewPage, PageType } from '@/platforms/mobile/helpers/native/msg';
import DelDialog from '../del-dialog';
import ReNameDialog from '../rename-dialog';
import './index.scss';

const AnalystRecommendDetail: React.FC<any> = memo((props: any) => {
  const { item, editInfo = () => null } = props;
  const cardRef = useRef(null);
  const [delShow, setDelShow] = useState(false);
  const [reNameShow, setReNameShow] = useState(false);
  const userConfig = useContext<any>(userConfigContext);
  const [lang, setLang] = useState<string>('zh-CN');
  const { formatMessage } = useIntl();

  const fixed = (num) => (+num ? +(+num * 100).toFixed(2) : 0);

  const dataFormat = (num) => {
    if (+num) {
      if (+num > 0) {
        return `+${(+num).toFixed(2)}%`;
      }
      return `${(+num).toFixed(2)}%`;
    }
    return '0.00%';
  };

  // 跳转到策略详情
  const goDetail = () => {
    const last10DaysInDate = item?.last10DaysInDate ? (dayjs(item.last10DaysInDate).unix() * 1000) : 0;
    openNewPage({
      fullScreen: true,
      pageType: PageType.HTML,
      path: `my-strategy-detail.html?strategyId=${item.id}&last10DaysInDate=${last10DaysInDate}`,
      replace: false,
    });
  };

  // 重命名
  const renameClick = (name) => {
    try {
      CommonApi({ mf: 9, sf: 12, body: { name, strategyId: item.id } }).then((res) => {
        if (res && res.code === 0) {
          editInfo({ id: item.id, type: 'rename', name });
          Toast.show({ content: `${formatMessage({ id: 'edit_success' })}` });
        } else {
          Toast.show({ content: `${formatMessage({ id: 'edit_error' })}` });
        }
      }).catch((err) => {
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err) {
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
    setReNameShow(false);
  };

  // 删除
  const delStrategy = () => {
    try {
      CommonApi({ mf: 9, sf: 14, body: { strategyId: item.id } }).then((res) => {
        if (res && res.code === 0) {
          editInfo({ id: item.id, type: 'del' });
          Toast.show({ content: formatMessage({ id: 'del_success' }) });
        } else {
          Toast.show({ content: `${formatMessage({ id: 'edit_error' })}` });
        }
      }).catch((err) => {
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err) {
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
    setDelShow(false);
  };

  // 工具条
  const toolBarClick = (ts) => {
    // 重命名
    if (ts === 'rename') {
      setReNameShow(true);
    }
    // 修改策略【跳转到选股器】
    if (ts === 'edit') {
      nativeOpenPage(`add-stock.html?source=celue&strategyId=${item.id}&mk=${item.region}`);
    }
    // 删除
    if (ts === 'del') {
      setDelShow(true);
    }
  };

  useEffect(() => {
    if (userConfig) {
      const { language } = userConfig;
      setLang(language || 'zh-CN');
    }
  }, [userConfig]);

  const getStockName = (data) => {
    if (lang === 'zh-CN') {
      return data?.Name;
    }
    return data?.Name_T;
  };

  const marketIMG = (market) => {
    if (market === 'cn') return 'icon_a';
    if (market === 'hk') return 'icon_hk';
    if (market === 'us') return 'icon_us';
    return '';
  };

  const conditionsText = (data) => {
    const tags: any = [];
    if (data) {
      const json = JSON.parse(data)?.conditions || [];
      json.forEach((ele) => {
        tags.push(`${ele.title}${ele.text}`);
      });
    }
    return tags;
  };

  const popoverDom = () => (
    <div className="popover-box">
      <div className="popover-item" onClick={() => toolBarClick('rename')}>重命名</div>
      <div className="popover-item" onClick={() => toolBarClick('edit')}>
        修改
        {formatMessage({ id: 'condition' })}
      </div>
      <div className="popover-item" onClick={() => toolBarClick('del')}>删除</div>
    </div>
  );

  return (
    <div styleName="my-strategy-card">
      <div styleName="top-strategy-info" ref={cardRef}>
        <div styleName="strategy-introduce">
          <div styleName="strategy-box">
            {
              marketIMG(item?.region || '') ? (
                <IconSvg path={marketIMG(item?.region || '')} styleName="country-icon" />
              ) : null
            }
            <div styleName="strategy-name">{item?.name || ''}</div>
          </div>
          <Popover
            content={popoverDom()}
            trigger="click"
            placement="bottom-start"
            getContainer={cardRef.current}
          >
            <IconSvg path="icon_more" styleName="icon-more" />
          </Popover>
        </div>
        <div styleName="stock-text-box" onClick={() => goDetail()}>
          <div styleName="total-stock">
            共
            <span>{item?.stkCount ? item.stkCount : 0}</span>
            只股票
          </div>
          {
            item?.last10DaysInDate ? (
              <div styleName="be-selected">
                {dayjs(item.last10DaysInDate).format('YYYY/MM/DD')}
                {formatMessage({ id: 'new_stocks_selected' })}
              </div>
            ) : null
          }
        </div>
        {
          conditionsText(item.conditions) && conditionsText(item.conditions).length ? (
            <div styleName="tag-line" onClick={() => goDetail()}>

              <div styleName="tag-box">
                {
                  conditionsText(item.conditions).map((ele, index) => (
                    <div styleName="tag" key={`${ele}-${index}`}>{ele}</div>
                  ))
                }
              </div>
            </div>
          ) : null
        }
        {
          item && item?.top3Stks.length ? (
            <div styleName="sotck-list" onClick={() => goDetail()}>
              {
                item.top3Stks.map((ele) => (
                  <div styleName="item" key={`${ele.code}-${ele.subMarket}-${ele.Price}`}>
                    <div styleName="stock-name">{getStockName(ele)}</div>
                    <div styleName="stock-code">
                      {ele.code}
                      {
                        ele.isNew ? (
                          <img styleName="new-tag" src={IconNew} alt="" />
                        ) : null
                      }
                    </div>
                    <div styleName="stock-info">
                      <div styleName="price">{(ele?.Price || 0).toFixed(2)}</div>
                      <div
                        styleName="rise-and-fall"
                        className={
                          getClassNameByPriceChange(fixed(ele?.RiseRate))
                        }
                      >
                        {dataFormat(fixed(ele?.RiseRate))}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          ) : null
        }
      </div>
      <DelDialog show={delShow} cancelClick={() => setDelShow(false)} confirmClick={() => delStrategy()} />
      <ReNameDialog
        show={reNameShow}
        cancelClick={() => setReNameShow(false)}
        confirmClick={(name) => renameClick(name)}
      />
    </div>
  );
});

export default AnalystRecommendDetail;
