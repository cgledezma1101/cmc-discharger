// Bind static events when the document is ready
$(document).ready(function(){
  // Whenever any piece of the body is clicked, hide the arrow boxes
  $(document.body).on('click', function(){
    $('.arrow_box').fadeOut();
  });

  // When a progress cell is clicked, show its' arrow box and hide the others
  $('.td-progress').on('click', function(event){
    event.preventDefault();
    event.stopPropagation();
    child_box = $(this).children('.arrow_box').first();
    if(child_box.css('display') == 'none'){
      $('.arrow_box').fadeOut();
      child_box.fadeIn();
    }else{
      $('.arrow_box').fadeOut();
    }
  });
});
