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
  const slideUrl = generatePresentation(mockSlideData) 
  console.log(slideUrl)
}

function testJson2SlideWithSetting() { 
  const options = {
    primaryColor: '#ff0000',
    footerText: "© TOPPAN Inc.",
    headerLogoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaWj9IAldlS2r14RkWuKTyOvLs2csIH8rsxA&s",
    closingLogoUrl: "https://i.ytimg.com/vi/u-N7jG6T7UA/maxresdefault.jpg",
    fontFamily: "Murecho"
  }
  const slideUrl = generatePresentation(mockSlideData, options)
  console.log(slideUrl)
}

function testAllFlow() { 
    const prompt = getGeminiPrompt(mockUserInput)
    const raw = requestGemini(prompt);
    const cleaned = validateAndNormalizeSlideData(raw);
    const slideData = cleaned.slideData;
    const slideUrl = generatePresentation(slideData) 
  console.log(slideUrl)
}