var map = icon_num => {
  log('helloworld');
  try {
    let map_table = {
      50: 'clear-day.svg',
      51: 'partly-cloudy.svg',
      52: 'overcast-day.svg',
      53: 'partly-cloudy-day-drizzle.svg',
      54: 'partly-cloudy-day-rain.svg',
    };

    return map_table[icon_num];
  } catch (error) {
    log(error);
  }
};
