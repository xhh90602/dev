import React, { memo, useState, useImperativeHandle, forwardRef } from 'react';
import { useIntl } from 'react-intl';
import IconSvg from '@/platforms/mobile/components/icon-svg';
import { InfiniteScroll } from 'antd-mobile';
import { postCommentLikeAdd, postCommentLikeCancel, postCommentList } from '@/api/module-api/consult';
import { formatDate } from '@/hooks/consult/use-consult-detail';
import { last } from 'lodash-es';
import './consult-detail.scss';

import 'dayjs/locale/zh-cn';
import { NativePages, PageType, openNativePage } from '@/platforms/mobile/helpers/native/msg';

const ConsultComment: React.FC<any> = forwardRef((props, ref) => {
  const { id, contentType, viewCount, onReply } = props;
  const { formatMessage } = useIntl();

  const [commentList, setCommentList] = useState<Record<string, any>[]>([]);
  const [hasMoreComment, setHasMoreComment] = useState(true);

  const fetchCommentList = async (type = 'next') => {
    try {
      const res = await postCommentList({
        contentId: id,
        contentType,
        lastId: type === 'next' ? last(commentList)?.id : undefined,
        down: true,
        pageSize: 20,
      });
      if (res.code === 0) {
        if (type === 'next') {
          setCommentList(commentList.concat(res.result));
        } else {
          setCommentList(res.result);
        }
        setHasMoreComment(res.result.length === 20);
        console.log('获取评论列表成功:', res);
      } else {
        setHasMoreComment(false);
      }
    } catch (e) {
      console.log('获取评论列表失败:', e);
    }
  };

  const fetchCommentLikeHandle = async (item, index) => {
    try {
      const res = item.isLiked ? await postCommentLikeCancel(item.id) : await postCommentLikeAdd(item.id);
      if (res.code === 0) {
        commentList[index].likeCount += item.isLiked ? -1 : 1;
        commentList[index].isLiked = !item.isLiked;
        setCommentList([...commentList]);
        // fetchCommentList('update');
      }
      console.log('点赞成功:', res);
    } catch (e) {
      console.log('点赞失败:', e);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchCommentList,
  }));

  const openWuquanCenter = (hisId: number, roleCode: string) => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.weiquan_center,
      fullScreen: true,
      data: { hisId, roleCode },
    });
  };

  return (
    <>
      <div styleName="comment">
        <div styleName="header">
          <div styleName="module-title">
            {formatMessage({ id: 'comments' })}
            <span styleName="count-num" className="num-font">
              {commentList.length}
            </span>
          </div>
          <div styleName="page-view" className="num-font">
            {formatMessage({ id: 'browse' })}
            {viewCount || 0}
          </div>
        </div>
        {commentList.map((item, index) => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const { id, roleCode, avatar, nickname } = item.customer;
          return (
            <div styleName="item" key={item.id}>
              <img
                styleName="avat"
                src={avatar}
                alt=""
                onClick={() => {
                  openWuquanCenter(id, roleCode);
                }}
              />
              <div styleName="" style={{ flex: '1' }}>
                <div styleName="top">
                  <div styleName="name">{nickname}</div>
                  <div styleName="comment-like">
                    <div
                      styleName="svg-num"
                      onClick={() => {
                        onReply(item.id);
                      }}
                    >
                      <IconSvg path="icon_comment" />
                      <span className="num-font">{item.replyList.length}</span>
                    </div>
                    <div styleName="svg-num">
                      <i
                        onClick={() => {
                          fetchCommentLikeHandle(item, index);
                        }}
                      >
                        <IconSvg path={item.isLiked ? 'icon_liked' : 'icon_like'} />
                      </i>
                      <span className="num-font">{item.likeCount}</span>
                    </div>
                  </div>
                </div>
                <div styleName="comment-date">{formatDate(item.time, formatMessage)}</div>
                <div styleName="comment-content">{item.content}</div>
                {item.replyList.map((reply) => {
                  // eslint-disable-next-line @typescript-eslint/no-shadow
                  const { id, avatar, roleCode, nickname } = reply.customer;
                  return (
                    <div styleName="reply-comment" key={reply.id}>
                      <img
                        styleName="avat"
                        src={avatar}
                        alt=""
                        onClick={() => {
                          openWuquanCenter(id, roleCode);
                        }}
                      />
                      <div>
                        <div styleName="reply-top">
                          <span styleName="name">{nickname}</span>
                          <span styleName="date">{formatDate(reply.time, formatMessage)}</span>
                        </div>
                        <div styleName="reply-content">{reply.content}</div>
                      </div>
                    </div>
                  );
                })}
                <div styleName="split-line" />
              </div>
            </div>
          );
        })}
      </div>
      <InfiniteScroll
        style={{ padding: '10px' }}
        loadMore={async () => {
          await fetchCommentList();
        }}
        hasMore={hasMoreComment}
        threshold={0}
      />
    </>
  );
});

export default memo(ConsultComment);
