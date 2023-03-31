import { useEffect, useState, useRef, useContext } from 'react';
import { getMessageCenterData, getSendRead, getMsgDelete } from '@/api/module-api/msg';
import { userConfigContext } from '@/platforms/pc/helpers/entry/native';
import { openWindow } from '@/platforms/pc/helpers/native/msg';

export interface ISystems {
  list?: any;
  setMsgType?: any;
  pageNum?: any;
  setPageNum?: any;
  getRead?: any;
  getDelete?: any;
  noMore?: any;
  ellipsis?: boolean;
  msgType?: number;
  isLoading?: boolean;
}
export default function useData(): ISystems {
  const { language } = useContext(userConfigContext);
  const [list, setList] = useState([]);
  const [msgType, setMsgType] = useState(100);
  const [ellipsis, setEllipsis] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const noMore = useRef(false); // 是否加载下一页
  const [isLoading, setIsLoading] = useState(false);

  // 获取列表数据
  function getSystemList() {
    if (noMore.current) return;
    setIsLoading(true);
    getMessageCenterData({ msgType, pageNum, pageSize: 10 }, language)
      .then((res) => {
        setIsLoading(false);
        if (!res) return;
        const { result } = res;
        const { current, records, pages } = result;
        const data = current > 1 ? [...list, ...records] : result.records;
        if (current >= pages) {
          // console.log('加载完毕');
          noMore.current = true;
        }
        setList(data);
      })
      .catch((err) => {
        console.log(err, '<--获取系统消息失败');
      });
  }

  // 已读
  function getRead(item) {
    getSendRead({ infoId: item.id, msgType: item.msgType }, language)
      .then((res) => {
        if (res?.code === 0) {
          setList((oldList: any) => oldList.map((k) => {
            if (k.id === item.id) return { ...k, readStatus: 1 };
            return k;
          }));
        }
        console.log(item, '点击已读之后');
        setEllipsis(!ellipsis);
        // 资讯的，弹窗显示查看详情
        if (item.msgType === 300) {
          console.log('跳转详情');
          // nativeOpenPage(`article-home.html?id=${item.url || item.id}`);
          // eslint-disable-next-line max-len
          // const newWindow:any = window.open(`http://192.168.11.185:23572/article-home.html?id=${item.url || item.id}`);
          // newWindow.opener = null;
          openWindow('资讯推送详情', `http://192.168.11.185:23572/article-home.html?id=${item.url || item.id}`);
        }
      })
      .catch((err) => {
        console.log(err, '<___已读失败');
      });
  }

  // 删除
  function getDelete() {
    getMsgDelete({ msgType }, language)
      .then(() => {
        setList([]);
      })
      .catch((err) => {
        console.log(err, '<__一键删除失败');
      });
  }
  useEffect(() => {
    getSystemList();
  }, [msgType, pageNum]);

  return {
    list,
    setMsgType,
    pageNum,
    setPageNum,
    getRead,
    getDelete,
    noMore,
    ellipsis,
    msgType,
    isLoading,
  };
}
