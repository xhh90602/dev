import { QuoteClientProvider } from 'quote-client-react';
import useInitNative from '@pc/hooks/use-init-native';
import { getDisplayName } from './native';

export default function wrapQuote(App: React.ReactNode): React.ReactNode {
  const InternalApp = () => {
    const { quoteWsAddress, userInfo } = useInitNative();

    return (
      <QuoteClientProvider
        wsServerAddress={quoteWsAddress}
        token={userInfo.token}
      >
        {App}
      </QuoteClientProvider>
    );
  };

  InternalApp.displayName = `wrapQuote(${getDisplayName(App)})`;
  return <InternalApp />;
}
