module.exports = {
  bodyRequired: (elements, body) => {
    const array = [];
    elements.forEach(el => {
      if (!(el in body)) {
        array.push({ [el]: 'required' });
      }
    });

    return {
      hasError: array.length > 0,
      error: array
    };
  }
}