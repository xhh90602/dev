import { Popup } from 'antd-mobile';
import '../trade-form.scss';
import { toThousand } from '@dz-web/o-orange';
import IconMove from '@/platforms/mobile/images/icon_move.svg';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const DragHandle = SortableHandle(() => <img src={IconMove} alt="" />);

const SortableList = SortableContainer(({ children }) => (
  <div>
    {children}
  </div>
));

const SortableItem = SortableElement(({ value }) => (
  <div styleName="table-title" ref={value.ref}>
    <div>
      <div styleName="index">
        {value.i + 1}
      </div>
    </div>
    <div>
      <div className="f-s-26 t-normal m-b-5">{value.v?.portfolioName}</div>
      <div className="f-s-30">{toThousand(value.v?.qty || 0)}</div>
    </div>
    <div>
      <DragHandle />
    </div>
  </div>

));

/** 优先级弹窗 */
const PriorityLevelModal = (props) => {
  const {
    visible,
    onClose,
    stockName = '--',
    list = [],
    callback = () => undefined,
  } = props;

  const [listMap, setListMap] = useState(list);

  useEffect(() => {
    setListMap(list);
  }, [list]);

  const sortEnd = (sortData) => {
    const { oldIndex, newIndex } = sortData;
    const old = list.splice(oldIndex, 1);
    list.splice(newIndex, 0, ...old);

    setListMap([...list]);
  };

  const handlerRef = useRef<any>(null);
  const itemRef = useRef<any>(null);

  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    if (visible
      && handlerRef.current && handlerRef.current.getBoundingClientRect
      && itemRef.current && itemRef.current.getBoundingClientRect
    ) {
      setTimeout(() => {
        console.log(itemRef.current.getBoundingClientRect());

        setTop((handlerRef.current.getBoundingClientRect().top + itemRef.current.getBoundingClientRect().height) / 2);
      }, 500);
    }
  }, [visible, handlerRef.current, itemRef.current]);

  return (
    <Popup
      visible={visible}
      onMaskClick={() => {
        onClose();
      }}
    >
      <div
        styleName="modal title-padding"
        style={{ display: visible ? 'block' : 'none' }}
      >
        <div styleName="title-start">賣出優先級</div>
        <div className="t-desc f-s-26 m-t-15 m-b-40" styleName="p-r-14">
          當前賣出訂單涉及個股和組合，因可能出現部分成交情況，請指定卖出優先級
        </div>
        <div styleName="desc-stock-info">
          <div>
            <div styleName="desc-stock-label">
              {toThousand(list.reduce((p, v) => p + Number(v?.qty), 0))}
            </div>
            <div>总数量</div>
          </div>
          <div>
            <div styleName="desc-stock-label">{stockName}</div>
            <div>名称|代码</div>
          </div>
        </div>
        <div className="m-b-40">
          <div styleName="table-title-bottom table-title">
            <div>優先級</div>
            <div>名称|数量</div>
            <div>拖动</div>
          </div>
          <div
            ref={handlerRef}
            styleName="helper-wrap"
            style={{
              '--margin-top': `-${top}px`,
            }}
          >
            <SortableList
              helperClass="sort-helper"
              useDragHandle
              lockAxis="y"
              helperContainer={handlerRef.current}
              onSortEnd={sortEnd}
            >
              {listMap.map((v, i) => <SortableItem key={v} index={i} value={{ v, i, ref: itemRef }} />)}
            </SortableList>
          </div>
        </div>
        <div styleName="tool">
          <div
            styleName="cancel-btn"
            onClick={() => {
              onClose();
            }}
          >
            取消
          </div>
          <div
            styleName="sure-btn"
            onClick={() => {
              callback(listMap);
            }}
          >
            确定
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default PriorityLevelModal;
