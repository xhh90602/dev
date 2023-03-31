import { useMemo } from 'react';

import './str-slice.scss';

/**
 * 字符串分割相等间隔
 * @returns
 */
const StrSlice = (props) => {
  const { value }: { value: string } = props;

  const str = useMemo(() => value.split(''), [value]);

  return (
    <div styleName="str-slice">
      {
        str.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>{item}</div>
        ))
      }
    </div>
  );
};

export default StrSlice;
