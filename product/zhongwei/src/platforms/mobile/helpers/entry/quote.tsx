/* eslint-disable react/jsx-no-useless-fragment */
import { useContext } from 'react';
import { QuoteClientProvider } from '@dz-web/quote-client-react';
import { userInfoContext, getDisplayName } from '@/platforms/mobile/helpers/entry/native';

export default function wrapQuote(App: React.ReactNode): React.ReactNode {
  const InternalApp: any = () => {
    const userInfo = useContext(userInfoContext);
    const { quoteWsAddress, sessionCode } = userInfo;

    return (
      <QuoteClientProvider
        url={quoteWsAddress}
        token={sessionCode}
      >
        <>
          {App}
        </>
      </QuoteClientProvider>
    );
  };

  InternalApp.displayName = `wrapQuote(${getDisplayName(App)})`;
  return <InternalApp />;
}
