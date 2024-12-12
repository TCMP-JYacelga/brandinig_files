jQuery.fn.ForceNumericOnly = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(event) {
							var keynum;
							var keychar;
							if (window.event) { // IE
								keynum = event.keyCode;
							}
							if (event.which) { // Netscape/Firefox/Opera
								keynum = event.which;
							}
							if (event.shiftKey)
							{
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
									(keynum >= 35 && keynum <= 40) || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))) {
								if (((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))
										&& (this.value.indexOf('.') != -1 && (this.value
												.substring(this.value
														.indexOf('.'))).length > 2))
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

jQuery.fn.ForceNumericOnlyUpto4Decimal = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(event) {
							var keynum;
							var keychar;
							if (window.event) { // IE
								keynum = event.keyCode;
							}
							if (event.which) { // Netscape/Firefox/Opera
								keynum = event.which;
							}
							if (event.shiftKey)
							{
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
									(keynum >= 35 && keynum <= 40) || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))) {
								if (((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))
										&& (this.value.indexOf('.') != -1 && (this.value
												.substring(this.value
														.indexOf('.'))).length > 4))
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

jQuery.fn.ForceNoSpecialSymbol = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, numbers 
							// keypad numbers, letters ONLY
							
								return (key == 8 || key == 9 || key == 46 || key==190
										|| (key >= 37 && key <= 40)
										|| (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
							})
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

jQuery.fn.OnlyNumbers = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(event) {
							var prevKey = -1, prevControl = '';
							var keynum;							
							if (window.event) { // IE
								keynum = event.keyCode;
							}
							if (event.which) { // Netscape/Firefox/Opera
								keynum = event.which;
							}
							if (event.shiftKey)
							{
							  return false;
							}							
							return((keynum == 8 || keynum == 9 || keynum == 17 || keynum == 46 || (keynum >= 35 && keynum <= 40) || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105) || (keynum == 65 && prevKey == 17 && prevControl == event.currentTarget.id)));							
							})
			})
};

//Function to allow negative amount values for input.

jQuery.fn.ForcePositiveAndNegativeNumbersOnly = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(event) {
							var keynum;
							var keychar;
							if (window.event) { // IE
								keynum = event.keyCode;
							}
							if (event.which) { // Netscape/Firefox/Opera
								keynum = event.which;
							}
							if (event.shiftKey)
							{
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
									(keynum >= 35 && keynum <= 40) || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))) {
								if (((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))
										&& (this.value.indexOf('.') != -1 && (this.value
												.substring(this.value
														.indexOf('.'))).length > 2))
									return false;
								return true;
							} else if (keynum == 110 || keynum == 190) {
								var checkdot = this.value;
								var i = 0;
								for (i = 0; i < checkdot.length; i++) {
									if (checkdot[i] == '.')
									{
										return false;
									}
								}
								if (checkdot.length == 0)
									this.value = '0';
								if (checkdot.length == 1 && checkdot == '-')
									this.value = '-0';
								return true;
							}
							else {
								// Ensure that it is a number and stop
								// the keypress
								if (event.shiftKey
										|| (keynum < 48 || keynum > 57)
										&& (keynum < 96 || keynum > 105)) {
										
									if ((keynum == 173 || keynum == 189 || keynum == 109) && this.value.length == 0)
									{
									return true;
									}
									else
									{									
									event.preventDefault();
									}
								}
							}

							keychar = String.fromCharCode(keynum);

							return !isNaN(keychar);
							})
			})
};

jQuery.fn.ForceNoSpecialSymbolWithSpace = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = 0;
							if (window.event) { // IE
								key = e.keyCode;
							}
							if (e.which) { // Netscape/Firefox/Opera
								key = e.which;
							}
							if((key == 86 ) && event.ctrlKey)
							{
								$(this).on('input', function(eventObj) {
									$(eventObj.target).val($(eventObj.target).val().replace(/[^a-zA-Z 0-9]/g, ''));
								});
								return true ;
							}
							if((key == 67 ) && event.ctrlKey)
							{
								return true ;
							}
							if(((key >= 48 && key <= 57) || key==190)  && e.shiftKey)
								return false;
								
							// allow backspace, tab, delete, space, numbers 
							// keypad numbers, letters ONLY
							return (key == 8 || key == 9 || key == 46 || key == 32 
										|| (key >= 37 && key <= 40)
										|| (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
							})
							
			})
};