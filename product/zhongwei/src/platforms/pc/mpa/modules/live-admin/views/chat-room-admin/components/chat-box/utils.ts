/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  // const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = window.atob(arr[1]);
  // alert(JSON.stringify(bstr))
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) { // eslint-disable-line
    u8arr[n] = bstr.charCodeAt(n);
  }

  // const result = new File([u8arr], !type ? filename : changeFileName(type, filename), { type: 'image/jpeg' });
  const mime = arr[0].match(/:(.*?);/)[1];
  const result: any = new Blob([u8arr], { type: mime });
  result.lastModifiedDate = new Date();
  result.lastModified = +new Date();
  result.filename = filename;

  return result;
}

export function parseQuoteContent(v: string): string {
  return v.replace(/<img(.+?)>/g, '[图片]');
}

function canvasDataURL(path, obj, callback) {
  const img = new Image();
  img.src = path;
  img.onload = function () { // eslint-disable-line
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    // 默认按比例压缩
    var w = that.width, // eslint-disable-line
      h = that.height,
      scale = w / h;
    w = obj.width || w;
    h = obj.height || (w / scale);
    let quality = 0.7; // 默认图片质量为0.7
    // 生成canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // 创建属性节点
    const anw = document.createAttribute('width');
    anw.nodeValue = w;
    const anh = document.createAttribute('height');
    anh.nodeValue = h;
    canvas.setAttributeNode(anw);
    canvas.setAttributeNode(anh);
    ctx.drawImage(that, 0, 0, w, h);
    if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
      quality = obj.quality;
    }
    // quality值越小，所绘制出的图像越模糊
    const base64 = canvas.toDataURL('image/jpeg', quality);
    // 回调函数返回base64的值
    callback(base64);
  };
}
/**
 * 用画布对图片压缩
 * @param {*} file 文件
 * @param {*} w 压缩比例
 * @param {*} objDiv 回调函数
 */
export function photoCompress(file, w, objDiv) {
  const ready = new FileReader();
  ready.readAsDataURL(file);
  ready.onload = function () {
    const re = this.result;
    canvasDataURL(re, w, objDiv);
  };
}

// emoji
const list = {};

function importAll(r) {
  r.keys().forEach((key: string) => {
    list[`[${/\.\/bc_(.+?)\.png/g.exec(key)[1]}]`] = r(key);
  });
}

// @ts-ignore
importAll(require.context('../../images/emoji', true, /\.png$/));

export const emojiSourceDict = list;
