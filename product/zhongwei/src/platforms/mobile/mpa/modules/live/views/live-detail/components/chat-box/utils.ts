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
