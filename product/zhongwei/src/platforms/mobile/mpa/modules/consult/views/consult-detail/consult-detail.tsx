/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-danger */
import React, { useMemo, useState } from 'react';
import { useUpdateEffect } from 'ahooks';
import { useIntl } from 'react-intl';

import IconSvg from '@/platforms/mobile/components/icon-svg';
import IconShare from '@/platforms/mobile/images/icon_consult_share.svg';
import defaultAvatar from '@/platforms/mobile/images/default_avatar.svg';

import { getUrlParam } from '@/utils';
import { addFootmark, NativePages, openNativePage, openNewPage, PageType } from '@/platforms/mobile/helpers/native/msg';
import useConsultDetail, { formatDate } from '@/hooks/consult/use-consult-detail';

import { Popover, Popup, Slider, TextArea, Toast } from 'antd-mobile';
import FullScreenPageView from '@/platforms/mobile/components/full-screen-page-view/full-screen-page-view';
import BaseModal from '@/platforms/mobile/components/basic-modal/basic-modal';
import StockData from './components/stock-data/stock-data';
import ConsultComment from './consult-comment';
import ConsultLike from './consult-like';

import './consult-detail.scss';

// contentType: public-公共栏目;self-自研栏目;column-专栏; model:自研栏目model
const { contentType = 'pubilc', id = 1, model } = getUrlParam();

