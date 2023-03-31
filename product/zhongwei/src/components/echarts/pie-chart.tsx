import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';

// Register the required components
echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, SVGRenderer, LabelLayout]);

export default echarts;
