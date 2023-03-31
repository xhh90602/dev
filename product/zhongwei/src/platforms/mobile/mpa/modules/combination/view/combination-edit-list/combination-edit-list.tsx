import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Toast } from 'antd-mobile';
import { getCombination, delCombination, combinationSort } from '@/api/module-api/combination';
import Empty from '@/platforms/mobile/components/combination/empty';
import { settingHeaderButton, openNativePage, PageType, NativePages, goBack } from '@mobile/helpers/native/msg';
import { headerButtonCallBack } from '@mobile/helpers/native/register';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useGetState } from 'ahooks';
import NotSelect from '@/platforms/mobile/images/icon_not_select.svg';
import IconSelect from '@/platforms/mobile/images/icon_select.svg';
import IconEdit from '@/platforms/mobile/images/icon_edit_01.svg';
import IconTop from '@/platforms/mobile/images/icon_top_01.svg';
import IconMove from '@/platforms/mobile/images/icon_move.svg';
import Dialog from './components/dialog';

import './combination-edit-list.scss';

const AppHome: React.FC = () => {
  const [list, setList, getList] = useGetState<any>([]);
  const [selectList, setSelectList] = useState<any>([]);
  const [show, setShow] = useState<boolean>(false);
  const { formatMessage } = useIntl();

  // 获取组合列表
  const getCombinationList = () => {
    getCombination({}).then((res: any) => {
      if (res && res.code === 0) {
        setList(res?.result || []);
      }
      return [];
    });
  };

  // 保存排序
  const saveSort = () => {
    const sortDTOList = getList().map(({ portfolioId }, sort) => ({
      portfolioId,
      sort,
    }));
    combinationSort({ sortDTOList }).then((res) => {
      if (res && res.code === 0) {
        Toast.show({ content: formatMessage({ id: 'save_success' }) });
        setTimeout(() => {
          goBack();
        }, 1200);
      } else {
        Toast.show({ content: res.message });
      }
    });
  };

  // 选择
  const onSelect = (id) => {
    const idx = selectList.indexOf(id);
    const temp = selectList || [];
    if (selectList && selectList.length > 0 && idx > -1) {
      temp.splice(idx, 1);
    } else {
      temp.push(id);
    }
    setSelectList([...temp]);
  };

  // 删除
  const delClick = () => {
    if (selectList && selectList.length) {
      delCombination({ portfolioIds: selectList }).then((res) => {
        if (res && res.code === 0) {
          getCombinationList();
          setSelectList([]);
          Toast.show({ content: formatMessage({ id: 'del_success' }) });
        } else {
          Toast.show({ content: res.message });
        }
      });
    }
    setShow(false);
  };

  // 全选
  const selectAll = () => {
    if (!selectList.length) {
      setSelectList(getList().map((item) => item.portfolioId));
    } else {
      setSelectList([]);
    }
  };

  // 置顶
  const onTopClick = (index) => {
    getList().unshift(getList().splice(index, 1)[0]);
    setList([...getList()]);
  };

  // 右上角 完成  按钮
  const FinishCallback = () => {
    saveSort();
  };

  useEffect(() => {
    settingHeaderButton([{
      text: formatMessage({ id: 'finish' }),
      textColor: '#fa6d16',
      textFontSize: 30,
      position: 'right',
      index: 1,
      onClickCallbackEvent: 'headerButtonCallBack',
    }]).then((res) => {
      console.log('设置完成按钮', res);
    });
    headerButtonCallBack(() => FinishCallback());
  }, []);

  // 判断是否有人订阅
  const isUserSub = selectList.some((item) => {
    const idx = getList().findIndex((ele) => ele.portfolioId === item);
    return getList()[idx].userSub === '1';
  });

  // 拖动结束
  const onSortEnd = (e) => {
    const { newIndex, oldIndex } = e;
    const oldItem = getList().splice(oldIndex, 1)[0];
    getList().splice(newIndex, 0, oldItem);
    setList([...getList()]);
  };

  const DragHandle = SortableHandle(() => (
    <div styleName="tool">
      <img src={IconMove} alt="" />
    </div>
  ));

  const ElementItem = SortableElement(({ item }) => {
    const data = { ...item.item, index: item.index };
    return (
      <div styleName="combination-edit-list-item">
        <div styleName="label-box" onClick={() => onSelect(data.portfolioId)}>
          {
            selectList.includes(data.portfolioId) ? (
              <img src={IconSelect} alt="" />
            ) : (
              <img src={NotSelect} alt="" />
            )
          }
          <div styleName="label">{data?.name || '--'}</div>
        </div>
        <div
          styleName="tool"
          onClick={
            () => nativeOpenPage(`create-combination.html?portfolioId=${data.portfolioId}`)
          }
        >
          <img src={IconEdit} alt="" />
        </div>
        <div styleName="tool" onClick={() => onTopClick(data.index)}>
          <img src={IconTop} alt="" />
        </div>
        <DragHandle />
      </div>
    );
  });

  const Container = SortableContainer(({ children }) => <div>{children}</div>);

  useEffect(() => {
    getCombinationList();
  }, []);

  const goToSubCenter = () => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.sub_center,
      fullScreen: true,
    });
  };

  return (
    <>
      <div styleName="combination-edit-list">
        {
          getList() && getList().length > 0 ? (
            <>
              <div styleName="combination-edit-head">
                <div styleName="list">
                  <div styleName="label d1">{formatMessage({ id: 'combination_name' })}</div>
                  <div styleName="label d2">{formatMessage({ id: 'edit' })}</div>
                  <div styleName="label d2">{formatMessage({ id: 'top' })}</div>
                  <div styleName="label d2">{formatMessage({ id: 'drag' })}</div>
                </div>
              </div>
              <Container
                axis="y"
                lockAxis="y"
                useDragHandle
                distance={10}
                onSortEnd={(e) => onSortEnd(e)}
              >
                {
                  getList().map((item, index) => (
                    <ElementItem key={item.portfolioId} index={index} item={{ item, index }} />
                  ))
                }
              </Container>
            </>
          ) : (
            <div styleName="empty-box">
              <Empty />
            </div>
          )
        }
        <div styleName="tool-bar">
          <div styleName="left" onClick={() => selectAll()}>
            {
              selectList && getList() && selectList.length === getList().length ? (
                <img src={IconSelect} alt="" />
              ) : (
                <img src={NotSelect} alt="" />
              )
            }
            <div styleName="label">{formatMessage({ id: 'all_select' })}</div>
          </div>
          <div
            styleName="right"
            onClick={() => selectList.length && setShow(true)}
          >
            {`${formatMessage({ id: 'del' })}(${selectList.length})`}
          </div>
        </div>
      </div>

      <Dialog
        show={show}
        userSub={isUserSub}
        value={selectList.length}
        cancelClick={() => setShow(false)}
        confirmClick={() => delClick()}
        goSubscription={() => goToSubCenter()}
      />
      {
        process.env.NODE_ENV === 'development' ? (
          <div styleName="btn-box">
            <div styleName="btn" onClick={() => saveSort()}>{formatMessage({ id: 'finish' })}</div>
          </div>
        ) : null
      }
    </>
  );
};

export default AppHome;