const ConsultDetail: React.FC = () => {
  const { formatMessage } = useIntl();

  const CommentModulesRef = React.useRef<any>(null);

  const {
    detailData,
    contentData,
    attention,
    currentStockList,
    optionList,
    getSelfList,
    comment,
    sendComment,
    setComment,
    popupType,
    setPopupType,
    setReplyId,
    likeHandle,
    confirmFontSize,
    fontSize,
    setFontSize,
    menuItemClick,
    shareHandle,
  } = useConsultDetail({
    id,
    contentType,
    model,
    fetchCommentList: () => {
      CommentModulesRef.current?.fetchCommentList('update');
    },
  });

  const [isAddFootMark, setIsAddFootMark] = useState(false);

  /* 进入页面添加足迹 */
  useUpdateEffect(() => {
    if (!isAddFootMark) {
      addFootmark({
        id: detailData.id,
        title: detailData.title,
        content: detailData.content,
        dataSource: detailData.dataSource,
        imgUrl: detailData?.imgUrl || '',
        videoUrl: detailData?.videoUrl || '',
      });
      setIsAddFootMark(true);
    }
  }, [detailData, isAddFootMark]);

  const actions = useMemo(() => {
    const list = [
      {
        key: 'share',
        text: (
          <div styleName="action-item">
            <IconSvg path="icon_share_consult" />
            {formatMessage({ id: 'share' })}
          </div>
        ),
      },
      {
        key: 'collect',
        text: (
          <div styleName="action-item">
            <IconSvg path="icon_collect" />
            {formatMessage({ id: 'collect' })}
          </div>
        ),
      },
      {
        key: 'copyLink',
        text: (
          <div styleName="action-item">
            <IconSvg path="icon_copy_link" />
            {formatMessage({ id: 'copyLink' })}
          </div>
        ),
      },
      {
        key: 'fontSize',
        text: (
          <div styleName="action-item">
            <IconSvg path="icon_font_size" />
            {formatMessage({ id: 'font_size' })}
          </div>
        ),
      },
    ];
    // 非本人的文章详情添加投诉按钮
    if (contentType === 'column' && !detailData.isMy) {
      list.push({
        key: 'complaint',
        text: (
          <div>
            <IconSvg path="icon_complaint" />
            {formatMessage({ id: 'complaint' })}
          </div>
        ),
      });
    }
    return list;
  }, [contentType, detailData.isMy]);

  const followHandle = () => {
    if (contentData.isFollowed && popupType === '') {
      setPopupType('cancelFollow');
      return;
    }
    attention().then((state) => {
      if (!state) {
        Toast.show({
          content: formatMessage({ id: 'handle_fail' }),
        });
      }
    });
  };

  return (
    <FullScreenPageView
      style={{ '--contain-bg': '#FFF' }}
      right={(
        <>
          <div
            styleName="nav-right-btn"
            onClick={() => openNewPage({
              path: 'global_search',
              pageType: PageType.NATIVE,
            })}
          >
            <IconSvg path="icon_consult_detail_search" />
          </div>
          <div styleName="nav-right-btn">
            <Popover.Menu actions={actions} placement="topRight" onAction={menuItemClick} trigger="click">
              <IconSvg path="icon_more" />
            </Popover.Menu>
          </div>
        </>
      )}
      fixedBottom
    >
      <div styleName="container">
        <div styleName="title">{detailData.title}</div>
        {contentType === 'column' && (
          <div styleName="author">
            <div
              styleName="head"
              onClick={() => {
                // 如果是分析师，点击头像跳转个人主页
                if (detailData.customer?.roleCode === 'ANALYST') {
                  openNativePage({
                    pageType: PageType.NATIVE,
                    path: NativePages.weiquan_center,
                    fullScreen: true,
                    data: { hisId: detailData.customer.id, roleCode: detailData.customer.roleCode },
                  });
                }
              }}
            >
              <img styleName="avatar" src={detailData.customer?.avatar || defaultAvatar} alt="" />
              {detailData.customer?.tagIcon && <img styleName="analyse" src={detailData.customer?.tagIcon} alt="" />}
            </div>
            <div style={{ flex: '1' }}>
              <div styleName="name">{detailData.customer?.nickname || '中薇人工智能研究团队'}</div>
              <div styleName="date-time" className="num-font">
                {/* <span style={{ marginRight: '0.3rem' }}>{formatMessage({ id: 'publish_article' })}</span> */}
                {formatDate(detailData.createTime, formatMessage)}
              </div>
            </div>
            {!detailData.isMy && (
              <div styleName="attention" onClick={followHandle}>
                {formatMessage({ id: contentData.isFollowed ? 'followed' : 'follow' })}
              </div>
            )}
            <BaseModal
              visible={popupType === 'cancelFollow'}
              // title={formatMessage({ id: 'hint' })}
              confirmText={formatMessage({ id: 'confirm' })}
              cancelText={formatMessage({ id: 'cancel' })}
              onCancel={() => setPopupType('')}
              onConfirm={() => {
                setPopupType('');
                followHandle();
              }}
            >
              <div style={{ textAlign: 'center' }}>{formatMessage({ id: 'cancel_follow_hint' })}</div>
            </BaseModal>
          </div>
        )}

        {detailData.videoUrl && (
          <video src={detailData.videoUrl} styleName="cover-img" controls preload="metadata" crossOrigin="anonymous">
            <track kind="captions" srcLang="en" label="english_captions" />
          </video>
        )}

        <div styleName="content" dangerouslySetInnerHTML={{ __html: detailData.content }} />

        {detailData.file && detailData.file.ext === '.pdf' && (
          <div
            styleName="file "
            onClick={() => {
              openNewPage(
                {
                  pageType: PageType.PDF,
                  path: detailData.file.fullUrl,
                  title: detailData.file.name.split('.')[0],
                },
                false,
              );
            }}
          >
            <div className="flex-l-c">
              <IconSvg path="pdf_icon" />
              <div className="m-l-20">
                <div styleName="file-title">{detailData.file.name}</div>
                <div styleName="file-size">
                  {detailData.file.size}
                  KB
                </div>
              </div>
            </div>
          </div>
        )}

        <div styleName="split-line" />

        <div styleName="declaration">
          {detailData.dataSource && (
            <p styleName="data-source">
              {formatMessage({ id: 'source_title' })}
              {detailData.dataSource}
            </p>
          )}
          <p>
            {formatMessage({ id: 'declaration_n1' })}
            {detailData.dataSource}
            ，
            {formatMessage({ id: 'declaration_n2' })}
          </p>
        </div>

        {/* 相关股票 */}
        {currentStockList && !!currentStockList.length && (
          <>
            <div styleName="split-line" />
            <div styleName="relevant-stock">
              <div styleName="module-title">{formatMessage({ id: 'relevant_stock' })}</div>
              {currentStockList.map((item) => (
                <StockData stock={item} key={item.code} optionList={optionList} optionHandler={getSelfList} />
              ))}
            </div>
          </>
        )}

        <div styleName="split-line" />

        {/* TODO: 暂时隐藏 */}
        {/* <ConsultLike id={id} contentType={contentType} detailData={detailData} contentData={contentData} /> */}

        <div styleName="split-line" />

        <ConsultComment
          ref={CommentModulesRef}
          id={id}
          contentType={contentType}
          viewCount={detailData.viewCount || contentData.viewCount}
          onReply={(id) => {
            setReplyId(id);
            setPopupType('comment');
          }}
        />

        <div styleName="footer">
          <div
            styleName="comment-btn"
            onClick={() => {
              setPopupType('comment');
            }}
          >
            {formatMessage({ id: 'say_think' })}
          </div>
          <div styleName="svg-num" onClick={shareHandle}>
            <img src={IconShare} alt="" />
            <span className="num-font">{contentData.shareCount}</span>
          </div>
          <div styleName="svg-num">
            <IconSvg path="icon_comment" />
            <span className="num-font">{contentData.commentCount}</span>
          </div>
          <div styleName="svg-num">
            <i
              onClick={() => {
                likeHandle().then((state) => {
                  if (!state) {
                    Toast.show({
                      content: formatMessage({ id: 'handle_fail' }),
                    });
                  }
                });
              }}
            >
              <IconSvg path={contentData.isLiked ? 'icon_liked' : 'icon_like'} />
            </i>
            <span className="num-font">{contentData.likeCount}</span>
          </div>
        </div>

        {/* 评论 */}
        <Popup
          visible={popupType === 'comment'}
          onMaskClick={() => {
            setPopupType('');
          }}
        >
          <div styleName="comment-popup">
            <div styleName="top" className="flex-c-between">
              <div
                styleName="cencal"
                onClick={() => {
                  setPopupType('');
                }}
              >
                {formatMessage({ id: 'cancel' })}
              </div>
              <div styleName="title">{formatMessage({ id: 'comments' })}</div>
              <div
                styleName="submit"
                onClick={() => {
                  if (comment.trim() === '') {
                    Toast.show({
                      content: formatMessage({ id: 'please_input_comment' }),
                    });
                    return;
                  }
                  sendComment();
                }}
              >
                {formatMessage({ id: 'publish' })}
              </div>
            </div>
            <TextArea
              placeholder={formatMessage({ id: 'placeholder' })}
              value={comment}
              onChange={(val) => {
                setComment(val);
              }}
              rows={5}
            />
          </div>
        </Popup>

        {/* 设置字体 */}
        <Popup
          visible={popupType === 'fontSize'}
          onMaskClick={() => {
            setPopupType('');
            confirmFontSize(false);
          }}
        >
          <div styleName="font-size-popup">
            <div styleName="standard">{formatMessage({ id: 'standard' })}</div>
            <i onClick={() => confirmFontSize(false)}>
              <IconSvg path="icon_close_popup" />
            </i>
            <div styleName="select-box" className="flex-c-between">
              <span styleName="min">A</span>
              <div style={{ flex: '1' }}>
                <Slider
                  className="slider"
                  min={12}
                  max={20}
                  step={2}
                  value={fontSize}
                  ticks
                  onChange={(value) => {
                    setFontSize(value as number);
                  }}
                />
              </div>
              <span styleName="max">A</span>
            </div>
            <div styleName="split-line" />
            <div styleName="confirm" onClick={() => confirmFontSize(true)}>
              {formatMessage({ id: 'complete' })}
            </div>
          </div>
        </Popup>
      </div>
    </FullScreenPageView>
  );
};

export default ConsultDetail;
