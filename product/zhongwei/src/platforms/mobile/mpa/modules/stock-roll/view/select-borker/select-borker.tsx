/* eslint-disable max-len */
import NoMessage from '@/platforms/mobile/components/no-message/no-message';
import FullScreenPageView from '@/platforms/mobile/components/full-screen-page-view/full-screen-page-view';
import { pageBack } from '@/platforms/mobile/helpers/native/msg';
import { IndexBar, List, SearchBar } from 'antd-mobile';
import { groupBy, map, isEmpty } from 'lodash-es';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PinyinMatch from 'pinyin-match';
import PinyinMatchTw from 'pinyin-match/es/traditional';
import brokerList from './borker';
import './select-borker.scss';

const SelectBorker: React.FC<{
  onSelect?: (item) => void;
  close?: () => void;
}> = (props) => {
  const { formatMessage } = useIntl();
  const { onSelect = () => undefined, close = undefined } = props;
  const navBack = () => {
    if (close) {
      close();
    } else {
      pageBack();
    }
  };

  const [keyword, setKeyword] = useState('');

  const groups = useMemo(() => {
    const list = groupBy(
      brokerList
        .concat([
          { letter: 'other', name: formatMessage({ id: 'other' }), nameTw: formatMessage({ id: 'other' }), ccass: '' },
        ])
        .filter(
          (item) => keyword === '' || PinyinMatch.match(item.name, keyword) || PinyinMatchTw.match(item.nameTw, keyword),
        )
        .sort((a, b) => a.letter.charCodeAt(0) - b.letter.charCodeAt(0)),
      'letter',
    );
    console.log(list);
    return list;
  }, [keyword]);

  return (
    <FullScreenPageView
      title={<FormattedMessage id="select_borker" />}
      onBack={navBack}
    >
      <div styleName="search-content">
        <SearchBar
          placeholder={formatMessage({ id: 'please_enter_the_broker_name' })}
          value={keyword}
          onChange={(v) => setKeyword(v)}
        />
      </div>
      <div styleName="content">
        {isEmpty(groups) && keyword !== '' && <NoMessage text={formatMessage({ id: 'no_search_result' })} />}
        <IndexBar>
          {map(groups, (group, key) => (
            <IndexBar.Panel
              index={key === 'other' ? formatMessage({ id: 'other' }) : key}
              title={key === 'other' ? formatMessage({ id: 'other' }) : key}
              key={key}
            >
              <List>
                {group.map((item) => (
                  <List.Item
                    key={item.name}
                    arrow={false}
                    onClick={() => {
                      onSelect(item);
                      navBack();
                    }}
                  >
                    {item.name}
                  </List.Item>
                ))}
              </List>
            </IndexBar.Panel>
          ))}
        </IndexBar>
      </div>
    </FullScreenPageView>

  );
};

SelectBorker.defaultProps = {
  onSelect: () => undefined,
  close: () => undefined,
};

export default SelectBorker;
