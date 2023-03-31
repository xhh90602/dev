import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useContext } from 'react';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import whiteIconNoNetWork from '@/platforms/mobile/images/white/no-network.svg';
import blackIconNoNetWork from '@/platforms/mobile/images/black/no-network.svg';
import './load-fail.scss';

const imgObj = {
  white: whiteIconNoNetWork,
  black: blackIconNoNetWork,
};

/**
 * Loading 加载组件
 * @param loading 是否默认开启 可选
 * @param width loading宽度 可选
 * @param height loading高度 可选
 * @param noNetWorkWidth 无网络图片宽度 可选
 * @param noNetWorkHeight 无网络图片高度 可选
 * @param reloadCallback 重试回调函数
 * @param module 模块名称
 */
const LoadFail: React.FC<any> = ({
  noNetWorkWidth = '2.4rem',
  noNetWorkHeight = '2.4rem',
  reloadCallback,
  status = '',
}) => {
  const { theme } = useContext<any>(userConfigContext);

  function reload() {
    if (reloadCallback) {
      reloadCallback();
      return;
    }
    console.log('%c未传参数 reloadCallback', 'background: red');
  }

  return (
    <div styleName="global_loading" style={{ left: status === 'error' ? '0' : '-99999px' }}>
      <div styleName="no-network">
        <div className="no-more" />
        <img
          style={{ width: noNetWorkWidth, height: noNetWorkHeight }}
          alt=""
          src={imgObj[theme]}
        />
        <div>
          <span>
            <FormattedMessage id="network_error_tip" />
          </span>
          ，
          <span styleName="no-network-button" onClick={reload}>
            <FormattedMessage id="no_network_button" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadFail;
