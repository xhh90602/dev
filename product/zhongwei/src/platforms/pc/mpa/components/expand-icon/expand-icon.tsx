import React from 'react';

interface ExpandIconProps {
  expandedRecord: Record<string, any>;
  formatMessage: any;
  clickCallBack?: any;
}

const ExpandIcon: React.FC<ExpandIconProps> = (props) => {
  const {
    expandedRecord: { expanded, onExpand, record },
    formatMessage,
    clickCallBack,
  } = props;

  const handleClick = (e) => {
    e?.stopPropagation();
    onExpand(record, e);
  };

  if (expanded) {
    return (
      <span className="operate-btn-text" onClick={handleClick}>
        {formatMessage({ id: '收起详情' })}
      </span>
    );
  }

  return (
    <span
      className="operate-btn-text"
      onClick={(e) => {
        if (clickCallBack) clickCallBack(record);
        handleClick(e);
      }}
    >
      {formatMessage({ id: '展开详情' })}
    </span>
  );
};

ExpandIcon.defaultProps = {
  clickCallBack: null,
};

export default ExpandIcon;
