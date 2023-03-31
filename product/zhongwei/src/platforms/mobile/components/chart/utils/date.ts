export interface ITradeTime {
  opentime: number;
  closetime: number;
}

/**
* 转换交易时间段为连续数组
* @param list
*/
export function convertTradeTime(list: ITradeTime[]) {
  // 总分钟数
  const total = list.reduce((prev, curr) => curr.closetime - curr.opentime + prev, 0);
  const ranges = list
    .map((i) => i.closetime - i.opentime)
    .map((j, jdx, _list) => {
      if (jdx === 0) return j;
      return _list.slice(0, jdx + 1).reduce((prev, curr) => prev + curr, 0);
    });
  return Array(total + 1).fill(0).map((item, i) => {
    const idx = ranges.findIndex((r) => i > r);
    if (idx === -1) return i + list[0].opentime;
    return i - ranges[idx] + list[idx + 1].opentime;
  });
}

export class UTCDate {
  private $date: Date;

  constructor(utc: string, withZone = true) {
    const d = utc.replace(/-/g, '/');
    this.$date = new Date(`${d}${withZone ? ' +0' : ''}`);
  }

  get date() {
    return new Date(this.$date.getTime());
  }

  set date(d) {
    this.$date = d;
  }

  add(num: number, unit: string) {
    if (unit === 'months') {
      this.$date.setMonth(this.$date.getMonth() + num);
    } else if (unit === 'minutes') {
      this.$date.setMinutes(this.$date.getMinutes() + num);
    } else if (unit === 'hours') {
      this.$date.setHours(this.$date.getHours() + num);
    } else if (unit === 'second') {
      this.$date.setSeconds(this.$date.getSeconds() + num);
    } else {
      throw new Error('未实现!');
    }
    return this;
  }

  isBefore(d: UTCDate) {
    return this.$date.getTime() < d.$date.getTime();
  }

  format(s: string) {
    const d = this.$date;

    if (!s) {
      s = 'YYYY-MM-DD HH:mm:ss';
    }

    const o = {
      'M+': d.getMonth() + 1, // month
      'D+': d.getDate(), // day
      'H+': d.getHours(), // hour
      'h+': d.getHours(), // hour
      'm+': d.getMinutes(), // minute
      's+': d.getSeconds(), // second
      S: d.getMilliseconds(),
    };

    if (/(Y+)/.test(s)) {
      s = s.replace(RegExp.$1, (`${d.getFullYear()}`)
        .substr(4 - RegExp.$1.length));
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const k in o) {
      if (new RegExp(`(${k})`).test(s)) {
        s = s.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr((`${o[k]}`).length));
      }
    }
    return s;
  }

  formatvalueOf() {
    return this.$date.getTime();
  }
}

// 解释行情服务器格式
export function parseUTCDate(s: string) {
  return new UTCDate(s);
}

// 解释行情服务器格式
export function parseDate(s: string) {
  return new UTCDate(s, false);
}
