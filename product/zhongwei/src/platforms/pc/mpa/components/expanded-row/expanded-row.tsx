import { useIntl } from 'react-intl';
import './expanded-row.scss';

interface ExpandedRowRenderProps {
  record: Record<string, any>;
  columns: any[];
}

const ExpandedRowRender: React.FC<ExpandedRowRenderProps> = (props) => {
  const { formatMessage } = useIntl();
  const { record, columns } = props;

  return (
    <div styleName="expanded-row">
      {columns.map((item: Record<string, any>) => (
        <div styleName={`expanded-col ${item.additionalStyle || ''}`} key={item.label}>
          <p styleName="col-label">{formatMessage({ id: item.label })}</p>
          <p styleName="col-value">{item.render(record)}</p>
        </div>
      ))}
    </div>
  );
};

export default ExpandedRowRender;
