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

  // Place the checked and disabled properties of the checkboxes to their
  // appropriate values
  $('.stage-checkbox').each(function(){
    checkbox = $(this);
    stages_id = checkbox.attr('id')
    associated_bar = checkbox.closest('.arrow_box')
                             .siblings('.progress')
                             .find('.progress-bar#' + stages_id)
                             .first();
    if(checkbox.data('should-disable') == "1"){
      console.log('Disabling');
      console.log(checkbox);
      checkbox.prop('disabled', 'disbaled');
    } else {
      console.log('Enabling');
      console.log(checkbox);
      checkbox.prop('disabled', false);
    }

    if(associated_bar.css('width') == '0px'){
      checkbox.prop('checked', false);
    } else {
      checkbox.prop('checked', 'checked');
    }
  });

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

  // When a checkbox for a stage is clicked, then the respective progress bar
  // must be filled and the appropriate checkboxes must be enabled
  $('.stage-checkbox').on('click', function(){
    var stages_id = $(this).attr('id');
    var is_checked = $(this).prop('checked');
    var bars = $(this).closest('.arrow_box')
                      .siblings('.progress')
                      .find('.progress-bar#' + stages_id);
    var sequence_number = +($(this).parent().data('sequence-number'))
    if(is_checked){
      bars.css('width', '100%');
      // Disable the checkbox that was clicked and enable the next ones when
      // appropriate
      $(this).prop('disabled', 'disabled');

      enable_next = true;
      // First check if there are any stages left with the same sequence number
      same_sequence_query = '.stage-checkbox-div[data-sequence-number=]' +
                            sequence_number;
      console.log($(same_sequence_query))
      $(same_sequence_query).each(function(){
        stages_checkbox = $(this).children('.stage-checkbox')
        if((stages_checkbox.attr('id') != stages_id) &&
           (!stages_checkbox.prop('checked'))){
          enable_next = false;
          return false;
        }
        return true;
      })

      // If all checkboxes of the same stage where checked, then enable the
      // next stage
      if(enable_next) {
        sequence_number += 1;
        next_sequence_query = '.stage-checkbox-div[data-sequence-number=]' +
                              sequence_number;
        $(next_sequence_query).children('.stage-checkbox')
                              .removeProp('disabled');
      }
    } else {
      bars.css('width', '0%');
    }
  });
});
