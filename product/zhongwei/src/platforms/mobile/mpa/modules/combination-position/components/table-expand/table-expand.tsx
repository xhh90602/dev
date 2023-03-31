import classNames from 'classnames';
import './table-expand.scss';

interface IConfig {
  label: string;
  styleName: string;
  handleClick: (...args: any[]) => any;
}

interface IProps {
  width: number;
  expandCfg: IConfig[];
}

const TableExpand: React.FC<IProps> = (props) => {
  const { width, expandCfg } = props;

  return (
    <div styleName="table-expand-box" style={{ width: `${width}px` }}>
      {expandCfg.map((item) => (
        <div
          key={item.styleName}
          styleName={classNames(['table-expand-item', item.styleName])}
          onClick={item.handleClick}
        >
          <p styleName="table-expand-item-text">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default TableExpand;
