// Helper for IonInput integration with Maskito
// eslint-disable-next-line no-undef
export function getElementPredicate(el: HTMLIonInputElement) {
  return new Promise(resolve => {
    requestAnimationFrame(async () => {
      const input = await el.getInputElement();
      resolve(input);
    });
  });
}

type PatternToken = { type: 'd' | 'a' | '*'; quant: number; regex: RegExp; placeholder: string };

const MASK_CHAR_REGEX: Record<PatternToken['type'], RegExp> = {
  d: /\d/,
  a: /[A-Za-z]/,
  '*': /[A-Za-z0-9]/, // Default: alphanum, can customize if needed
};

// Helper to sample letters/numbers for pretty placeholder
const DEMO_STRINGS = {
  d: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  a: ['A', 'B', 'C', 'x', 'y', 'z', 'D', 'f'],
  '*': ['A', '3', 'b', '8', 'z', '4', 'D', '0'],
};

function nextDemoChar(type: PatternToken['type'], idx: number) {
  const arr = DEMO_STRINGS[type];
  return arr[idx % arr.length];
}

export function generateMaskitoOptions(pattern: string) {
  const mask: (RegExp | string)[] = [];
  let placeholder = '';
  let i = 0,
    demoIdx = 0;

  while (i < pattern.length) {
    const char = pattern[i];

    // Match token+quantifier, e.g. d{2,3}, a{4}
    if (['d', 'a', '*'].includes(char)) {
      let maxQuant = 1;

      if (pattern[i + 1] === '{') {
        const quantEnd = pattern.indexOf('}', i + 2);
        if (quantEnd !== -1) {
          const quantString = pattern.slice(i + 2, quantEnd);
          if (quantString.includes(',')) {
            const [, max] = quantString.split(',').map(s => parseInt(s.trim()));
            maxQuant = max || parseInt(quantString.split(',')[0]); // if max is empty, use min
          } else {
            maxQuant = parseInt(quantString);
          }
          i = quantEnd; // skip ahead
        }
      } else {
        // Count repeats: ddd
        let j = i + 1;
        while (pattern[j] === char) {
          maxQuant++;
          j++;
        }
        i = j - 1;
      }

      // Generate mask for maximum possible characters
      for (let q = 0; q < maxQuant; q++) {
        mask.push(MASK_CHAR_REGEX[char as PatternToken['type']]);
        placeholder += nextDemoChar(char as PatternToken['type'], demoIdx++);
      }
    }
    // Fixed/separator char
    else {
      mask.push(char);
      placeholder += char;
    }
    i++;
  }

  // MaskitoOptions + placeholder + Ionic elementPredicate
  return {
    mask,
    placeholder,
    elementPredicate: getElementPredicate,
  };
}
