export const liveSkinLayout = [
  { name: 'bigPlayButton', align: 'cc', x: 30, y: 10 },
  { name: 'errorDisplay', align: 'tlabs', x: 0, y: 0 },
  { name: 'infoDisplay', align: 'cc' },
  {
    name: 'controlBar',
    align: 'blabs',
    x: 0,
    y: 0,
    children: [
      { name: 'liveDisplay', align: 'tlabs', x: 15, y: 6 },
      { name: 'fullScreenButton', align: 'tr', x: 10, y: 12 },
      // { name: "subtitle", align: "tr", x: 15, y: 12 },
      { name: 'setting', align: 'tr', x: 15, y: 12 },
      { name: 'volume', align: 'tr', x: 5, y: 10 },
      { name: 'playButton', align: 'tr', x: 20, y: 11 },
    ],
  },
];

export const recordSkinLayout = [
  {
    name: 'bigPlayButton',
    align: 'cc',
    x: 30,
    y: 10,
  },
  {
    name: 'H5Loading',
    align: 'cc',
  },
  {
    name: 'errorDisplay',
    align: 'tlabs',
    x: 0,
    y: 0,
  },
  {
    name: 'infoDisplay',
  },
  {
    name: 'tooltip',
    align: 'blabs',
    x: 0,
    y: 56,
  },
  {
    name: 'thumbnail',
  },
  {
    name: 'controlBar',
    align: 'blabs',
    x: 0,
    y: 0,
    children: [
      {
        name: 'progress',
        align: 'blabs',
        x: 0,
        y: 44,
      },
      {
        name: 'playButton',
        align: 'tl',
        x: 15,
        y: 12,
      },
      {
        name: 'timeDisplay',
        align: 'tl',
        x: 10,
        y: 7,
      },
      {
        name: 'fullScreenButton',
        align: 'tr',
        x: 10,
        y: 12,
      },
      // {
      //   name: 'setting',
      //   align: 'tr',
      //   x: 15,
      //   y: 12,
      // },
      {
        name: 'volume',
        align: 'tr',
        x: 5,
        y: 10,
      },
      // {
      //   name: 'snapshot',
      //   align: 'tr',
      //   x: 10,
      //   y: 10,
      // },
    ],
  },
];
