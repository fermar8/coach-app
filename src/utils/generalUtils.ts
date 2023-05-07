function excludeFieldFromObject<T extends Record<string, any>>(
  object: T,
  keys: string[],
): Omit<T, keyof typeof keys> {
  const clonedObj = { ...object };
  for (const key of keys) {
    delete clonedObj[key];
  }
  return clonedObj;
}

export { excludeFieldFromObject };
