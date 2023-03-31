import React, { useState, useEffect, useMemo, useRef } from 'react';
import './area-code.scss';

import { IndexBar, List } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { IndexBarRef } from 'antd-mobile/es/components/index-bar';
import { getAreaCode } from '@/api/module-api/activity';
import backIcon from '../../images/icon_return.png'; // 返回

const AreaCode: React.FC<any> = (props) => {
  const { setShowAreaCode, setPhonePrefix } = props;
  const [phoneList, setPhoneList] = useState<any>();
  const pageTitle = '城市区号';
  const indexBarRef = useRef<IndexBarRef>(null);
  const getAreaCodeData = () => {
    getAreaCode({}).then((res) => {
      console.log(res);
      if (res.code === 0) {
        const newArr: any = [];
        const arr = Object.entries(res.result);
        console.log('arr===>', arr);
        // const newResult = res.result.
        arr.forEach((item) => {
          const obj: any = {
            title: item[0],
            values: item[1],
          };

          newArr.push(obj);
        });
        setPhoneList(newArr);
      }
    }).catch((err) => {
      console.log('err---->', err);
    });
  };

  useEffect(() => {
    getAreaCodeData();
  }, []);

  useEffect(() => {
    if (phoneList) {
      indexBarRef.current?.scrollTo(phoneList[phoneList.length - 1].title);
    }
  }, [phoneList]);
  return (
    <div style={{ height: `${window.innerHeight}px`, width: `${window.innerWidth}px` }} styleName="page">
      <div styleName="head">
        <div onClick={() => setShowAreaCode(false)}>
          <img src={backIcon} alt="" />
        </div>
        <div>
          {pageTitle}
        </div>
      </div>
      <div styleName="main">
        <IndexBar ref={indexBarRef}>
          {phoneList ? phoneList.map((group) => {
            const { title, values } = group;
            return (
              <IndexBar.Panel
                index={title}
                title={`${title}`}
                key={`${title}`}
              >
                <List>
                  {values.map((item) => (
                    <List.Item
                      key={item.id}
                    >
                      <div
                        styleName="option"
                        onClick={() => {
                          setPhonePrefix(item.areaCode);
                          setShowAreaCode(false);
                        }}
                      >
                        <div>{item.codeName}</div>
                        <div styleName="name-option">{item.areaCode}</div>
                      </div>
                    </List.Item>
                  ))}
                </List>
              </IndexBar.Panel>
            );
          }) : ''}
        </IndexBar>
      </div>
    </div>
  );
};

export default AreaCode;
