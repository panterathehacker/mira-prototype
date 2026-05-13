export interface PushBackResponse {
  match: RegExp;
  response: string;
}

export const pushBackResponses: PushBackResponse[] = [
  {
    match: /bryan|team|sourc/i,
    response:
      "Fair. If two of those were Bryan's calls, the pattern is half as strong as I made it sound. I'll adjust the threshold for flagging this kind of drift in the future.",
  },
  {
    match: /context|wrong|didn't know|didnt know/i,
    response:
      "Noted. I was reading the CRM notes literally. If there's context I'm missing on those passes, tell me which ones and I'll mark them as exceptions to the pattern.",
  },
  {
    match: /timing|market/i,
    response:
      "That's a different read than mine. I was framing it as a heuristic drift, you're framing it as a timing call. I'll add the timing dimension to my model and re-evaluate.",
  },
  {
    match: /.*/,
    response:
      "Okay. I'm updating my model. If you want to give me more context I'll incorporate it.",
  },
];

export function getResponse(input: string): string {
  const match = pushBackResponses.find((r) => r.match.test(input));
  return match?.response ?? pushBackResponses[pushBackResponses.length - 1].response;
}
