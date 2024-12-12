/*  jQuery Nice Select - v1.1.0
    https://github.com/hernansartorio/jquery-nice-select
    Made by Hernán Sartorio  */
 
(function($) {
  $.fn.niceSelect = function(method) {
	
	 var escapeCharArray = {
			  '&': '&amp;',
			  '<': '&lt;',
			  '>': '&gt;',
			  '"': '&quot;',
			  "'": '&#x27;',
			  '`': '&#x60;',
			  '=': '&#x3D;'
			};

    // Methods
    if (typeof method == 'string') {      
      if (method == 'update') {
        this.each(function() {
          var $select = $(this);
          var $dropdown = $(this).next('.nice-select');
          var $dropdownlist = $('#'+ $select.attr('id').replace(/\./g, '\\.') + '-niceSelectList');
          var open = $dropdownlist.hasClass('open');
          
          if ($dropdownlist.length) {
            $dropdown.remove();
            $dropdownlist.remove();
            create_nice_select($select);
            if (open) {
            	$dropdown.trigger('click');
            	$dropdownlist.trigger('click');
            }
          }
        });
      } else if (method == 'destroy') {
        this.each(function() {
          var $select = $(this);
          var $dropdown = $(this).next('.nice-select');
          var $dropdownlist = $('#'+ $select.attr('id').replace(/\./g, '\\.') + '-niceSelectList');
          $select.removeClass('jq-nice-select')
          if ($dropdownlist.length) {
            $dropdown.remove();
            $dropdownlist.remove();
            $select.css('display', '');
          }
        });
        if ($('.nice-select-list').length == 0) {
          $(document).off('.nice_select');
        }
      } else {
        console.log('Method "' + method + '" does not exist.')
      }
      return this;
    }
			function escapeChar(chr) {
			  return escapeCharArray[chr];
			}

	function escapeExpression(string) {
		var badChars = /[&<>"'`=]/g,
	    possible = /[&<>"'`=]/;
				  if (typeof string !== 'string') {
				    // don't escape SafeStrings, since they're already safe
				    if (string && string.toHTML) {
				      return string.toHTML();
				    } else if (string == null) {
				      return '';
				    } else if (!string) {
				      return string + '';
				    }

				    // Force a string conversion as this will be done by the append regardless and
				    // the regex test will do this transparently behind the scenes, causing issues if
				    // an object's to string has escaped characters in it.
				    string = '' + string;
				  }

				  if (!possible.test(string)) {
				    return string;
				  }
				  return string.replace(badChars, escapeChar);
	}
	
    // Hide native select
    this.hide();
    
    // Create custom markup
    this.each(function() {
      var $select = $(this);
      if ((!$select.next().hasClass('nice-select')) && ($('#'+ $select.attr('id').replace(/\./g, '\\.') + '-niceSelectList')).length != 1) {
        create_nice_select($select);
      }
    });
    
    function create_nice_select($select) {
      $select.addClass('jq-nice-select')
      $select.after($('<div></div>')
        .addClass('nice-select')
        .attr('id', $select.attr('id') ? $select.attr('id') +'-niceSelect' : '')
        .addClass($select.attr('class') || '')
        .addClass($select.attr('disabled') ? 'disabled' : '')
        .attr('tabindex', $select.attr('disabled') ? null : $select.attr('tabindex'))
        .html('<span class="current"></span>')
      );
      var $outerDiv = $('<div class="nice-select-list ui-multiselect-menu ui-widget ui-widget-content ui-corner-all"><ul class="list"></ul></div>').attr('id', $select.attr('id') ? $select.attr('id') +'-niceSelectList' : '').appendTo("body"); 
      var $list = $outerDiv.find('.list');
      var $dropdown = $select.next();
      var $options = $select.find('option');
      var $selected = $select.find('option:selected');
      var escapeStrText = escapeExpression($selected.data('display') || $selected.text());
	  
      $dropdown.find('.current').html(escapeStrText);
      
      $options.each(function(i) {
        var $option = $(this);
        var display = $option.data('display');
		var escText = escapeExpression($option.text());
        $list.append($('<li></li>')
          .attr('data-value', $option.val())
          .attr('title',$option.text())
          .attr('data-display', (display || null))
          .addClass('option' +
            ($option.is(':selected') ? ' selected' : '') +
            ($option.is(':disabled') ? ' disabled' : ''))
          .html(escText)
        );
      });
    }
    
    /* Event listeners */
    
    // Unbind existing events in case that the plugin has been initialized before
    $(document).off('.nice_select');
    
    // Open/close
    $(document).on('click.nice_select', '.nice-select', function(event) {
         var currentElement=this.id;
    	$('.nice-select').each(function(i, obj) {
            var previousElement=this.id;
            if(currentElement!=previousElement){
            var $id = $('#'+ $(this).attr('id').replace(/\./g, '\\.') + 'List');
            $id.hide();
            $id.removeClass('open');
            }
      });
      var $dropdown = $('#'+ $(this).attr('id').replace(/\./g, '\\.') + 'List');
      $('.nice-select-list').not($dropdown).removeClass('open');
      $dropdown.toggleClass('open');
      var pos = $(this).offset();
      $dropdown.outerWidth($(this).outerWidth()); 
      $dropdown.css({
    	  display : 'block',
          top: pos.top + $(this).outerHeight(),
          left: pos.left
        });
      
      if ($dropdown.hasClass('open')) {
        $dropdown.find('.option');  
        $dropdown.find('.focus').removeClass('focus');
        $dropdown.find('.selected').addClass('focus');
      } else {
        $dropdown.focus();
      }
    });
    
    // Close when clicking outside
    $(document).on('click.nice_select', function(event) {
      if ($(event.target).closest('.nice-select-list').length === 0 && $(event.target).closest('.nice-select').length === 0) {
        $('.nice-select-list').removeClass('open').find('.option');  
        $('.nice-select-list').hide();
        $('.nice-select-list').removeClass('open');
      }
    });

    $(document).on('dialogclose', function(event) {
    	var $dropdownlist =  $('.nice-select-list');
    	$dropdownlist.each(function(i) {
    		var $dropdown = $(this);
    		if ($dropdown.hasClass('open')) {
    	        $dropdown.hide();
    	        $dropdown.removeClass('open');
    	    }
    	});   
  	 });
    // Option click
    $(document).on('click.nice_select', '.nice-select-list .option:not(.disabled)', function(event) {
      var $option = $(this);
      var $dropdown = $option.closest('.nice-select-list');
      $('#'+$dropdown.attr('id').replace(/\./g, '\\.').slice(0, -4)).focus();
      $dropdown.find('.selected').removeClass('selected');
      $option.addClass('selected');
      
      var text = $option.data('display') || $option.text();
      $('#'+$dropdown.attr('id').replace(/\./g, '\\.').slice(0, -4)).find('.current').text(text);
      
      $('#'+$dropdown.attr('id').replace(/\./g, '\\.').replace('-niceSelectList', '')).val($option.attr('data-value')).trigger('change');
      $dropdown.hide();
      $dropdown.removeClass('open');
    });

    // Keyboard events
    $(document).on('keydown.nice_select', '.nice-select', function(event) {
      var $dropdown = $(this);
      var $dropdownlist = $('#'+ $dropdown.attr('id').replace(/\./g, '\\.') + 'List');
	  var $container = $dropdownlist.find('.list');
      if(!$dropdownlist.hasClass('open'))
    	  var $focused_option = $dropdown.find('.focus');
      else{
    	  var $focused_option = $dropdownlist.find('.list .option.selected');
    	  $focused_option.focus();
      }	  
      // Space or Enter or Esc
      if (event.keyCode == 32 || event.keyCode == 13 || event.keyCode == 27) {
    	  if(event.keyCode != 27)
          {
  	    	if ($dropdownlist.hasClass('open')) {
  	          $focused_option.trigger('click');
  	        } else {
  	          $dropdown.trigger('click');
  	        }
          }
		$('#'+$dropdown.attr('id'))[0].focus();
        return false;
      // Down
      } else if (event.keyCode == 40) {
        if (!$dropdownlist.hasClass('open')) {
          $dropdown.trigger('click');
        } else {
          var $next = $focused_option.nextAll('.option:not(.disabled)').first();
          if ($next.length > 0) {
        	  $dropdownlist.find('.focus').removeClass('focus selected ui-state-hover');
        	  $next.addClass('focus selected ui-state-hover');
        	  var text = $next.data('display') || $next.text();
        	  if($next.index()%6 == 0){
        		  $container.scrollTop(40*$next.index());
        	  }
        	  $('#'+$dropdown.attr('id').replace(/\./g, '\\.')).find('.current').text(text);
              $('#'+$dropdown.attr('id').replace(/\./g, '\\.').replace('-niceSelect', '')).val($next.attr('data-value'));
          }
        }
        return false;
      // Up
      } else if (event.keyCode == 38) {
        if (!$dropdownlist.hasClass('open')) {
          $dropdown.trigger('click');
        } else {
          var $prev = $focused_option.prevAll('.option:not(.disabled)').first();
          if ($prev.length > 0) {
        	  $dropdownlist.find('.focus').removeClass('focus selected ui-state-hover');
        	  $prev.addClass('focus selected ui-state-hover');
        	  var text = $prev.data('display') || $prev.text();
        	  if($prev.next().index()%6 == 0){
        		  $container.scrollTop(40*($prev.index()-5));
        	  }
        	  $('#'+$dropdown.attr('id').replace(/\./g, '\\.')).find('.current').text(text);
              $('#'+$dropdown.attr('id').replace(/\./g, '\\.').replace('-niceSelect', '')).val($prev.attr('data-value'));
          }
        }
        return false;
      // Esc
//      } else if (event.keyCode == 27) {
//        if ($dropdownlist.hasClass('open')) {
//          $dropdown.trigger('click');
//          $dropdownlist.hide();
//          $dropdownlist.removeClass('open');
//        }
      // Tab
      } else if (event.keyCode == 9) {
        if ($dropdownlist.hasClass('open')) {
        	var text = $focused_option.data('display') || $focused_option.text();
        	$('#'+$dropdown.attr('id').replace(/\./g, '\\.')).find('.current').text(text);
            $('#'+$dropdown.attr('id').replace(/\./g, '\\.').replace('-niceSelect', '')).val($focused_option.attr('data-value')).trigger('change');

        	var $canfocus = $(':focusable');
            var index = $canfocus.index(this) + 1;
            if (index >= $canfocus.length) index = 0;
            /*if(!event.shiftKey)
            	$canfocus.eq(index).focus();
            else 
            	$canfocus.eq(index-2).focus();*/
			$('#'+$dropdown.attr('id'))[0].focus();
            $dropdownlist.hide();
            $dropdownlist.removeClass('open');
            return false;
        }
      }
    });

    // Detect CSS pointer-events support, for IE <= 10. From Modernizr.
    var style = document.createElement('a').style;
    style.cssText = 'pointer-events:auto';
    if (style.pointerEvents !== 'auto') {
      $('html').addClass('no-csspointerevents');
    }
    
    return this;

  };

}(jQuery));