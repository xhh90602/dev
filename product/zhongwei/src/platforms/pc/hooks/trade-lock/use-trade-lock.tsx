import codeStorage from '@/helpers/code-storage';
import { useEffect, useState } from 'react';
import BaseModal from '@pc-mpa/components/basis-modal/basis-modal';
import { Input, message } from 'antd';
import { verifyTradePwd } from '@/api/module-api/trade';
import { closePage } from '@/platforms/pc/helpers/native/msg';

const leaveValue = {
  '15m': 15 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '60m': 60 * 60 * 1000,
};

interface ILockProps {
  isPwdVisible: boolean;
  setIsPwdVisible: (v: boolean) => undefined | void;
  cb?: () => undefined | void;
}

export const LockDialog: React.FC<ILockProps> = (props) => {
  const { isPwdVisible, setIsPwdVisible = () => undefined, cb } = props;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isPwdVisible);
  }, [isPwdVisible]);

  const [password, setPwd] = useState('');

  return (
    <BaseModal
      isVisible={visible}
      title="交易解锁"
      handleOk={() => {
        verifyTradePwd({
          password,
        }).then((res) => {
          if (res.code === 0) {
            if (cb) cb();
            setIsPwdVisible(false);
            return;
          }
          setPwd('');
          message.error(res.message);
        });
      }}
      handleCancel={() => {
        closePage();
        setIsPwdVisible(false);
      }}
    >
      <Input
        className="input-dialog"
        placeholder="请输入密码"
        value={password}
        allowClear
        onChange={(e) => {
          setPwd(e.target.value);
        }}
      />
    </BaseModal>
  );
};

// 交易闲置锁定
const useTradeLock: (
  lockStatus: undefined | boolean,
  setLockStatus: any,
) => {
  lockDialog: () => React.ReactNode,
} = (lockStatus, setLockStatus) => {
  const [isPwdVisible, setIsPwdVisible] = useState<boolean>(false);
  const [isLock, setIsLock] = useState<boolean>(false);

  function contrastTime() {
    const leaveTime = leaveValue[codeStorage.idleAutoLockDuration];
    if (!leaveTime || isLock || lockStatus || !codeStorage.token) return;

    const time = parseFloat(localStorage.getItem('lockTime') || String(new Date().getTime()));
    const nowTime = new Date().getTime();

    if ((nowTime - time) > leaveTime) {
      setIsLock(true);
      setIsPwdVisible(true);
      if (setLockStatus) setLockStatus(true);
    }
  }

  useEffect(() => {
    if (lockStatus !== undefined) setIsLock(lockStatus);
    contrastTime();
  }, [lockStatus]);

  useEffect(() => {
    localStorage.setItem('lockTime', String(new Date().getTime()));

    let setLockTime;
    const setLock = () => {
      clearTimeout(setLockTime);

      setLockTime = setTimeout(() => {
        localStorage.setItem('lockTime', String(new Date().getTime()));
      }, 1000);
    };
    document.addEventListener('mousemove', setLock);
    return () => {
      document.removeEventListener('mousemove', setLock);
    };
  }, []);

  useEffect(() => {
    const time = setInterval(() => {
      contrastTime();
    }, 1000);
    return () => {
      clearInterval(time);
    };
  }, []);

  return {
    lockDialog: (
      cb: () => void = () => {
        setIsLock(false);
      },
    ) => (
      <LockDialog
        cb={cb}
        isPwdVisible={isPwdVisible}
        setIsPwdVisible={setIsPwdVisible}
      />
    ),
  };
};

export default useTradeLock;
