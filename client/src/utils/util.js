export const greeting = () => {
  var d = new Date();
  var time = d.getHours();

  switch (true) {
    case time > 0 && time <= 5:
      return 'Good Night';
    case time >= 6 && time < 12:
      return 'Good Morning';
    case time === 12:
      return 'Good Noon';
    case time > 12 && time <= 18:
      return 'Good Afternoon';
    case time > 18 && time <= 23:
      return 'Good Evening';

    default:
      return 'Hello';
  }
};

export const getUserGreeting = (name) => {
  return `${greeting()}, ${name}`;
};
