// 新しいスライドを生成
function initSlide(title) {
  const presentation = SlidesApp.create(title)
  const appFolder = createAppFolder()
  const file = DriveApp.getFileById(presentation.getId()); // DriveApp.File に変換
  file.moveTo(appFolder)
  return presentation
}

// 「AIスライド生成」フォルダをマイドライブ直下に作成
function createAppFolder(){
    const folderName = "AIスライド生成";
    let folder;
    const folders = DriveApp.getRootFolder().getFoldersByName(folderName);

    if (folders.hasNext()) {
      // フォルダが存在する場合は取得
      folder = folders.next();
      console.log("既存フォルダを使用: " + folder.getName());
    } else {
      // フォルダが存在しない場合は作成
      folder = DriveApp.getRootFolder().createFolder(folderName);
      console.log("新規フォルダを作成: " + folder.getName());
    }
    // console.log(folder)
    return folder
}


function testInitSlide(){
  initSlide("テストスライド")
}