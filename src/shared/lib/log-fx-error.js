export const logFxError =
  (name) =>
  ({ params, error }) => {
    if (params) {
      console.error(name, params, error);
      return;
    }
    console.error(name, error);
  };
