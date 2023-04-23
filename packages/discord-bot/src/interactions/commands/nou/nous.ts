export function createNoU(user: string): string {
  user = userTarget(user);
  const number: number = Math.floor(Math.random() * 101) + 1;

  let msg = "no u"
  switch (number) {
    case 69:
      msg = "Fuck you";
      break;
    case 42:
      msg = "Nerd";
      break;
    case 80:
      msg = "Wow, you're right. I've never thought about it that way before";
      break;
    default:
      if (number >= 1 && number <= 10) {
        msg = `No u, ${user}`;
      } else if (number >= 11 && number <= 20) {
        msg = "No u buddy";
      } else if (number >= 22 && number <= 32) {
        msg = `No, fuk u ${user}`;
      } else {
        msg = "No u";
      }
  }
  return msg
}

function userTarget(user: string) {
  return `<@${user}>`
}