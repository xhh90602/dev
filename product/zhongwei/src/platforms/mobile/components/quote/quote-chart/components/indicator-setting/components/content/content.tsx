import React, { useEffect } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';
import RenderForm from '../form/form';
import {
  getTempCachedValues, saveTempCachedValue, removeTempCachedValue,
  defaultIndicatorValue,
} from '../../../../constant/indicators-setting';

import './content.scss';

const Content = (props) => {
  const {
    formData: { key, title, explanation, columns, dataSource, renderDataSourceFn: renderFn },
    chartIndicators, resetFlow, confirmFlow } = props;
  const { formatMessage } = useIntl();
  const formRef = React.useRef<any>(null);
  const [rows, setRows] = React.useState([]);

  const onSubmit = () => {
    if (!formRef.current) return;

    formRef.current.onFormSubmit(key);
  };

  const resetForm = () => {
    const defaultValues = get(defaultIndicatorValue, key, []);
    const tempValues = getTempCachedValues(key);
    const isSameValue = JSON.stringify(tempValues) === JSON.stringify(defaultValues);
    if (isSameValue) {
      removeTempCachedValue(key);
      return;
    }

    const l: any = rows.map((v: any, i) => ({ ...v, value: defaultValues[i], randomKey: Math.random() }));
    saveTempCachedValue(key, defaultValues);
    setRows(l);
  };

  useEffect(() => {
    formRef.current = null;
    // setTab(0);
  }, [key]);

  useEffect(() => {
    const data = renderFn ? renderFn(chartIndicators) : dataSource;
    if (!data || !data.length) return;

    const tempValues = getTempCachedValues(key);
    if (!tempValues || !tempValues.length) {
      setRows(data);
      return;
    }

    const l = data.map((v, i) => ({ ...v, value: tempValues[i] }));
    setRows(l);
  }, [dataSource, renderFn, chartIndicators, key]);

  useEffect(() => {
    if (!resetFlow) return;

    resetForm();
  }, [resetFlow]);

  useEffect(() => {
    if (!confirmFlow) return;

    onSubmit();
  }, [confirmFlow]);

  return (
    <div styleName="content">
      <div styleName="title">
        {key.toLocaleUpperCase()}
        :
        {title ? formatMessage({ id: title }) : ''}
      </div>

      <div styleName="box">
        <div className="inherit-flex-height scroll-box-container">
          <RenderForm
            columns={columns}
            formKey={key}
            dataSource={rows}
            ref={formRef}
          />
        </div>
      </div>

    </div>
  );
};

export default React.memo(Content);
