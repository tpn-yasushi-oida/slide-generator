function testCreateSlide() {
    let presentation = initSlide("てすと");
    const slideURL = presentation.getUrl()
    console.log(`slideURL: ${slideURL}`);
}


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
  const presentation = initSlide("テストスライド")
  const slideUrl = generatePresentation(presentation, mockSlideData) 
  console.log(slideUrl)
}

function testAllFlow() { 
  const slideData = testGenerateSlideData()
  const slideUrl = generatePresentation(slideData) 
  console.log(slideUrl)
}