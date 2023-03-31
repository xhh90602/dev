import { Toast } from 'antd-mobile';

interface CProps {
  content: string;
  position?: 'top' | 'center' | 'bottom';
  icon?: string | null;
  duration?: number;
  maskClickable?: boolean;
}

const messageHelpers = {
  success: (content) => Toast.show({
    icon: 'success',
    content: content || '保存成功',
  }),
  show: (content) => Toast.show({
    content: content || '保存成功',
  }),
  fail: (content) => Toast.show({
    icon: 'fail',
    content,
  }),
  loading: (content) => Toast.show({
    icon: 'loading',
    content: content || '加载中…',
  }),
  personalToast: (config: CProps) => Toast.show({ ...config }),
  clear: () => Toast.clear(),
};

export default messageHelpers;
