import FilterStock from './containers/filter-stock/filter-stock';
import FilterResult from './containers/filter-result/filter-result';

import './filter-stock.scss';

interface FilterStockConsoleProps {
  isEdit?: boolean;
  isSelectAll?: boolean;
  isShowFilterResult: boolean;
  limitSelectStock?: number;
  setIsShowFilterResult: (v: boolean) => void;
  filterResultCallback: (v: any[]) => void;
}

const FilterStockConsole: React.FC<FilterStockConsoleProps> = (props) => {
  const { isEdit,
    isSelectAll,
    isShowFilterResult,
    limitSelectStock,
    setIsShowFilterResult,
    filterResultCallback,
  } = props;

  return (
    <>
      <div styleName={isShowFilterResult ? 'dpb' : 'dpn'}>
        <FilterResult
          isEdit={isEdit}
          isSelectAll={isSelectAll}
          limitSelectStock={limitSelectStock}
          isShowFilterResult={isShowFilterResult}
          filterResultCallback={filterResultCallback}
        />
      </div>
      <div styleName={isShowFilterResult ? 'dpn' : 'dpb'}>
        <FilterStock setIsShowFilterResult={setIsShowFilterResult} />
      </div>
    </>
  );
};

export default FilterStockConsole;
