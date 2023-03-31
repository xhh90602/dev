import { useIntl } from 'react-intl';
import { Form, Row } from 'antd';
import BasisFormItem from './basis-form-item';
import './basis-form.scss';

interface IBasisFormProps {
  formConfig: Record<string, any>[] | Record<string, any>[][]; // 表单项配置
  colon?: boolean; // 是否显示 label 后面的冒号
  layout?: 'horizontal' | 'vertical' | 'inline'; // 表单布局
}

const BasisForm: React.FC<IBasisFormProps> = (props) => {
  const { formatMessage } = useIntl();
  const { formConfig, colon = false, layout = 'inline' } = props;

  const getFormItem = (config: Record<string, any>) => (
    <Form.Item label={config.label && formatMessage({ id: config.label })} key={config.i}>
      <BasisFormItem config={config} />
    </Form.Item>
  );

  const setFormItem = (arrItem: any, index) => {
    const isArr = Array.isArray(arrItem);
    if (isArr) {
      return <Row key={index}>{arrItem.map((config, i) => getFormItem({ ...config, i }))}</Row>;
    }

    return getFormItem(arrItem);
  };

  return (
    <div styleName="basis-form">
      <Form layout={layout} colon={colon}>
        {formConfig.map((item: any, i) => setFormItem(item, i))}
      </Form>
    </div>
  );
};

export default BasisForm;
