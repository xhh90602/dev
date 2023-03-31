import generatePage from '@mobile/helpers/generate-page';
import { store } from '@/model/store';
import App from './protocol';

generatePage(<App />, { store });

export default {
  title: '协议',
};
