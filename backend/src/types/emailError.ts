export interface IEmailError {
  name: string;
  code: string;
  clientVersion: string;
  meta: {
    modelName: string;
    target: [string];
  };
}
