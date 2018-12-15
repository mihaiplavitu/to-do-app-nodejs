function exists(m) {
  try {
    require.resolve(m)
  } catch (e) {
    return false;
  }

  return true;
}

module.exports = function requireIfExists(...modules) {
  for (m of modules) {
    if (exists(m)) {
      return require(m);
    }
  }

  return null;
};
