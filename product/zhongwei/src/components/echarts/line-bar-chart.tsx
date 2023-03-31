import ReactEChartsCore from 'echarts-for-react/lib/core';
import { LineChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';

// Register the required components
echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  SVGRenderer,
  LineChart,
  BarChart,
]);

export const ReactECharts = ReactEChartsCore;

export default echarts;
