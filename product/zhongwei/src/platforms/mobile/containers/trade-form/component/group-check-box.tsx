import { Grid } from 'antd-mobile';
import IconNotSelect from '@mobile/images/icon_not_select.svg';
import IconSelect from '@mobile/images/icon_select.svg';
import { useIntl } from 'react-intl';

import '../trade-form.scss';
import { memo } from 'react';

/**
 * 组合多股票选择
 * @param defaultFormList 渲染函数
 * @param list 渲染列表
 * @param groupCheckProxy 选中状态
 */
const GroupCheckBox = (props) => {
  const { defaultFormList, list, groupCheckProxy } = props;
  const { formatMessage } = useIntl();
  return (
    list.map((listItem, i) => (
      [
        <Grid.Item
          span={10}
          styleName="group-check"
          onClick={() => {
            groupCheckProxy[i] = !groupCheckProxy[i];
          }}
        >
          <img alt="" src={groupCheckProxy[i] ? IconSelect : IconNotSelect} />
          <div>{listItem?.name || formatMessage({ id: 'individual_share' })}</div>
        </Grid.Item>,
        ...(groupCheckProxy[i] ? defaultFormList({
          ...listItem.state,
        }) : []).map((item) => (
          [item.label && (
            <Grid.Item span={4}>
              {item.label}
            </Grid.Item>
          ),
          item.content && (
            <Grid.Item span={6}>
              {item.content}
            </Grid.Item>
          ),
          item.line && (
            <Grid.Item span={10}>
              <div className="line m-b-5" />
            </Grid.Item>
          ),
          ]
        )),
      ]
    ))
  );
};

export default memo(GroupCheckBox);
