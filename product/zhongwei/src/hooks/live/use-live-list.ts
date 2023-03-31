/**
 * 获取直播,预告,录播列表hooks
 * 包含录播向下滚动加载更多
 * 2022-09-20
 */
import React from 'react';
import { useIntl } from 'react-intl';
import * as interfaceLive from '@/api/module-api/live';
import messageHelpers from '@mobile-mpa/modules/live/components/messageHelper';

const { useState, useEffect, useCallback } = React;

export default function useLiveList() {
  const { formatMessage } = useIntl();
  const [preList, setList] = useState<any>([]);
  const [record, setRecord] = useState<any>([]);
  const [live, setLive] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [pages, setPages] = useState<any>({ pageNum: 0, pageSize: 10 });
  const {
    getLiveList, // 获取直播列表
    getLiveRecordList, // 获取回放列表
    getLiveTrailerList, // 获取预告列表
  } = interfaceLive;

  // 获取直播列表
  const getLiveData = () => {
    getLiveList({}).then((res: any) => {
      console.log('直播res===>', res);
      const { code, result, message } = res;
      const { records } = result;
      if (code !== 0) {
        messageHelpers.fail(message);
        return;
      }
      if (records.length) {
        setLive(records);
      }
    }).catch((err: any) => {
      console.log('直播err===>', err);
      const { code, message } = err;
      if (code) {
        messageHelpers.fail(message);
      }
    });
  };

  // 获取录播列表
  let flag = true;
  const getRecordData = useCallback((scroll) => {
    if (!flag) return;
    flag = false;
    try {
      messageHelpers.loading(formatMessage({ id: 'loading' }));
      getLiveRecordList({
        ...pages,
        pageNum: (pages.pageNum + 1),
      }).then((res: any) => {
        messageHelpers.clear();
        console.log('录播res===>', res);
        const { code, result, message } = res;
        const { records } = result;
        if (code !== 0) {
          messageHelpers.fail(message);
          setHasMore(false);
          return;
        }
        if (code === 0 && records.length) {
          messageHelpers.clear();
          let temp = [];
          if (scroll) {
            temp = (record && record.length && record.concat(records)) || records;
          } else {
            temp = records;
          }
          setRecord(temp);
          setPages((pre) => ({ ...pre, pageNum: pre.pageNum + 1 }));
          flag = true;
        } else {
          flag = true;
          setHasMore(false);
        }
      }).catch(() => {
        messageHelpers.clear();
        flag = true;
        setHasMore(false);
      });
    } catch (error) {
      messageHelpers.clear();
      flag = true;
      setHasMore(false);
      console.log('error===>', error);
    }
  }, [hasMore, pages, record]);

  // 获取预告列表
  const getPreData = () => {
    getLiveTrailerList({}).then((res: any) => {
      messageHelpers.clear();
      console.log('预告res===>', res);
      const { code, result, message } = res;
      // const { records } = result;
      if (code !== 0) {
        messageHelpers.fail(message);
        return;
      }
      if (result?.records?.length) {
        setList(result?.records);
      }
    });
  };

  useEffect(() => {
    // messageHelpers.loading(formatMessage({ id: 'loading' }));
    getLiveData();
    // getRecordData();
    getPreData();
  }, []);

  return {
    preList,
    record,
    live,
    hasMore,
    getRecordData,
  };
}
