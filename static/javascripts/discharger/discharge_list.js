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

    // Determine the color of the bar
    if(0 <= seconds_waiting && seconds_waiting < 2 * 3600){
      bar.addClass('progress-bar-success');
    } else if(2 * 3600 <= seconds_waiting && seconds_waiting < 4 * 3600){
      bar.removeClass('progress-bar-success');
      bar.addClass('progress-bar-warning');
    } else if(4 * 3600 <= seconds_waiting && seconds_waiting < 6 * 3600){
      bar.removeClass('progress-bar-warning');
      bar.addClass('progress-bar-danger');
    } else {
      bar.removeClass('progress-bar-danger');
      bar.css('background', 'black');
    }
    
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

  // Avoid hiding the arrow boxes when you click inside of them
  $('.arrow_box').on('click', function(event){
    event.stopPropagation();
  });

  // When a progress cell is clicked, show its' arrow box and hide the others
  $('.td-progress').on('click', function(event){
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
