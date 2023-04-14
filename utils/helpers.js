module.exports = {
  format_date: (date) => {
    const dateObj = new Date();
    return `${dateObj.getUTCMonth() + 1}/${dateObj.getUTCDate() - 1}/${dateObj.getUTCFullYear()}`;
  },
};