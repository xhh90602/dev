import TradeBasicModal from '@/platforms/mobile/components/trade-basic-modal/trade-basic-modal';
import { openNewPage } from '@/platforms/mobile/helpers/native/msg';
import './currency-change.scss';

const CurrencyModal = (props) => {
  const { visible, onClose, data } = props;
  console.log(data);

  const list = [
    { label: '账户号码', content: () => '123123123' },
    { label: `買入${data.changeCurrency.label}`, content: () => `${data.changeNum}${data.changeCurrency.key}` },
    { label: `賣出${data.currCurrency.label}`, content: () => `${data.currNum}${data.currCurrency.key}` },
    { label: '參考匯率', content: () => data.rate },
    { label: '參考佣金', content: () => '123123123' },
  ];

  return (
    <TradeBasicModal
      visible={visible}
      title="貨幣兌換明細"
      list={list}
      content={(
        <div styleName="desc-card-bottom">
          預計將買入
          {data.changeNum}
          {data.changeCurrency.label}
          ，最終兌換數據以實際結算匯率為準。
        </div>
      )}
      background
      onClose={onClose}
      callback={() => {
        openNewPage({
          path: 'currency-change-result.html',
          fullScreen: false,
          pageType: 1,
          replace: true,
        });
      }}
    />
  );
};

export default CurrencyModal;
