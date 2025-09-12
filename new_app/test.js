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

function testJson2SlideWithSetting() { 
  const presentation = initSlide("テストスライド")
  const primaryColor = '#ff0000'
  const footerText = "© TOPPAN Inc."
  const headerLogoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaWj9IAldlS2r14RkWuKTyOvLs2csIH8rsxA&s"
  const closingLogoUrl = "https://i.ytimg.com/vi/u-N7jG6T7UA/maxresdefault.jpg"
  const fontFamily = "Murecho"
  const slideUrl = generatePresentation(presentation, mockSlideData, primaryColor, footerText, headerLogoUrl, closingLogoUrl, fontFamily)
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