// emoji
const list = {};

function importAll(r) {
  r.keys().forEach((key: string) => {
    list[`[${/\.\/bc_(.+?)\.png/g.exec(key)[1]}]`] = r(key);
  });
}

importAll(require.context('./images/emoji', true, /\.png$/));

export const emojiSourceDict = list;
