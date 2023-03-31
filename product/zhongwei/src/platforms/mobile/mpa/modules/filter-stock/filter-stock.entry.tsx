import { useState, useEffect } from 'react';
import { Button } from 'antd-mobile';
import {
  settingNavigationTitle,
  sessionStorageSetItem,
  sessionStorageGetItem,
  sessionStorageRemoveItem,
} from '@mobile/helpers/native/msg';
import generatePage from '@mobile/helpers/generate-page';
import { store } from '@/model/store';
import FilterStock from '@mobile/containers/filter-stock/filter-stock';
import logger from '@mobile/helpers/logger';
import zhHans from './lang/zh-hans';
import zhHant from './lang/zh-hant';

const WrapApp = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isShowFilterResult, setIsShowFilterResult] = useState(false);

  const getFilterResult = (data: any[]) => {
    console.log(data, '<-- data');
  };

  const setData = () => {
    sessionStorageSetItem({ key: 'test', value: [234, 1] });
  };

  const getData = async () => {
    const data = await sessionStorageGetItem({ key: 'test' });
    console.log(data, '<-- data');
  };

  const removeData = async () => {
    sessionStorageRemoveItem({ key: 'test' });
  };

  useEffect(() => {
    settingNavigationTitle({ name: isShowFilterResult ? '选股结果' : '选股器' });
  }, [isShowFilterResult]);

  return (
    <>
      <FilterStock
        isEdit={isEdit}
        isShowFilterResult={isShowFilterResult}
        setIsShowFilterResult={setIsShowFilterResult}
        filterResultCallback={getFilterResult}
      />

      <Button onClick={() => setIsEdit(!isEdit)}>切换编辑状态</Button>
      <Button onClick={() => setIsShowFilterResult(false)}>隐藏结果页</Button>

      <Button onClick={() => setData()}>保存数据</Button>
      <Button onClick={() => getData()}>获取数据</Button>
      <Button onClick={() => removeData()}>移除数据</Button>
      <Button onClick={() => logger.infoImmediately('23432')}>logger</Button>
      {/* <Button onClick={() => xx.xx = 4}>报错</Button> */}
      {/* <Button onClick={() => setFilterResultCBFlow(performance.now())}>获取数据</Button> */}
    </>
  );
};

generatePage(<WrapApp />, {
  store,
  quote: true,
  i18n: { messageDict: { 'zh-Hant': zhHant, 'zh-Hans': zhHans } },
});

export default {
  title: '选股器',
};
