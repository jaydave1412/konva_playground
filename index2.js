let sceneWidth = 1000;
let sceneHeight = 1000;
let stage = new Konva.Stage({
    container: 'container',
    width: sceneWidth,
    height: sceneHeight
})
const hasGetUserMedia = () => {
    if (!navigator.mediaDevices &&
  !navigator.mediaDevices.getUserMedia){
      return false
    } else {
      return true
    }
  }
  const getVideoStream = () => {
    return navigator.mediaDevices.getUserMedia({video: true})
  }
  const setStream = (stream) => {
    $('#video')[0].srcObject = stream
}
function fitStageIntoParentContainer() {
    var container = document.querySelector('.canvas_wrapper');

    // now we need to fit stage into parent container
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;
    console.log(containerWidth)
    // but we also make the full scene visible
    // so we need to scale all objects on canvas

    stage.width(containerWidth);
    stage.height(containerHeight);
    // stage.scale({ x: scale, y: scale });
  }
  const draw_selfie_zone = (background,layer)=>{
    let video = $('video')[0]
    let preview = new Konva.Image({
      image : video,
      x :background.x(),
      y:background.y(),
      name : 'background',
      id : 'preview',
      draggable : true
  })
  let videoWidth = 640
  let videoHeight = 480
  let aspectRatio = videoWidth / videoHeight
  let imageRatio = background.width() / background.height()
  
   preview.width(videoWidth)
  preview.height(videoHeight)
  console.log(videoWidth)
  if(aspectRatio >= imageRatio){
    preview.width(background.height() * aspectRatio);
      preview.height(background.height());
  }
  else{
    preview.width(background.width());
      preview.height(background.width() / aspectRatio);
  }
  layer.add(preview);
  preview.moveToTop()
  console.log(preview)
   let anim = new Konva.Animation(function () {
    // do nothing, animation just need to update the layer
   }, layer);
   anim.start();
  }
window.addEventListener('resize', fitStageIntoParentContainer);

$(document).ready(async ()=>{
 
fitStageIntoParentContainer();

    try {
        if(!hasGetUserMedia()) throw new Error('Selfie not supported');
        let stream = await getVideoStream()
          console.log("video stream created")
        setStream(stream)
        console.log("video stream set")
        let img = new Image();

        let layer = new Konva.Layer();
        let background = new Konva.Rect({
    x : stage.width()-600,
    y : 20,
    width : 500,
    height : 500,
    fill : '#d6d6d6',
    id : 'background',
    name : 'preview',
    draggable : true
                      })
        img.src =  'Frame/frame.png';
        let image = new Konva.Image({
    x : 0,
    y : 0,
    image : img,
    width:  stage.width(),
    height: stage.height(),
    draggable : false,
    name : 'background'
         })
        console.log("background added")
  
        layer.add(background);
        console.log("drawing selfie")
        draw_selfie_zone(background,layer)
        layer.add(image)
        stage.add(layer);
        layer.draw();

    } catch (error) {
        alert(error)
    }
})