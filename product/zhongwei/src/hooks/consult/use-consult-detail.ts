import { useIntl } from 'react-intl';
/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react';
import { useSubscribeStockListQuote } from '@dz-web/quote-client-react';
import { querySnapshot, QUOTE_CATEGORY_FIELD } from '@dz-web/quote-client';

import { Toast } from 'antd-mobile';
import {
  getConsultDetail,
  postLikeAdd,
  postLikeCancel,
  postCommentAdd,
  getContent,
} from '@/api/module-api/consult';
import { PopoverMenuProps } from 'antd-mobile/es/components/popover';
import copy from 'copy-to-clipboard';

import { querySelfList } from '@/api/module-api/trade';
import { useRequest, useSetState } from 'ahooks';
import { ShareType, consultCollect, consultShare } from '@/platforms/mobile/helpers/native/msg';
import { useGetUserInfo } from '@/helpers/multi-platforms';
import { addFollow, cancelFollow } from '@/api/module-api/combination';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { cloneDeep, get, isNil } from 'lodash-es';

dayjs.extend(isYesterday);
dayjs.extend(isToday);
dayjs.extend(relativeTime);

const getBaseFontSize = () => Number.parseFloat(document.body.style.fontSize) * 100;
const setBaseFontSize = (px = 14) => {
  localStorage.setItem('fontSize', String(px));
  document.body.style.fontSize = `${px / 100}rem`;
};

const initSize = localStorage.getItem('fontSize') || 14;

setBaseFontSize(Number(initSize));

const copyPageLink = () => {
  const pageLink = window.location.href;
  return copy(pageLink, { debug: true, message: '链接复制成功！' });
};

export const formatDate = (time: string, formatMessage) => {
  const date = dayjs(time).locale('zh-cn');

  /* 一分钟内 */
  if (dayjs().valueOf() - date.valueOf() <= 60 * 1000) {
    return formatMessage({ id: 'just_now' });
  }

  /* 一小时内 */
  if (dayjs().valueOf() - date.valueOf() <= 60 * 60 * 1000) {
    return date.fromNow();
  }

  /* 一小时后 */
  if (date.isToday()) {
    return formatMessage({ id: 'today' }) + date.format('HH:mm');
  }

  /* 昨天 */
  if (date.isYesterday()) {
    return formatMessage({ id: 'yesterday' }) + date.format('HH:mm');
  }

  if (date.year() < dayjs().year()) {
    /* 去年及之前 */
    return date.format('YYYY/MM/DD HH:mm');
  }
  /* 昨天及之前 */
  return date.format('MM/DD HH:mm');
};

const { consultServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;

interface IProps {
  id: number;
  contentType: string;
  model?: string;
  fetchCommentList?: () => void
}

const useConsultDetail = (props: IProps) => {
  const { formatMessage } = useIntl();
  const { id, contentType, model, fetchCommentList } = props;
  const [detailData, setDetailData] = useState<Record<string, any>>({});
  const [contentData, setContentData] = useSetState({
    commentCount: 0, // 评论数量
    comments: [] as any[], // 评论列表
    customer: {} as Record<string, any>, // 作者信息
    isLiked: false, // 是否点赞
    likeCount: 0, // 点赞数量
    likes: [] as any[], // 点赞列表
    shareCount: 0, // 分享数量
    isFollowed: false, // 是否关注作者
    viewCount: 0, // 资讯浏览量
    isCollect: false, // 是否收藏
  });

  const [markets, setMarkets] = useState<any[]>([]);
  const userInfo = useGetUserInfo();

  const [loading, setLoading] = useSetState({
    detail: false,
    like: false,
    comment: false,
    content: false,
  });
  useEffect(() => {
    const isLoading = Object.values(loading).some((v) => v);
    if (isLoading) {
      Toast.show({
        icon: 'loading',
        duration: 0,
      });
    } else {
      Toast.clear();
    }
  }, [loading]);

  // 相关股票-行情
  const currentStockList: any[] = useSubscribeStockListQuote(
    async (client: any) => {
      const symbols: any[] = markets.map((item) => [item.market, item.code]);

      return querySnapshot(client, {
        symbols,
        fields: [QUOTE_CATEGORY_FIELD.INFO, QUOTE_CATEGORY_FIELD.QUOTE],
      });
    },
    [markets],
  );

  const getImgUrl = (data) => {
    if (data && ['.bmp', '.jpg', 'jpeg', '.png', '.gif'].includes(data.ext)) {
      return `${consultServer}${get(data, 'url', '')}`;
    }
    return '';
  };

  const getVideoUrl = (data) => {
    if (data && ['.ogg', '.mp4', '.webm'].includes(data.ext)) {
      return `${consultServer}${get(data, 'url', '')}`;
    }
    return '';
  };

  const getFile = (data) => {
    if (!isNil(data)) {
      return { ...data, fullUrl: `${consultServer}${data.url}` };
    }
    return null;
  };

  const replaceText = (str) => {
    let html: string = str;
    if (str) {
      // 给图片加域名
      const pattern = /<img [^>]*src=['"]\//gi;
      const isIMG = pattern.test(html);
      if (isIMG) {
        html = html.replace(pattern, `<img src="${consultServer}/`);
      }
    }
    return html;
  };

  const formatData = (data) => {
    let finalData = cloneDeep(data);
    if (contentType === 'self') {
      finalData = {
        ...data,
        file: getFile(data.content),
        content: replaceText(data.content_text),
        dataSource: data.source,
        imgUrl: getImgUrl(data.cover),
        videoUrl: data.video_url || getVideoUrl(data.cover),
        viewCount: data.browseNumber,
      };
    }
    return finalData;
  };

  const fetchDetailData = async () => {
    setLoading({ detail: true });
    try {
      const res = await getConsultDetail({ id, model, type: contentType });
      if (res.code === 0) {
        const { commoditys, commodity, stock, customer = {} } = res.result;
        const relations: number[] = customer?.relations || [];
        setDetailData(formatData(res.result));
        setContentData({ isFollowed: relations.includes(2), customer });
        setMarkets(
          commoditys
          || JSON.parse(commodity)
          || stock?.map((item) => ({ market: item.marketCode, code: item.stockCode }))
          || [],
        );
      }
    } catch (e) {
      console.log('获取详情失败:', e);
    }
    setLoading({ detail: false });
  };

  const fetchContent = () => {
    setLoading({ content: true });
    getContent({ contentId: id, contentType }).then((res) => {
      const { result } = res;
      if (res.code === 0) {
        setContentData(result);
      }
    }).catch((e) => {
      console.log('获取整合数据失败:', e);
    }).finally(() => {
      setLoading({ content: false });
    });
  };

  const likeHandle = async () => {
    try {
      const res = await (contentData.isLiked
        ? postLikeCancel({
          contentId: id,
          // contentDetail: detailData.content,
          contentType,
        }) : postLikeAdd({
          contentId: id,
          contentCid: contentData.customer.id || 0,
          // contentDetail: detailData.content,
          // contentTitle: detailData.title,
          contentType,
        }));
      if (res.code === 0) {
        fetchContent();
        return true;
      }
      return false;
    } catch (e) {
      console.log('点赞失败:', e);
      return false;
    }
  };

  const shareHandle = () => {
    consultShare({
      shareType: ShareType.WECHAT_MOMENT,
      link: window.location.href, // 文章链接
      ext: {
        ...detailData,
        viewCount: detailData.viewCount || contentData.viewCount,
        likeCount: contentData.likeCount,
        nickname: userInfo.nickName,
      },
    });
  };

  const collectHandle = () => {
    consultCollect({
      id: detailData.id,
      title: detailData.title,
      content: detailData.content,
      isCollect: !contentData.isCollect,
      dataSource: detailData.dataSource,
      imgUrl: detailData.imgUrl || '',
      videoUrl: detailData.videoUrl || '',
    }).then((success) => {
      Toast.show({ content: formatMessage({ id: success ? 'collect_success' : 'collect_fail' }) });
      if (success)setContentData({ isCollect: !contentData.isCollect });
    });
  };

  const [popupType, setPopupType] = useState('');

  const menuItemClick: PopoverMenuProps['onAction'] = (node) => {
    console.log('menuItemClick:', node);

    if (node.key === 'fontSize') {
      setPopupType(node.key);
    }

    if (node.key === 'copyLink') {
      const isCopy = copyPageLink();
      Toast.show({
        content: formatMessage({ id: isCopy ? 'copy_success' : 'copy_fail' }),
      });
    }

    if (node.key === 'share') {
      shareHandle();
    }

    if (node.key === 'collect') {
      collectHandle();
    }
  };

  const [fontSize, setFontSize] = useState(Number(initSize));

  const confirmFontSize = (save: boolean) => {
    if (save) {
      setBaseFontSize(fontSize);
    } else {
      setFontSize(getBaseFontSize());
    }
    setPopupType('');
  };

  const [replyId, setReplyId] = useState();
  const [comment, setComment] = useState('');
  const [optionList, setOptionList] = useState<any[]>([]);

  /* 评论/回复 */
  const { run: sendComment } = useRequest(async (body = {}) => {
    setLoading({ comment: true });
    try {
      const res = await postCommentAdd({
        replyId,
        content: comment,
        contentType,
        contentDetail: detailData.content,
        contentCid: contentData.customer.id || 0,
        contentTitle: detailData.title,
        contentId: detailData.id,
        ...body,
      });
      if (res.code === 0) {
        setPopupType('');
        setComment('');
        setReplyId(undefined);
        if (fetchCommentList) fetchCommentList();
      }
    } catch (e) {
      console.log(e);
    }
    setLoading({ comment: false });
  }, {
    debounceWait: 1000,
    debounceLeading: true,
    manual: true,
  });

  // 自选列表获
  const getSelfList = () => {
    querySelfList({
      // bigMarkets: [...JavaMarket.A.split('-'), JavaMarket.USA, JavaMarket.HKEX],
    })
      .then((res) => {
        if (res.code !== 0) return;
        const { result } = res;
        setOptionList(result);
      })
      .catch((err) => console.log(err, '自选列表获取失败'));
  };

  useEffect(() => {
    console.log('初始化');
    fetchDetailData();
    fetchContent();
    getSelfList();
  }, []);

  const attention = async () => {
    try {
      const res = await (contentData.isFollowed ? cancelFollow : addFollow)({ hisId: contentData.customer.id });
      if (res.code === 0) {
        setContentData({ isFollowed: !contentData.isFollowed });
        return true;
      }
      return false;
    } catch (e) {
      console.log('========操作失败：', e);
      return false;
    }
  };

  return {
    contentData,
    detailData,
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
  };
};

export default useConsultDetail;
