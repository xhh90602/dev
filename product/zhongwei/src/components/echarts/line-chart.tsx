import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, DatasetComponent, LegendComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';

// Register the required components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  // CanvasRenderer,
  DatasetComponent,
  SVGRenderer,
  LegendComponent,
]);

export default echarts;
