import IconNoMessage from './no_message.png';

import './no-message.scss';

const NoMessage = (props) => {
  const { text = '暂无数据' } = props;

  return (
    <div styleName="no-message">
      <div>
        <img src={IconNoMessage} alt="" />
      </div>
      <div>{text}</div>
    </div>
  );
};

export default NoMessage;
