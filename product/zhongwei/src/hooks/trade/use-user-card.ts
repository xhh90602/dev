import { getUserInfo } from '@/api/module-api/combination-position';
import { ID_TYPE } from '@/constants/user';
import { getTradeUserInfo } from '@/platforms/mobile/helpers/native/msg';
import { has } from 'lodash-es';
import { useEffect, useState } from 'react';

const useUserCard = (defaultVal = false) => {
  const [isMainlandIdentityCard, setIsMainlandIdentityCard] = useState(defaultVal);

  const checkUserCard = async () => {
    const tradeUserInfo = await getTradeUserInfo();
    const userInfoResponse = await getUserInfo({ clientId: tradeUserInfo?.account });

    if (has(userInfoResponse?.result, 'openIdType')) {
      // 是否大陆内地身份证开户
      setIsMainlandIdentityCard(userInfoResponse.result.openIdType === ID_TYPE.A);
    }
  };

  useEffect(() => {
    checkUserCard();
  }, []);

  return {
    isMainlandIdentityCard,
  };
};

export default useUserCard;
