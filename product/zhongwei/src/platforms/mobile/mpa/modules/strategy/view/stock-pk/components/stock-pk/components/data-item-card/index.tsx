import React, { memo, useState } from 'react';
import TitleCard from '../title-card';
import './index.scss';

const DataItemCard: React.FC<any> = memo((props: any) => {
  const {
    list,
    showCondition = false,
    defaultOpen = false,
    title = '',
    cycle = '',
    selectItem = null,
    setItem = () => null,
    setCycle = () => null,
  } = props;
  const [open, setOpen] = useState(defaultOpen);

  // 点击事件
  const lineClick = (item) => {
    if (item?.echartType) {
      setItem(item);
    }
  };

  return (
    <div styleName="data-item-card">
      <div styleName="data-item-card-box">
        <TitleCard
          title={title}
          showCondition={showCondition}
          open={open}
          cycle={cycle}
          setCycle={(item) => setCycle(item.key)}
          setOpen={(bool) => setOpen(bool)}
        />
        {
          open && (
            <div styleName="list-box">
              <div styleName="item-box">
                {
                  list.map((item) => (
                    <div
                      styleName={
                        selectItem && item.moduleName === selectItem?.moduleName
                          && item.field === selectItem?.field
                          ? 'label-item active' : 'label-item'
                      }
                      key={item.name}
                    >
                      <div styleName="label" onClick={() => lineClick(item)}>{item.name}</div>
                    </div>
                  ))
                }
              </div>
              <div styleName="data-box">
                {
                  list.map((item) => (
                    <div
                      styleName={
                        selectItem && item.moduleName === selectItem?.moduleName
                          && item.field === selectItem?.field
                          ? 'data-item active' : 'data-item'
                      }
                      key={item.name}
                      onClick={() => lineClick(item)}
                    >
                      <div styleName="data">{item?.data1 || '--'}</div>
                      <div styleName="data">{item?.data2 || '--'}</div>
                      <div styleName="data">{item?.data3 || '--'}</div>
                      <div styleName="data">{item?.data4 || '--'}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
});

export default DataItemCard;
