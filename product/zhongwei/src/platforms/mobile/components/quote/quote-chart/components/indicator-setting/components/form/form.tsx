import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { CacheStore } from '@dz-web/cache';
import { message } from 'antd';
import { get } from 'lodash-es';
import { useGetChartIndicatorParamsList } from '@/helpers/multi-platforms';

// import { setChartIndicatorParamsList } from '@pc/model/quote';

import { RenderInputNumber } from './input';
import { changeTempCachedValues, TEMP_INDICATORS_CACHE_KEY } from '../../../../constant/indicators-setting';

import './form.scss';

const componentMap = {
  RenderInputNumber,
};

const renderCell = (col, row, trans, inputHandler?, errorHandler?) => {
  const { dataKey, render, inputType } = col;

  if (dataKey) {
    const text = row[dataKey] || '';
    return dataKey === 'paramName' ? trans({ id: text }) : text;
  }

  if (inputType) {
    const Comp = componentMap[inputType];
    return <Comp rowKey={row.key} {...row} onInput={inputHandler} onError={errorHandler} />;
  }

  if (render) return render(row);

  return null;
};

const defaultCellWidth = 100;

const RenderForm = (props, ref) => {
  const { dataSource = [], columns, formKey } = props;
  const { formatMessage } = useIntl();

  const [formData, setFormData] = React.useState<any>({});
  const chartIndicators = useGetChartIndicatorParamsList();
  const dispatch = useDispatch();
  const [formErrorStatus, setFormErrorStatus] = React.useState({});
  const isFormLocked = React.useMemo(() => {
    if (!formErrorStatus) return false;
    return Object.keys(formErrorStatus).some((k) => formErrorStatus[k]);
  }, [formErrorStatus]);

  const formConfig = React.useMemo(() => {
    if (!dataSource || !dataSource.length) return {};
    return dataSource.reduce((prev, cur, index) => ({ ...prev, [cur.key]: { ...cur, index } }), {});
  }, [dataSource]);

  React.useImperativeHandle(ref, () => ({
    onFormSubmit: (key, callBack) => {
      if (isFormLocked) return;
      const l = Object.keys(formData).filter((k) => get(formConfig, `${k}.defaultValue`, undefined))
        .map((k) => formData[k]);
      // dispatch(setChartIndicatorParamsList({ ...chartIndicators, [key]: l }));
      message.success(formatMessage({ id: 'saved_successfully' }));
      if (callBack) callBack(formData);
    },
  }));

  React.useEffect(() => {
    if (!dataSource || !dataSource.length) return;
    const _formValues = dataSource.reduce((prev, cur) => ({ ...prev, [cur.key]: cur.value }), {});
    setFormData({ ..._formValues });
  }, [dataSource]);

  const onChange = (key, v) => {
    const newValues = { ...formData, [key]: v };
    setFormData(newValues);
    changeTempCachedValues(formKey, get(formConfig, `${key}.index`, null), v);
  };

  const onError = (bool, k) => {
    const tempValues = CacheStore.getItem(TEMP_INDICATORS_CACHE_KEY) || {};
    if (bool && get(tempValues, formKey, undefined)) {
      delete tempValues[formKey];
      CacheStore.setItem(TEMP_INDICATORS_CACHE_KEY, tempValues);
    }

    setFormErrorStatus((prev) => ({ ...prev, [k]: bool }));
  };

  if (!dataSource.length) return <div />;

  return (
    <div styleName="form">
      <div styleName="table-head">
        <div styleName="row">
          {
            columns.map((v) => (
              <div
                styleName="cell"
                key={v.key}
                style={{ width: `${v.width || defaultCellWidth}px` }}
              >
                {formatMessage({ id: v.title })}
              </div>
            ))
          }
        </div>
      </div>
      <div className="table-body">
        {
          dataSource.map((row) => (
            <div key={row.indicator || row.key} styleName="row">
              {
                columns.map((col) => (
                  <div key={col.key} styleName="cell" style={{ width: `${col.width || defaultCellWidth}px` }}>
                    {renderCell(col, row, formatMessage, onChange, onError)}
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default React.forwardRef(RenderForm);
