// Document ready handler, form generation, begin!
$(function(){
  $('body').css('fontFamily', 'Arial, Helvetica, sans-serif')
    .css('color', '#444444');

  var contents = $('#contents');
  contents.html("<h1>Live API!</h1>");
  form.addNewlineInput(contents, 'Media API Write Token', 'token', 50)
  addVideoForm(contents);
});

// Builds up the video form that can be easily converted to a Video Object
// that can be directly converted to JSON used in Media API calls. The 'name'
// attribute of the inputs is used directly as property names in the Video 
// and rendition objects when submitted
function addVideoForm(container) {

  var videoForm = $('<div>');
  videoForm.html('<h2>Video</h2>')
    .css('width', '750')
    .css('padding', '10')
    .css("backgroundColor", '#F3F3F3');

  var video = $('<div id="video">');
  video.corner();
  videoForm.append(video);
  form.addNewlineInput(video, 'Name', 'name', 30);
  form.addNewlineInput(video, 'Reference ID', 'referenceId', 30);

  var renditions = $('<div id=renditions>');
  renditions.html('<h3>Live Renditions</h3>');
  videoForm.append(renditions);

  var renditionsView = $('<div>');

  var renditionSelectElem = $('<span>').html('Select number of renditions (Warning: changing will clear values):  ');
  var renditionSelect = $('<select/>')
  for (var r=1;r<9;r++) {
    $('<option />', {value: r, text: r}).appendTo(renditionSelect);
  } 
  renditionSelect.change(function(){updateRenditionView(renditionsView, $(this).val())});
  renditionSelect.val(4);
  renditionSelect.change();
  renditionSelectElem.append(renditionSelect);

  renditions.append(renditionSelectElem);
  renditions.append(renditionsView);

  var hlsRendition = $('<div>');
  hlsRendition.html('<h3>Live HLS Rendition</h3>');
  addHlsRendition(hlsRendition);
  videoForm.append(hlsRendition);

  videoForm.append('<div id="results"/>');

  form.addButton(videoForm, createVideo, 'Create Video!');
  form.addButton(videoForm, fillInForm, 'Pre-Fill Data');

  container.append(videoForm);
}

// Re-creates the rendition form elements (non-HLS)
function updateRenditionView(renditions, numRenditions) {
  console.log("num: " + numRenditions);
  renditions.html('');
  for (var i=0;i<numRenditions;i++) { 
    addRendition(renditions); 
  }
}

// Adds the HLS rendition to the form.
function addHlsRendition(container) {
  var renditionCont = getRenditionCont(); 
  renditionCont.attr('class', 'hlsRendition');
  form.addInlineInput(renditionCont, 'URL', 'remoteUrl', 50);
  container.append(renditionCont);
}

// Adds a non-HLS rendition to the form.
function addRendition(container) {
  var renditionCont = getRenditionCont(); 

  form.addInlineInput(renditionCont, 'URL', 'remoteUrl', 50);
  form.addInlineInput(renditionCont, 'Encoding Rate (bps, not kbps)', 'encodingRate', 8);
  renditionCont.append($('</br>'));
  form.addInlineInput(renditionCont, 'Frame Height', 'frameHeight', 5);
  form.addInlineInput(renditionCont, 'Frame Width', 'frameWidth', 5);

  container.append(renditionCont);
}

// Helpers for creating / styling a rendition in the form.
function getRenditionCont() {
  var renditionCont = $('<div class="rendition">');
  renditionCont.css('marginLeft', '20')
    .css('marginTop', '10')
    .css('padding', '10')
    .css('backgroundColor', '#E3E3E3');
  renditionCont.corner();
  return renditionCont;
}

// POST a create_video API call for the live renditions (non-HLS)
function createVideo() {
  var video = getVideoObject();
  submitVideo(video, 'create_video', onCreateSuccess);
}

// POST an update_video API call for the HLS rendition
function updateVideo(video) {
  submitVideo(video, 'update_video', onUpdateSuccess);
}

