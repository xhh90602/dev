import React, { useEffect, useRef, useState } from 'react';
import { queryIndustrys, querySelectIndustrys } from '@/api/module-api/filter-stock';
import { IndexBar, SearchBar, CheckList } from 'antd-mobile';
import { IndexBarRef } from 'antd-mobile/es/components/index-bar';
import { CheckCircleFill, CloseOutline } from 'antd-mobile-icons';
import { QeqType } from '../../../constants';
import { useConditionStore } from '../../../model';
import './popup-address-list.scss';

interface IProps {
  onMaskClick: () => void;
  title: string;
  field: string;
}

const charCodeOfA = 'A'.charCodeAt(0);

const PopupAddressList: React.FC<IProps> = (props) => {
  const { onMaskClick, title, field } = props;

  const setCondition = useConditionStore((state) => state.setCondition);
  const delCondition = useConditionStore((state) => state.delCondition);
  const remoteConditionValue = useConditionStore((state) => state.value[field]);
  const indexBarRef = useRef<IndexBarRef>(null);
  const [groups, setGroup] = useState<any>([]);
  const [selectedData, setSelectedData] = useState<any>([]);
  const region = useConditionStore((state) => state.region);
  const searchRef = useRef<any>(null);

  /** 获取行业列表数据 */
  const requestMethod = () => {
    queryIndustrys({ region })
      .then((res) => {
        const arr: any = Array(26)
          ?.fill('')
          ?.map((_, i) => ({
            title: String.fromCharCode(charCodeOfA + i),
            items: res?.body?.industrys?.find((item) => item.fpy === String.fromCharCode(charCodeOfA + i))?.list,
          }));
        setGroup([...arr]);
      })
      .catch((err) => {
        console.log(err, '<-- err');
      });
  };

  /** 搜索行业列表数据 */
  const requestSelectMethod = (params: any) => {
    querySelectIndustrys({ ...params, region })
      .then((res) => {
        const arr: any = Array(26)
          ?.fill('')
          ?.map((_, i) => ({
            title: String.fromCharCode(charCodeOfA + i),
            items: res?.body?.industrys?.find((item) => item.fpy === String.fromCharCode(charCodeOfA + i))?.list,
          }));
        const temp: any = [];
        arr.forEach((item) => {
          if (item.items && item.items.length) {
            temp.push(item);
          }
        });
        setGroup([...temp]);
      })
      .catch((err) => {
        console.log(err, '<-- err');
      });
  };

  let timer;
  const _debounce = (fn, delay) => {
    delay = delay || 600;
    return (...args) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args);
      }, delay);
    };
  };

  const onSearch = (key) => {
    if (key) {
      requestSelectMethod({ key });
      indexBarRef.current?.scrollTo(groups[0]?.title);
    } else {
      requestMethod();
      indexBarRef.current?.scrollTo(groups[0]?.title);
    }
  };

  const inputChange = (key) => {
    const fun = _debounce(onSearch, 600);
    fun(key);
  };

  useEffect(() => {
    requestMethod();
    indexBarRef.current?.scrollTo(groups[0]?.title);
  }, []);

  const clearSearchKey = () => {
    searchRef.current?.clear();
  };

  const clickReset = () => {
    clearSearchKey();
    setSelectedData([]);
    setGroup([]);
    requestMethod();
    delCondition(field);
  };

  useEffect(() => {
    if (remoteConditionValue) {
      setSelectedData([...remoteConditionValue.list]);
    } else {
      clickReset();
    }
  }, [remoteConditionValue]);

  const confirm = () => {
    clearSearchKey();
    if (!selectedData.length) {
      delCondition(field);
      onMaskClick();
      return;
    }

    let shortConditionName = '';
    const { length } = selectedData;
    if (length === 1) {
      shortConditionName = selectedData[0].name;
    } else if (length > 1) {
      shortConditionName = `${selectedData[0].name}等${length}个行业`;
    }
    const data = {
      [field]:
      {
        list: selectedData,
        title,
        shortConditionName,
        conditionName: selectedData.map((item) => item.name).join(','),
        type: QeqType.address_list,
        dimension: field,
      },
    };
    setCondition({ ...data });
    onMaskClick();
  };

  /** 点击每个行业的触发事件 */
  const clickItem = (item) => {
    const arr = [...selectedData];
    const idx = arr.findIndex((ele) => ele?.code === item?.code);
    if (idx > -1) {
      arr.splice(idx, 1);
    } else {
      arr.push(item);
    }
    setSelectedData([...arr]);
  };

  return (
    <div styleName="industury-pop">
      <div styleName="title-container">
        <CloseOutline fontSize={18} color="#717686" onClick={onMaskClick} />
        <span styleName="title-style">{title}</span>
      </div>

      <SearchBar
        ref={searchRef}
        placeholder="请输入行业"
        styleName="search-style"
        clearOnCancel
        onClear={() => clearSearchKey()}
        onSearch={(v) => onSearch(v)}
        onChange={(v) => inputChange(v)}
      />
      <div styleName="list-box" style={{ height: window.innerHeight - 160 }}>
        <IndexBar ref={indexBarRef}>
          {groups.map((group) => {
            const { title: gTitle, items } = group;
            return (
              <IndexBar.Panel
                index={gTitle}
                title={`${gTitle}`}
                key={`${gTitle}`}
                styleName="item-header"
              >
                <CheckList
                  multiple
                  defaultValue={[...selectedData.map((it) => it.code)]}
                  activeIcon={<CheckCircleFill color="#fa6d16" style={{ marginRight: 40 }} />}
                >
                  {items?.map((item) => (
                    <CheckList.Item
                      value={item?.code}
                      key={item?.code}
                      onClick={() => clickItem(item)}
                      styleName="item-style"
                    >
                      {item?.name}
                    </CheckList.Item>
                  ))}
                </CheckList>
              </IndexBar.Panel>
            );
          })}
        </IndexBar>
      </div>
      <div styleName="btn-container">
        <span
          onClick={clickReset}
          styleName="reset-style"
        >
          重置
        </span>
        <span onClick={confirm}>确定</span>
      </div>
    </div>
  );
};

export default PopupAddressList;
