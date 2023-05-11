// 时间格式化
export const getDayCh = (day) => {
  let dayCh = '';
  switch(day) {
    case 0:
      dayCh = "日";
      break;
    case 1:
      dayCh = "一";
      break;
    case 2:
      dayCh = "二";
      break;
    case 3:
      dayCh = "三";
      break;
    case 4:
      dayCh = "四";
      break;
    case 5:
      dayCh = "五";
      break;
    default:
      dayCh = "六";
  }
  return dayCh;
}
export const getTwoStr = (value) => {
  let result = value + '';
  if (value < 10) {
    result = `0${value}`;
  }
  return result;
}
export const getDateDetail = (timeStr) => {
  const dateObj = timeStr ? new Date(timeStr) : new Date();
  const year = dateObj.getFullYear();
  const month = getTwoStr(dateObj.getMonth() + 1);
  const date = getTwoStr(dateObj.getDate());
  const day = getDayCh(dateObj.getDay());
  const hours = getTwoStr(dateObj.getHours());
  const minutes = getTwoStr(dateObj.getMinutes());
  const seconds = getTwoStr(dateObj.getSeconds());
  return {
    year,
    month,
    date,
    day,
    hours,
    minutes,
    seconds
  }
}

export const getMeetingTimeStr = (meetingTime) => {
  const dateDetail = getDateDetail(meetingTime);
  const str = `${dateDetail.hours}:${dateDetail.minutes}`;
  return str
}