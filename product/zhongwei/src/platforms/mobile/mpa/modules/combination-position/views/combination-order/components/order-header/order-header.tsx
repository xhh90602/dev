import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { TextArea, Toast } from 'antd-mobile';
import { toThousand, toFixed, toPercent } from '@dz-web/o-orange';
import BasicModal from '@mobile/components/basic-modal/basic-modal';
import './order-header.scss';

interface IProps {
  combineInfo: Record<string, any>;
  handleRename: (...args: any[]) => any;
}

const OrderHeader: React.FC<IProps> = (props) => {
  const { combineInfo, handleRename } = props;
  const { formatMessage } = useIntl();

  const textAreaRef = useRef<any>();
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);

  const handleCancel = () => {
    textAreaRef.current.clear();

    setModifyVisible(false);
  };

  const handleConfirm = () => {
    const textAreaValue = textAreaRef.current.nativeElement.value;

    const text = textAreaValue.replace(/[\u4e00-\u9fa5]/g, '$&$&');
    const isValid = /^[\u4E00-\u9FA5A-Za-z0-9_]{1,32}$/g.test(text);

    if (!isValid) {
      Toast.show({
        content: `${formatMessage({ id: 'modify_combination_name_tips' })}(${formatMessage({
          id: 'modify_combination_name_placeholder',
        })})`,
        duration: 3000,
        maskClickable: false,
      });

      return;
    }

    handleRename(textAreaValue, handleCancel);
  };

  return (
    <>
      <div styleName="combination-info">
        <p styleName="name">{combineInfo.name}</p>
        <p styleName="modify-name" onClick={() => setModifyVisible(true)} />
      </div>

      <div styleName="asset-info">
        <div styleName="asset-info-item">
          <p styleName="value" className="num-font">
            {toThousand(toFixed(combineInfo.surplusCapital))}
          </p>
          <p styleName="label">{formatMessage({ id: 'remaining_configurable_amount' })}</p>
        </div>

        <div styleName="asset-info-item">
          <p styleName="value" className="num-font">
            {toPercent(combineInfo.surplusCapitalProportion, { multiply: 100 })}
          </p>
          <p styleName="label">{formatMessage({ id: 'ratio' })}</p>
        </div>
      </div>

      <BasicModal
        visible={modifyVisible}
        title={formatMessage({ id: 'modify_combination_name' })}
        confirmText={formatMessage({ id: 'confirm' })}
        cancelText={formatMessage({ id: 'cancel' })}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        <div styleName="modify-name-box">
          <TextArea
            ref={textAreaRef}
            rows={1}
            autoSize={{ maxRows: 5 }}
            placeholder={formatMessage({ id: 'modify_combination_name_placeholder' })}
          />
        </div>
      </BasicModal>
    </>
  );
};

export default React.memo(OrderHeader);
