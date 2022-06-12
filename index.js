let sceneWidth = 1000;
let sceneHeight = 1000;
let transformer = new Konva.Transformer
function fitStageIntoParentContainer() {
    var container = document.querySelector('.canvas_wrapper');

    // now we need to fit stage into parent container
    var containerWidth = container.offsetWidth;

    // but we also make the full scene visible
    // so we need to scale all objects on canvas
    var scale = containerWidth / sceneWidth;

    stage.width(sceneWidth * scale);
    stage.height(sceneHeight * scale);
    stage.scale({ x: scale, y: scale });
  }
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
  const downloadURI= (uri, name)=> {
    let link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
  }
  const draw_selfie_zone = (background)=>{
    let video = $('video')[0]
    let preview = new Konva.Image({
      image : video,
      x :0,
      y:0,
      name : 'background',
      id : 'preview'
  })
  let videoWidth = video.videoWidth
  let videoHeight = video.videoHeight
  let aspectRatio = videoWidth / videoHeight
  let imageRatio = background.width() / background.height()
  
   preview.width(videoWidth)
  preview.height(videoHeight)
  if(aspectRatio >= imageRatio){
    preview.width(background.height() * aspectRatio);
      preview.height(background.height());
  }
  else{
    preview.width(background.width());
      preview.height(background.width() / aspectRatio);
  }
  layer.add(preview);
   let anim = new Konva.Animation(function () {
    // do nothing, animation just need to update the layer
   }, layer);
   anim.start();
  }
  const add_image_to_canvas = (image_src)=>{
    let img = new Image();
    img.src =  image_src;
    let image = new Konva.Image({
      x : 0,
      y : 0,
      image : img,
      width:  img.width,
      height: img.height,
      draggable : true,
      name : 'transformable'
    })
    layer.add(image)
    console.log(transformer.nodes())
    transformer.nodes([image])
    console.log(transformer.nodes())
    transformer.moveToTop()
    // layer.draw()
  }
  let stage = new Konva.Stage({
    container: 'container',
    width: sceneWidth,
    height: sceneHeight
})
let layer = new Konva.Layer();
layer.add(transformer)
let background = new Konva.Rect({
    x : 0,
    y : 0,
    width : stage.width(),
    height : stage.height(),
    fill : '#d6d6d6',
    id : 'background',
    name : 'background'
})

layer.add(background);
stage.add(layer);
layer.draw();

fitStageIntoParentContainer();
window.addEventListener('resize', fitStageIntoParentContainer);
$('#start_button').on('click', () =>{
    try {
        $('.start_screen').fadeOut(400,async () =>{
            $('.loading').fadeIn(200);
            if(!hasGetUserMedia()) throw new Error('Selfie not supported');
            let stream = await getVideoStream()
            setStream(stream)
            $('.loading').fadeOut(400,() =>{
                draw_selfie_zone(background);
                console.log(stage.width())

                $(".selfie_section").fadeIn();
                fitStageIntoParentContainer(); 
                console.log(stage.width())
            });
    
        });
        
    } catch (error) {
        alert(error)
    }
})
$('#click_selfie').on('click', ()=>{
    transformer.detach()
    layer.draw()
    var dataURL = stage.toDataURL();
    downloadURI(dataURL, 'stage.png');
})
$('[data-sticker]').on('click', (e)=>{
 
  let sticker = e.target.dataset.sticker
  let sticker_src = `stickers/${sticker}.png`
  // console.log(sticker_src)
  add_image_to_canvas(sticker_src)
  $('#stickers_modal').modal('hide');
})
stage.on('click tap', function (e) {
  let target = e.target
  console.log(target.name())
  console.log(target.id())
  if(target.name() === 'background' ){
    transformer.detach()
    layer.draw();
    return
  }

  if(target.name() === 'transformable'){
    console.log("into transformable")
    transformer.attachTo(target)
    layer.draw()
    
  }
})