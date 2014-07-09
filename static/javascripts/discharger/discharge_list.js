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
    return true;
  });
};

// Bind static events when the document is ready
$(document).ready(function(){
  // Set the interval to increment timers every second
  setInterval(incrementTimers, 1000);

  // Place the checked and disabled properties of the checkboxes to their
  // appropriate values, overriding whatever firefox remembers
  $('.stage-checkbox').each(function(){
    checkbox = $(this);
    stages_id = checkbox.attr('id')
    associated_bar = checkbox.closest('.arrow_box')
                             .siblings('.progress')
                             .find('.progress-bar#' + stages_id)
                             .first();
    if(associated_bar.css('width') == '0px'){
      checkbox.prop('checked', false);
    } else {
      checkbox.prop('checked', 'checked');
    }

    if((checkbox.data('should-disable') == "1") ||
       (checkbox.prop('checked'))){
      checkbox.prop('disabled', 'disbaled');
    } else {
      checkbox.prop('disabled', false);
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
    var checkbox = $(this)
    var is_checked = checkbox.prop('checked');
    var sequence_number = +(checkbox.parent().data('sequence-number'))
    if(is_checked){
      // If the checkbox was marked, perform the JSON call to complete the stage
      var discharge_id = +(checkbox.parents('tr').data('discharge-id'));
      var stage_id = checkbox.attr('id');
      var request_url = '/altas/discharges/' + discharge_id +
                        '/complete_stage/' + stage_id;
      
      // Hide the checkbox and show the loader
      loader = checkbox.siblings('.loader');
      loader.show();
      checkbox.hide();

      $.getJSON(request_url, function(return_code){
        var bars = checkbox.closest('.arrow_box')
                           .siblings('.progress')
                           .find('.progress-bar#' + stage_id);
        bars.css('width', '100%');
        // Disable the checkbox that was clicked and enable the next ones when
        // appropriate
        checkbox.prop('disabled', 'disabled');

        if(return_code == 1){
          // A return code of 1 means the record still has more stages to
          // complete
          enable_next = true;
          // First check if there are any stages left with the same sequence
          // number
          same_sequence_query = '.stage-checkbox-div[data-sequence-number=' +
                                sequence_number + ']';
          same_sequence_divs = checkbox.parent().siblings(same_sequence_query)
          same_sequence_divs.each(function(){
            stages_checkbox = $(this).children('.stage-checkbox')
            if(!stages_checkbox.prop('checked')){
              enable_next = false;
              return false;
            }
            return true;
          })

          // If all checkboxes of the same stage where checked, then enable the
          // next stage
          if(enable_next) {
            sequence_number += 1;
            next_sequence_query = '.stage-checkbox-div[data-sequence-number=' +
                                  sequence_number + ']';
            next_sequence_divs = checkbox.parent()
                                         .siblings(next_sequence_query)
                                         .children('.stage-checkbox')
                                         .prop('disabled', false);
          }
        } else if(return_code == 2) {
          // A return code of 2 means there are no more stages to complete
          container = checkbox.parents('tr');
          container.fadeOut('slow', function(){
            container.remove();
          })
        }
      }).fail(function(){
        checkbox.prop('checked', false);
      }).always(function(){
        // Fail or success, the checkbox must always be shown again and the
        // loader must always be hidden
        loader.hide();
        checkbox.show();
      });
    }
  });

  $('.cancel-button').on('click', function(event){
    event.preventDefault();

    clicked = $(this);
    // Display the ajax loader while an answer is received
    loader = clicked.siblings('.loader');
    loader.show();
    clicked.hide();

    id = clicked.parents('tr').data('discharge-id')
    request_url = '/altas/discharges/' + id + '/cancel'
    $.getJSON(request_url, function(return_status){
      if(return_status == 1){
        clicked.parents('tr').fadeOut('slow', function(){
          $(this).remove();
        })
      } else {
        loader.hide();
        clicked.show();
        alert('Hubo un error al eliminar el alta. Inténtelo de nuevo más ' +
              'tarde');
      }
    }).always(function(){
      loader.hide();
      clicked.show();
    })
  })
});
