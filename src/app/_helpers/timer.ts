export function getTimeDiff(datetime, cb = null) {
  datetime = new Date(datetime).getTime();
  const now = new Date().getTime();

  if (isNaN(datetime)) {
    return '';
  }

  const milisec_diff = datetime - now;

  // Zero Time Trigger
  if (milisec_diff <= 0) {
    cb();
    return '00:00:00:00';
  }

  const days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));
  const date_diff = new Date(milisec_diff);
  const day_string = days ? twoDigit(days) : '00';
  const day_hours = days * 24;

  return {
    days: day_string,
    hours: twoDigit(date_diff.getUTCHours()),
    minutes: twoDigit(date_diff.getMinutes()),
    seconds: twoDigit(date_diff.getSeconds())
  };
}

function twoDigit(number: number) {
  return number > 9 ? '' + number : '0' + number;
}

export function currentPassDate(datetime: any) {
  datetime = new Date(datetime).getTime();
  const now = new Date().getTime();
  return datetime <= now;
}
