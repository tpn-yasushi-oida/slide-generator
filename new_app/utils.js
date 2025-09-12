// 新しいスライドを生成
function initSlide(title) {
    const presentation = SlidesApp.create(title)
    const slides = presentation.getSlides();
    // 全てのスライドを削除
    for (let i = slides.length - 1; i >= 0; i--) slides[i].remove();
      
    return presentation
}