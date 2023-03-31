import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import { openNewPage } from '@/platforms/mobile/helpers/native/msg';

import IconSuccess from '@/platforms/mobile/images/icon_success.svg';

import './result.scss';

const CurrencyResult = () => {
  const data = {};

  return (
    <div styleName="page">
      <img src={IconSuccess} alt="" />
      <BasicCard styleName="card">

        <div className="f-s-34 f-bold">
          提交成功
        </div>
        <div styleName="desc">
          貨幣兌換已提交成功，請耐心等待
        </div>
        <div className="flex-c-between m-b-47">
          <div className="t-desc f-s-28">買入貨幣</div>
          <div>美元USD</div>
        </div>
        <div className="flex-c-between m-b-47">
          <div className="t-desc f-s-28">買入金額</div>
          <div>30,000.00</div>
        </div>
        <div className="flex-c-between m-b-47">
          <div className="t-desc f-s-28">賣出貨幣</div>
          <div>港幣HKD</div>
        </div>
        <div className="flex-c-between m-b-47">
          <div className="t-desc f-s-28">賣出金額</div>
          <div>30,000.00</div>
        </div>
        <div className="flex-c-between m-b-47">
          <div className="t-desc f-s-28">參考匯率</div>
          <div>0.128</div>
        </div>
        <div className="flex-c-between m-b-20">
          <div className="t-desc f-s-28">參考佣金</div>
          <div>2.00USD</div>
        </div>
      </BasicCard>
      <div styleName="tip">
        <p>温馨提示：</p>
        <p>請不要通過其他渠道重複提交申請，貨幣兌換僅用於結算，請確保證賬戶內有足夠的資金。</p>
      </div>
      <div styleName="submit-btn">完成</div>
      <div
        className="orange-color m-t-30 t-c f-s-28"
        onClick={() => {
          openNewPage({
            path: 'currency-change-list.html',
            fullScreen: false,
            pageType: 1,
            replace: true,
          });
        }}
      >
        貨幣兌換記錄
      </div>
    </div>
  );
};

export default CurrencyResult;
