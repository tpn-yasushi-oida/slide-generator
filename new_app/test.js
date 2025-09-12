/**
 * ユニットテスト
 */
function testGenerateJson() { 
    const prompt = getGeminiPrompt(mockUserInput)
    const raw = requestGemini(prompt);
    const cleaned = validateAndNormalizeSlideData(raw);
    console.log(JSON.stringify(cleaned, null, 2));
    return cleaned;
}

function testJson2Slide() { 
  const slideUrl = generatePresentation(mockSlideData, mockOptions) 
  console.log(slideUrl)
}

function testJson2SlideWithSetting() { 
  const slideUrl = generatePresentation(mockSlideData, mockOptions)
  console.log(slideUrl)
}

// function testMain() { 
//   const prompt = getGeminiPrompt(mockUserInput)
//   const raw = requestGemini(prompt);
//   const cleaned = validateAndNormalizeSlideData(raw);
//   const slideData = cleaned.slideData;
//   const slideUrl = generatePresentation(slideData) 
//   console.log(slideUrl)
// }

function testMain() { 
  generateSlideData(mockUserInput, mockOptions)
}

