/**
 * 単体テスト
 */
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
    const prompt = getGeminiPrompt(mockUserInput)
    const raw = requestGemini(prompt);
    const cleaned = validateAndNormalizeSlideData(raw);
    const slideData = cleaned.slideData;
    const presentation = initSlide("テストスライド")
    const slideUrl = generatePresentation(presentation, slideData) 
  console.log(slideUrl)
}