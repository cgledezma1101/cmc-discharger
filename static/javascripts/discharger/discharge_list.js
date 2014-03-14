// When called it will increment all timers on the screen by one second
function incrementTimers(){
  $('.time-in-process').each(function(){
    var bar = $(this);
    var seconds_waiting = +(bar.data('time'));
    seconds_waiting += 1;

    var timer_seconds = seconds_waiting % 60;
    var timer_minutes = parseInt(seconds_waiting / 60) % 60;
    var timer_hours = parseInt(seconds_waiting / 3600) % 24;
    var timer_days = parseInt(seconds_waiting / 86400);

    var timer = 
      (timer_days <  10 ? "0" + timer_days : timer_days) + ":" + 
      (timer_hours < 10 ? "0" + timer_hours : timer_hours) + ":" +
      (timer_minutes < 10 ? "0" + timer_minutes : timer_minutes) + ":" +
      (timer_seconds < 10 ? "0" + timer_seconds : timer_seconds);
    
    bar.data('time', seconds_waiting);
    bar.text(timer);
  });
};

// Bind static events when the document is ready
$(document).ready(function(){
  // Set the interval to increment timers every second
  setInterval(incrementTimers, 1000);

  // Whenever any piece of the body is clicked, hide the arrow boxes
  $(document.body).on('click', function(){
    $('.arrow_box').fadeOut();
  });

  // When a progress cell is clicked, show its' arrow box and hide the others
  $('.td-progress').on('click', function(event){
    event.preventDefault();
    event.stopPropagation();
    var child_box = $(this).children('.arrow_box').first();
    if(child_box.css('display') == 'none'){
      $('.arrow_box').fadeOut();
      child_box.fadeIn();
    }else{
      $('.arrow_box').fadeOut();
    }
  });
});
