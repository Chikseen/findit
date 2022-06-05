module.exports = {
  parse(sql, rep) {
    const replace = Object.keys(rep);
    replace.forEach((item) => {
      rep[item];
      sql = sql.replace(`:${item}`, `${rep[item]}`);
    });
    return sql;
  },
};
