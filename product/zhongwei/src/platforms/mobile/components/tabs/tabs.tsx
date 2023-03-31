import IconSvg from '@mobile/components/icon-svg';
import { CapsuleTabs } from 'antd-mobile';
import { CapsuleTabProps, CapsuleTabsProps } from 'antd-mobile/es/components/capsule-tabs';
import { memo } from 'react';

import './tabs.scss';

const { Tab } = CapsuleTabs;

export type IconPosition = 'top' | 'left' | 'bottom' | 'right';

/** svg 名称 */
type TabItem = {
  iconSvgName: string;
  iconPositionSvg: IconPosition;
  iconTransform: [number, number]
}

type ITabs = CapsuleTabsProps & {
  list: (Partial<TabItem> & CapsuleTabProps)[]
}

const iconPositionSvgObj = {
  top: ['0', 'auto', 'auto', '50%'],
  left: ['50%', 'auto', 'auto', '0'],
  right: ['auto', '-50%', '-50%', 'auto'],
  bottom: ['auto', '0', '-100%', 'auto'],
};

const Tabs = (props: ITabs) => {
  const { list, className, defaultActiveKey, activeKey, onChange } = props;

  return (
    <CapsuleTabs activeKey={activeKey} defaultActiveKey={defaultActiveKey} onChange={onChange} className={className}>
      {
        list.map((item) => {
          const itemCopy = item;

          if (itemCopy.iconSvgName) {
            const {
              iconTransform = [-50, -50],
              iconPositionSvg = 'top',
            } = itemCopy;

            itemCopy.title = (
              <div styleName="tab-icon">
                {
                  itemCopy.title
                }
                <span
                  styleName="icon"
                  style={{
                    transform: `translate(
                      ${iconTransform[0]}%,
                      ${iconTransform[1]
                      }%`,
                    top: iconPositionSvgObj[iconPositionSvg][0],
                    right: iconPositionSvgObj[iconPositionSvg][1],
                    bottom: iconPositionSvgObj[iconPositionSvg][2],
                    left: iconPositionSvgObj[iconPositionSvg][3],
                  }}
                >
                  <IconSvg path={itemCopy.iconSvgName} />
                </span>
              </div>
            );
          }

          return (
            <Tab {...itemCopy} />
          );
        })
      }
    </CapsuleTabs>
  );
};

export default memo(Tabs);
