/**
input = {
    a: 1,
    b: [
        {
            c: 2,
        }
        [3],
        {
            d: 4,
        }
    ]
}

output = {
    a: 1,
    'b[0].c': 2,
    'b[1][0]': 3,
    'b[2].d': 4
}
 */

function flat(obj) {
  const retult = {};
  const recursionFun = (_obj, prefix) => {
    if (!(_obj instanceof Object)) {
      retult[prefix] = _obj;
      return;
    }
    if (Array.isArray(_obj)) {
      _obj.forEach((item, index) => {
        recursionFun(item, `${prefix}[${index}]`);
      });
    } else {
      Object.keys(_obj).forEach((key) => {
        recursionFun(_obj[key], `${prefix ? `${prefix}.` : ""}${key}`);
      });
    }
  };

  recursionFun(obj);
  return retult;
}
const input = {
  a: 1,
  b: [
    {
      c: 2,
    },
    [3],
    {
      d: 4,
    },
  ],
};
const a = flat(input);
console.log(a);