// Helper for POSTing a video through proxy.php
function submitVideo(video, method, successCallback) {

  var params = {};
  params.token = $('input[name="token"]').val();
  params.video = video;

  var json = {};
  json.method = method;
  json.params = params;

  console.log(json);

  $.post('proxy.php', {'json':JSON.stringify(json)}, successCallback); 
}

// Creation success handler. Trigger the update call to fill in the HLS rendition.
function onCreateSuccess(data) {
  console.log('success!');
  console.log(data);

  var jsonData = $.parseJSON(data);

  if (jsonData.result) {
    createHlsRendition(jsonData.result);
  }
}

// Final success handler, success on update with the HLS rendition.
function onUpdateSuccess(data) {
  console.log("update success!");
  console.log(data);
  var jsonData = $.parseJSON(data);
  var results = $('<h2>');
  results.html("Created Video ID: " + jsonData.result.id);
  $('#results').append(results); 
  $('#results').css('backgroundColor', '#AFFFB4');
}

// Creates the HLS rendition from the form data, setting appropriate defaults.
function createHlsRendition(videoId) { 
  var video = getVideoOnly(); 
  var hlsRendition = {};
  setRenditionDefaults(hlsRendition);
  hlsRendition.remoteUrl = $($('.hlsRendition :input')[0]).val();
  hlsRendition.controllerType = 'AKAMAI_HD_LIVE';
  hlsRendition.videoCodec = 'H264';
  hlsRendition.videoContainer = 'M2TS';
  
  video.videoFullLength = hlsRendition; 
  updateVideo(video);
}

// Helper to get only the video properties, no rendition information.
function getVideoOnly() {
  var videoInputs = $('#video :input');
  var video = inputsToObject(videoInputs);
  return video;
}

// Gets the Video object needed to create a video with live rendiitons
// (No HLS rendition used on Create)
function getVideoObject() {
  var video = getVideoOnly();
  video.renditions = [];
  video.shortDescription = "A Live Video!";

  var renditions = video.renditions;
  var renditionElems = $('.rendition');
  renditionElems.each(function (i, renditionForm) {
    var renditionInputs = $(renditionForm).find(':input');
    var rendition = inputsToObject(renditionInputs);
    setRenditionDefaults(rendition);
    renditions.push(rendition);
  });
  return video;
}

// Sets the defaults of the rendition used for Live Akamai HD Videos
function setRenditionDefaults(rendition) {
    rendition.size = 0; 
    rendition.videoDuration = -1; 
    rendition.videoCodec = 'ON2'; 
    rendition.videoContainer = 'MP4'; 
    rendition.controllerType = 'AKAMAI_HD_LIVE'; 
}

// Converts form inputs to an Object, that has the same property -> value
// as the form inputs had input name -> input value
function inputsToObject(formInputs, formObj) {
  var formObj = {}
  formInputs.each(function(){
    var value = $(this).val();
    if (value) {
      formObj[this.name] = value;
    }
  });

  return formObj; 
}

// Helpers to generate random GUID, to prevent reference ID collisions
function S4() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
     return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// Helpers for filling in the form
function fillInForm() {
  $('input[name="token"]').val('YOU WRITE TOKEN HERE');
  var video = $('#video');
  fillInField(video, 'name', "Live Stream Combo");
  fillInField(video, 'referenceId', guid());
  var renditionElems = $('.rendition');
  renditionElems.each(function (i, renditionForm) {
    var rend = $(renditionForm);
    fillInField(rend, 'remoteUrl', "http://brightcove03-f.akamaihd.net/");
    fillInField(rend, 'encodingRate', '300000');
	fillInField(rend, 'frameHeight', '640');
    fillInField(rend, 'frameWidth', '480');

  });
  var hlsRenditionElems = $('.hlsRendition');
  hlsRenditionElems.each(function (i, renditionForm) {
    var rend = $(renditionForm);
    fillInField(rend, 'remoteUrl', "http://bcoveliveios-i.akamaihd.net/hls/live/");
  });
}

function fillInField(container, name, value) {
  container.find('input[name="'+name+'"]').val(value);
}


