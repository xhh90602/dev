import { initBridge } from '@/helpers/bridge';

// export default initBridge('mock');
// export default initBridge('pc');

export default process.env.NODE_ENV === 'production' ? initBridge('pc') : initBridge('mock');
