import { useConditionStore } from '../../../model';
import './footer.scss';

interface IProps {
  getData: () => any;
  confirmCallback: () => any;
}

const PopupFooter: React.FC<IProps> = (props) => {
  const setCondition = useConditionStore((state) => state.setCondition);

  const { getData, confirmCallback } = props;

  const onConfirm = () => {
    setCondition(getData());
    confirmCallback();
  };

  return (
    <div styleName="footer" onClick={onConfirm}>
      确定
    </div>
  );
};

export default PopupFooter;
