function getArgs() {
  const args = process.argv.slice(2);
  const result = args.reduce((acc, arg) => {
    if (arg.startsWith('--')) {
      const sliceFrom = arg.indexOf('=');
      if (sliceFrom !== -1) {
        acc.push([arg.slice(0, sliceFrom), arg.slice(sliceFrom + 1, arg.length)]);
      } else {
        acc.push(arg);
      }
    } else {
      acc.push(arg);
    }
    return acc;
  }, []);
  return result;
}

const CLI = {
  getArgs,
};

module.exports = { CLI };
