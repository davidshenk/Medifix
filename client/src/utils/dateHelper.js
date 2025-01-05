const formatJsonDateTime = (dateTime) => {
  const date = dateTime.substring(0, 10);
  const formattedDate = formatJsonDateToNiceView(date);
  return `${formattedDate} ${dateTime.substring(11, 16)}`;
};

const formatJsonDateToNiceView = (date) => `${date.substring(8, 10)}-${date.substring(5, 7)}-${date.substring(0, 4)}`;

const getTimeDifference = (time) => {
  const now = new Date();
  const createdDate = new Date(time);
  const diffInMilliseconds = now - createdDate;
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) return `${diffInDays}d`;
  if (diffInHours > 0) {
    const remainingMinutes = diffInMinutes % 60;
    return `${diffInHours}h ${remainingMinutes}m`;
  }
  return `${diffInMinutes}m`;
};

const convertMinutes = (minutes) => {
  const minutesInHour = 60;
  const minutesInDay = minutesInHour * 24;
  const minutesInWeek = minutesInDay * 7;
  const minutesInMonth = minutesInDay * 30; // ממוצע של 30 ימים בחודש
  const minutesInYear = minutesInDay * 365; // שנה רגילה

  let result = '';

  if (minutes >= minutesInYear) {
    const years = Math.floor(minutes / minutesInYear);
    result += `${years} ${years > 1 ? 'years' : 'year'} `;
    minutes %= minutesInYear;
  }

  if (minutes >= minutesInMonth) {
    const months = Math.floor(minutes / minutesInMonth);
    result += `${months} ${months > 1 ? 'months' : 'month'} `;
    minutes %= minutesInMonth;
  }

  if (minutes >= minutesInWeek) {
    const weeks = Math.floor(minutes / minutesInWeek);
    result += `${weeks} ${weeks > 1 ? 'weeks' : 'week'} `;
    minutes %= minutesInWeek;
  }

  if (minutes >= minutesInDay) {
    const days = Math.floor(minutes / minutesInDay);
    result += `${days} ${days > 1 ? 'days' : 'day'} `;
    minutes %= minutesInDay;
  }

  if (minutes >= minutesInHour) {
    const hours = Math.floor(minutes / minutesInHour);
    result += `${hours} ${hours > 1 ? 'hours' : 'hour'} `;
    minutes %= minutesInHour;
  }

  if (minutes > 0) {
    result += `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
  }

  return result.trim();
};

export { formatJsonDateTime, getTimeDifference, convertMinutes };
