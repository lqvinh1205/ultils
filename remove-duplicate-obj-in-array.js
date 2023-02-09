const array = [
  ...array.reduce((map, obj) => map.set(obj.value, obj), new Map()).values(),
];
