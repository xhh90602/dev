import { memo } from 'react';
import './basic-card.scss';

interface IBasicCard {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const BasicCard = (props: IBasicCard) => {
  const { className, children, onClick } = props;

  return (
    <div className={`${className} basic-card`} onClick={onClick}>
      {
        children
      }
    </div>
  );
};

BasicCard.defaultProps = {
  className: '',
  onClick: () => undefined,
};

export default memo(BasicCard);
