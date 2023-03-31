import { useState } from 'react';
import { getUpload, getUserAvatar } from '@/api/module-api/pwd';
import { notifiedName } from '@pc/helpers/native/msg';
import { message } from 'antd';

export default function useAvatar() {
  const [img, setImg] = useState('');
  const [isUpload, setIsUpload] = useState(true);
  const [isLoad, setIsLoad] = useState(false);
  // 图片上传
  function uploadPic(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('code', 'modify_avatar');
    if (isUpload === false) return;
    message.loading('上传中..', 1);
    setIsUpload(false);
    getUpload(formData)
      .then((res) => {
        setIsUpload(true);
        setIsLoad(false);
        if (!res) return;
        if (res?.code === 0) {
          setImg(res.result.url);
        }
      })
      .catch((e) => {
        message.error(e.message);
        setIsUpload(true);
      })
      .finally(() => {
        setIsUpload(true);
      });
  }
  function onSave() {
    if (isLoad) return;
    const Imgparam = {
      avatar: img,
    };
    setIsLoad(isLoad);
    getUserAvatar(Imgparam).then((res) => {
      setIsLoad(true);
      if (res?.code === 0) {
        message.success('保存成功');
        notifiedName();
      }
    }).catch((e) => {
      message.error(e.message);
      setIsLoad(false);
    });
  }
  return {
    img,
    uploadPic,
    onSave,
  };
}
