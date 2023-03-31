/* eslint-disable react/require-default-props */
import { useEffect, useMemo, useState } from 'react';
import { getConsultDetail } from '@/api/module-api/consult';
import { closeMessageReminder, getMessageReminder } from '@/api/module-api/trade';
import { useDeepCompareEffect } from 'ahooks';
import { useTradeStore } from '../../model/trade-store';
import { PageType, goToSymbolPage, openNewPage } from '../../helpers/native/msg';
import IconSvg from '../icon-svg';
import './message-reminder.scss';

interface IProps {
  [key:string]: any
}

interface Message {
  content: string;
  customerId: number;
  dateTime: string;
  messageId: string;
  status: 0 | 1; // 0-未读；1已读（关闭）
  stockCode: string;
  type: 1 | 2 | 3; // 1-异常变动；2-公告；3-价格预警
}

let intervalId;

const MessageReminder = (props: IProps) => {
  const { market } = props;
  const [messages, setMessages] = useState<Message[]>([]);
  const finalMessages = useMemo(() => messages.filter((message) => message.status !== 1), [messages]);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const positionList = useTradeStore((s) => s.positionList);

  const fetchList = () => {
    if (positionList[market].length) {
      const stocks = positionList[market].map((item) => ({
        currentQty: item.currentQty,
        stockCode: item.stockCode,
        stockName: item.stockName,
      }));
      getMessageReminder({ stocks }).then((res) => {
        const { code, result } = res;
        if (code === 0) {
          setMessages(result);
        }
      });
    }
  };

  useDeepCompareEffect(() => {
    fetchList();
  }, [market, positionList]);

  const close = async (message: any) => {
    setMessages((s) => s.map((v) => (v.messageId === message.messageId ? { ...v, status: 1 } : v)));
    setCurrentMessageIndex((index) => (index + 1) % finalMessages.length);
    closeMessageReminder({ messages: [message] }).then((res) => {
      const { code } = res;
      if (code === 0) {
        fetchList();
      }
    });
  };

  const handlerCloseClick = (e: Event, message) => {
    e.stopPropagation();
    close(message);
  };

  const handleMessageClick = (message: any) => {
    if (message.type === 2) {
      getConsultDetail({ id: message.messageId, model: 'notice', type: 'public' }).then((res) => {
        const { code, result } = res;
        if (code === 0 && result.attachments.length > 0) {
          close(message);
          openNewPage({
            pageType: PageType.PDF,
            path: result.attachments[0].url,
            title: result.title,
          });
        }
      });
    }
    if ([1, 3].includes(message.type)) {
      const stockMarket = positionList[market].find((item) => item.stockCode === message.stockCode).smallMarket;
      goToSymbolPage({ code: message.stockCode, market: stockMarket });
      close(message);
    }
  };
  useEffect(() => {
    clearInterval(intervalId);
    intervalId = null;
    intervalId = setInterval(() => {
      setCurrentMessageIndex((index) => (index + 1) % finalMessages.length);
    }, 3000);

    return () => {
      clearInterval(intervalId);
      intervalId = null;
    };
  }, [finalMessages]);

  if (finalMessages.length < 1) return null;

  return (
    <div styleName="message-reminder">
      <div styleName="message-carousel">
        <div styleName="message-carousel-inner" style={{ top: `${(-30 / 100) * currentMessageIndex}rem` }}>
          {finalMessages.map((message) => (
            <div styleName="message" key={message.messageId} onClick={() => handleMessageClick(message)}>
              <span styleName="content">
                {message.content}
              </span>
              <IconSvg path="icon_close_popup" click={(e) => handlerCloseClick(e, message)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageReminder;
