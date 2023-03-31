/* eslint-disable consistent-return */
import { useState, useMemo, useRef, useEffect } from 'react';
import classNames from 'classnames';
import IconDel from '@/platforms/mobile/images/icon_delete.svg';

import PopupDistribution from '../popup/distribution/distribution';
import { useConditionStore } from '../../model';

import './filter.scss';

interface IProps {
  category: any[];
}

const Filter: React.FC<IProps> = (props) => {
  const { category } = props;

  const conditionValue = useConditionStore((state) => state.value);
  const delCondition = useConditionStore((state) => state.delCondition);

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [chosenItemInfo, setChosenItemInfo] = useState<any>({});
  const [isShowPopup, setIsShowPopup] = useState(false);

  const chooseItem = (info: any) => {
    setChosenItemInfo(info);
    setIsShowPopup(true);
  };

  const deChooseItem = (e, key: string, val) => {
    const arr = ['ma', 'macd', 'boll', 'rsi', 'kdj'];
    let field = '';
    if (val && arr.includes(val)) {
      field = `${val}-${key}`;
    } else {
      field = key;
    }
    delCondition(field);
    e.stopPropagation();
  };
  const categoryWithAnalyse = useMemo(() => {
    if (category && category.length) {
      return category?.map((item) => {
        const { vos = [] } = item;
        let total = 0;
        vos.forEach((vosItem) => {
          if (vosItem?.vos) {
            const key = vosItem.value;
            vosItem.vos.forEach((ele: { value: string | number; }) => {
              const arr = ['ma', 'macd', 'boll', 'rsi', 'kdj'];
              if (arr.includes(key)) {
                if (conditionValue[`${key}-${ele.value}`]) total += 1;
              }
            });
          } else if (conditionValue[vosItem.value]) total += 1;
        });
        return { ...item, total };
      });
    }
    return [];
  }, [category, conditionValue]);

  const container = useRef<any>(null);

  // 滚动切换tab
  const scrollHandler = () => {
    const scrollTop = container?.current.scrollTop;
    const list: any = document.getElementsByClassName('group');
    Array.from(list).forEach((item: any, index) => {
      if (scrollTop >= item.offsetTop && scrollTop <= item.offsetTop + item.clientHeight) {
        setActiveCategoryIndex(index + 1);
      }

      if (scrollTop <= list[0].offsetTop) {
        setActiveCategoryIndex(0);
      }
    });
  };

  let timer;
  const _debounce = (fn, delay = 100) => {
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

  useEffect(() => {
    if (!categoryWithAnalyse.length) return;
    if (container?.current) {
      container?.current.addEventListener('scroll', _debounce(scrollHandler));
    }
    return () => (container?.current && container?.current.removeEventListener('scroll', scrollHandler)) || null;
  }, [container.current, categoryWithAnalyse]);

  return (
    <div styleName="filter">
      <ol styleName="list">
        {
          categoryWithAnalyse?.map((item, index) => (
            <li
              styleName={classNames('item', {
                'item-active': activeCategoryIndex === index,
              })}
              key={item.id}
              onClick={() => {
                const target = document.getElementById(`${item.id}-8`);
                target?.scrollIntoView({ behavior: 'smooth' });
                setActiveCategoryIndex(index);
              }}
            >
              {item.name}
              {
                !!item.total && (
                  <span styleName="item-total" className="num-font">
                    {item.total}
                  </span>
                )
              }
            </li>
          ))
        }
      </ol>

      <div styleName="container" ref={container}>
        {
          category?.map((categoryItem) => (
            <div styleName="group" key={categoryItem.id} className="group">
              <h3 styleName="group-title" id={`${categoryItem.id}-8`}>
                {categoryItem.name}
              </h3>

              <ol styleName="group-list">
                {
                  (categoryItem?.vos ?? []).map((item) => {
                    if (!item?.vos) {
                      const isChosen = item.value in conditionValue;
                      const chosenInfo = conditionValue[item.value] || {};
                      return (
                        <li
                          styleName={classNames({
                            'group-item-chosen': isChosen,
                            'group-item': true,
                          })}
                          key={item.id}
                          onClick={() => chooseItem(item)}
                        >
                          <p styleName="group-item-title">{item.name}</p>

                          {
                            isChosen && (
                              <>
                                {chosenInfo.periodText
                                  && (
                                    <p styleName="group-item-condition">
                                      {chosenInfo.periodText}
                                    </p>
                                  )}

                                {
                                  chosenInfo.conditionName
                                  && (
                                    <p styleName="group-item-condition">
                                      {chosenInfo.shortConditionName || chosenInfo.conditionName}
                                    </p>
                                  )
                                }

                                <div styleName="group-item-del" onClick={(e) => deChooseItem(e, item.value, '')}>
                                  <img src={IconDel} alt="" />
                                </div>
                              </>
                            )
                          }
                        </li>
                      );
                    }
                    return (
                      <div styleName="three-group-list" key={item.id}>
                        <div styleName="three-group-box">
                          <div styleName="three-group-name">{item.name}</div>
                          <ol styleName="three-group-module">
                            {
                              item.vos.map((ele) => {
                                const isChosen = (`${item.value}-${ele.value}` in conditionValue);
                                const chosenInfo = conditionValue[`${item.value}-${ele.value}`] || {};
                                return (
                                  <li
                                    styleName={classNames({
                                      'group-item-chosen': isChosen,
                                      'group-item': true,
                                    })}
                                    key={ele.id}
                                    onClick={() => chooseItem({ ...ele, parentValue: item.value })}
                                  >
                                    <p styleName="group-item-title">{ele.name}</p>
                                    {
                                      isChosen && (
                                        <>
                                          {chosenInfo.periodText
                                            && (
                                              <p styleName="group-item-condition">
                                                {chosenInfo.periodText}
                                              </p>
                                            )}

                                          {
                                            chosenInfo.conditionName
                                            && (
                                              <p styleName="group-item-condition">
                                                {chosenInfo.shortConditionName || chosenInfo.conditionName}
                                              </p>
                                            )
                                          }

                                          <div
                                            styleName="group-item-del"
                                            onClick={(e) => deChooseItem(e, ele.value, item.value)}
                                          >
                                            <img src={IconDel} alt="" />
                                          </div>
                                        </>
                                      )
                                    }
                                  </li>
                                );
                              })
                            }
                          </ol>
                        </div>
                      </div>
                    );
                  })
                }
              </ol>
            </div>
          ))
        }
      </div>

      <PopupDistribution
        visible={isShowPopup}
        onMaskClick={() => setIsShowPopup(false)}
        dialogInfo={chosenItemInfo}
        key={chosenItemInfo.id}
      />
    </div>
  );
};

export default Filter;
