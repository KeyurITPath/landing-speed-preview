export const OVERRIDE = override => ({
  FLEX: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...override,
  },
});

export const GRADIENT_TEXT = color => ({
  background: color,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});
