/* eslint-disable consistent-return */
import * as React from 'react';
import { ClientEventType, LoggerLevel, QuoteClient } from 'quote-ws-client-for-dz';
import { QuoteConnectStatus } from '@/platforms/mobile/constants/enum/quote';
import { IServerConfig } from '../use-init-native';

interface IClientContext {
  client: QuoteClient;
  isQuoteReady: boolean;
  quoteConnectStatus: QuoteConnectStatus;
}

export const ClientContext = React.createContext<IClientContext | null>(null);
ClientContext.displayName = 'ClientContext';

interface IProps {
  token: string | undefined;
  serverConfig: IServerConfig;
}

const ClientProvider: React.FC<IProps> = (props) => {
  const { children, token, serverConfig } = props;
  const clientRef = React.useRef<QuoteClient>(null);
  const isConnecting = React.useRef(false);
  const timeRef = React.useRef<NodeJS.Timeout | null>(null);
  const [quoteConnectStatus, setQuoteConnectStatus] = React.useState<QuoteConnectStatus>(QuoteConnectStatus.READY);
  const [isConnect, setIsConnect] = React.useState(false);

  React.useEffect(() => {
    if (!token || !serverConfig?.websocketServer) return;
    // const wsAddress = serverConfig.websocketServer.replace('ws:', 'wss:').replace(':10001', '/quote');

    const serverAry = [
      {
        delay: `${serverConfig.websocketServer}?token=${token}`,
        live: `${serverConfig.websocketServer}?token=${token}`,
        name: 'cn1',
      },
    ];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    clientRef.current = new QuoteClient({
      // logLevel: MODE === 'UAT' ? LoggerLevel.ERROR : LoggerLevel.ALL,
      logLevel: LoggerLevel.ERROR,
      servers: serverAry,
      extraParams: {},
    });

    function onReady() {
      isConnecting.current = false;
      setIsConnect(true);
      setQuoteConnectStatus(QuoteConnectStatus.READY);
    }

    function onLost() {
      isConnecting.current = false;
      setIsConnect(false);
      setQuoteConnectStatus(QuoteConnectStatus.LOST);

      if (timeRef.current) window.clearTimeout(timeRef.current);
      (timeRef.current as NodeJS.Timeout) = setTimeout(() => {
        // onAuthFailed();
        (clientRef.current as QuoteClient).connect();
      }, 15000); // 等待15s再重新获取token，重新连接ws
    }

    function onConnecting() {
      isConnecting.current = true;
      setQuoteConnectStatus(QuoteConnectStatus.CONNECTING);
    }

    function destroy() {
      if (timeRef.current) {
        window.clearTimeout(timeRef.current);
        timeRef.current = null;
      }
      if (!clientRef.current) return;

      clientRef.current.removeEventListener(ClientEventType.READY, onReady);
      clientRef.current.removeEventListener(ClientEventType.LOST, onLost);
      clientRef.current.removeEventListener(ClientEventType.CONNECTING, onConnecting);
      setQuoteConnectStatus(QuoteConnectStatus.CLOSE);
      setIsConnect(false);
      clientRef.current.destroy();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      clientRef.current = null;

      // 等待3s再删除client，防止子组件滞后收到通知
      // setTimeout(() => {
      //   console.log(clientRef.current, '<-- clientRef.current');
      //   if (!clientRef.current) return;

      //   clientRef.current.destroy();
      //   clientRef.current = null;
      // }, 3000);
    }

    clientRef.current.addEventListener(ClientEventType.READY, onReady);
    clientRef.current.addEventListener(ClientEventType.LOST, onLost);
    clientRef.current.addEventListener(ClientEventType.CONNECTING, onConnecting);
    clientRef.current.connect();

    return destroy;
  }, [token, serverConfig]);

  // if (!token) return <></>;

  return (
    <ClientContext.Provider
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      value={{ client: clientRef.current,
        isQuoteReady: Boolean(isConnect && clientRef.current),
        quoteConnectStatus }}
    >
      {children}
    </ClientContext.Provider>
  );
};
export default ClientProvider;

export const useClient = () => {
  const context = React.useContext(ClientContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider中使用');
  }
  return context;
};
