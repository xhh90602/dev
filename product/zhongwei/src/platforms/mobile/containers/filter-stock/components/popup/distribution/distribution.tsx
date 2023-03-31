import { useEffect, useMemo, useState } from 'react';
import { Popup } from 'antd-mobile';
import { queryDialogInfo } from '@/api/module-api/filter-stock';

import PopupSlider from '../popup-silder/popup-slider';
import PopupPicker from '../popup-picker/popup-picker';
import PopupAddressList from '../popup-address-list/popup-address-list';

import { PopupType } from '../../../constants';

import './distribution.scss';

interface IProps {
  visible: boolean;
  onMaskClick: () => void;
  dialogInfo: any;
  setConditionValue?: () => void;
  onConfirm?: () => void;
}

const PopupDistribution: React.FC<IProps> = (props) => {
  const { visible, onMaskClick, dialogInfo, onConfirm } = props;

  const [condition, setCondition] = useState(null);

  const PopupContent = useMemo(() => {
    switch (dialogInfo.type) {
      case PopupType.picker:
        return PopupPicker;
      case PopupType.address_list:
        return PopupAddressList;
      default:
        return PopupSlider;
    }
  }, [dialogInfo.type]);

  useEffect(() => {
    const { type: dialogType, id } = dialogInfo;
    if (!dialogType || !id) return;
    queryDialogInfo({ type: dialogType, categoryId: id })
      .then((res) => {
        setCondition(res.result);
      })
      .catch((err) => {
        console.log(err, '<-- err');
      });
  }, [dialogInfo.type, dialogInfo.id]);

  if (!condition) return null;

  return (
    <Popup
      visible={visible}
      onMaskClick={onMaskClick}
      position="bottom"
    >
      <div styleName="popup">
        <div styleName="main">
          <PopupContent
            visible={visible}
            onMaskClick={onMaskClick}
            condition={condition}
            dialogInfo={dialogInfo}
            title={dialogInfo.name}
            field={dialogInfo?.value}
            onConfirm={onConfirm}
          />
        </div>
      </div>
    </Popup>
  );
};

export default PopupDistribution;
