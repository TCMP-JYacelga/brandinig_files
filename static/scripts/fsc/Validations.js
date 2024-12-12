jQuery.fn.ForceNumericOnly = function(intPrecision, intDecimal) {
	if (intPrecision == null)
		intPrecision = 11;
	if (intDecimal == null)
		intDecimal = 5;
	return this.each(function() {
		$(this).keydown(function(event) {
			var keynum;
			var keychar;
			var caret = $(this).caret();
			if (window.event) { // IE
				keynum = event.keyCode;
			}
			if (event.which) { // Netscape/Firefox/Opera
				keynum = event.which;
			}
			if (event.shiftKey) {
				if(keynum === 9)
					return true;
				return false;
			}
			if ((this.value.length > intPrecision - 4)
					&& this.value.indexOf('.') == -1) {
				if (keynum == 110 || keynum == 190 || keynum == 8
						|| keynum == 46) {
					return true;
				} else {
					return false;
				}
			}
			if ((keynum == 8 || keynum == 9 || keynum == 27 || keynum == 46
					||
					// Allow: Ctrl+A
					(keynum == 65 && event.ctrlKey === true)
					||
					// Allow: home, end, left, right
					(keynum >= 35 && keynum <= 40)
					|| (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))) {
				if (((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))
						&& (this.value.indexOf('.') != -1 && (this.value
								.substring(this.value.indexOf('.'))).length > intDecimal)
						&& (this.value.indexOf('.') != -1 && caret > this.value
								.indexOf('.')))
					return false;
				return true;
			} else if (keynum == 110 || keynum == 190) {
				var checkdot = this.value;
				var i = 0;
				for (i = 0; i < checkdot.length; i++) {
					if (checkdot[i] == '.')
						return false;
				}
				if (checkdot.length == 0)
					this.value = '0';
				return true;
			} else {
				// Ensure that it is a number and stop
				// the keypress
				if (event.shiftKey || (keynum < 48 || keynum > 57)
						&& (keynum < 96 || keynum > 105)) {
					event.preventDefault();
				}
			}

			keychar = String.fromCharCode(keynum);

			return !isNaN(keychar);
		})
	})
};

jQuery.fn.ForceNoSpecialSymbol = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, numbers 
							// keypad numbers, letters ONLY
							
								if ((event.shiftKey )&&( key == 35 ||  key == 36 ||key == 37 || key == 39 || key == 9)) {
							     return true;
						       }
						       else if(event.shiftKey){
									return false;
								}
							
								return (key == 8 || key == 9 || key == 46 || key==190
										|| (key >= 35 && key <= 40)
										|| (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
							})
			})
};

jQuery.fn.checkmypApprManual = function(){
	if($('#mypApprManual').is(':checked')==true){
		    $('#autoAuthLimitManual').val('0.0');
			$('#autoAuthLimitManual').attr('disabled',true);
		}
		else{
			$('#autoAuthLimitManual').attr('disabled',false);
		}
	  $('#mypApprManual').click(function(){
		  			if($('#mypApprManual').is(':checked')==true){
					$('#autoAuthLimitManual').val('0.0');
		  				$('#autoAuthLimitManual').attr('disabled',true);
		  			}
		  			else{
		  				$('#autoAuthLimitManual').attr('disabled',false);
		  			}
	  })
};
jQuery.fn.checkmypApprUpload = function(){
	if($('#mypApprUpload').is(':checked')==true){
		  $('#autoAuthLimitUpload').val('0.0');
			$('#autoAuthLimitUpload').attr('disabled',true);
		}
		else{
			$('#autoAuthLimitUpload').attr('disabled',false);
		}
	  $('#mypApprUpload').click(function(){
		  			if($('#mypApprUpload').is(':checked')==true){
		  				$('#autoAuthLimitUpload').val('0.0');
		  				$('#autoAuthLimitUpload').attr('disabled',true);
		  			}
		  			else{
		  				$('#autoAuthLimitUpload').attr('disabled',false);
		  			}
	  })
};

jQuery.fn.AllowDeleteFunctionality = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad numbers ONLY
							return (key == 8 || key == 46 );
							})
			})
};
jQuery.fn.dateBox = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad for TAB
							return (key == 9 || key==8 || key==46);
							})
			})
};

jQuery.fn.ForceNumbersOnly = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(event) {
//							var key = e.charCode || e.keyCode || 0;
//							if(e.shiftKey)
//								 {
//									
//									e.preventDefault();
//								 }
//							// allow backspace, tab, delete, arrows, numbers and
//							// keypad numbers ONLY
//							var value=$(this).val();
//							
//								return (key == 8 || key == 9 || key == 46 
//										|| (key >= 37 && key <= 40)
//										|| (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
							
							var keynum;
							var keychar;
							if (window.event) { // IE
								keynum = event.keyCode;
							}
							if (event.which) { // Netscape/Firefox/Opera
								keynum = event.which;
							}
							if ((event.shiftKey )&&( keynum == 35 ||  keynum == 36 ||keynum == 37 || keynum == 39 || keynum == 9)) {
									return true;
								}
							else if(event.shiftKey){
									return false;
								}
							if ((keynum == 8
									|| keynum == 9
									|| keynum == 27
									|| keynum == 46
									||
									// Allow: Ctrl+A
									(keynum == 65 && event.ctrlKey === true)
									||
									// Allow: home, end, left, right
									(keynum >= 35 && keynum <= 40) || (keynum >= 96 && keynum <= 105))) {
								return true;
							}  else {
								// Ensure that it is a number and stop
								// the keypress
								if (event.shiftKey
										|| (keynum < 48 || keynum > 57)
										&& (keynum < 96 || keynum > 105)) {
									event.preventDefault();
								}
							}

							keychar = String.fromCharCode(keynum);

							return !isNaN(keychar);
							})
			})
};

jQuery.fn.ForceAlphaNumericOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) 
						{
							// allows only alphabets & numbers, backspace, tab
							var keycode = e.which || e.keyCode;						
							if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122)
									|| keycode == 8 || keycode == 9)
								return true;

							return false;
						})
			})
};
