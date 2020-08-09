export const getToday = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = new String(date.getMonth() + 1);
  let day = new String(date.getDate());

  // 한자리수일 경우 0을 채워준다.
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }

  return `${year}-${month}-${day}`;
};
