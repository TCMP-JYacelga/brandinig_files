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
									(keynum >= 35 && keynum <= 40) || (keynum >= 96 && keynum <= 105))) {
								if (((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))
										&& (this.value.indexOf('.') != -1 && (this.value
												.substring(this.value
														.indexOf('.'))).length > 5))
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
							if((keynum == 86 ) && event.ctrlKey)
							{
								$(this).on('input', function(eventObj) {
									$(eventObj.target).val($(eventObj.target).val().replace(/[^0-9]/g, ''));
								});
								return true ;
							}
							if((keynum == 67 ) && event.ctrlKey)
							{
								return true ;
							}
							if(event.shiftKey && keynum == 9 ){
								return true;
							}
							if (event.shiftKey)
							{
							  return false;
							}							
							return((keynum == 8 || keynum == 9 || keynum == 17 || keynum == 46 || (keynum >= 35 && keynum <= 40) || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105) || (keynum == 65 && prevKey == 17 && prevControl == event.currentTarget.id)));							
							})
			})
};

jQuery.fn.OnlyNumbersWitoutZero = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(event) {
							var prevControl = '';
							var keynum;							
							if (window.event) { // IE
								keynum = event.keyCode;
							}
							if (event.which) { // Netscape/Firefox/Opera
								keynum = event.which;
							}
							if(event.shiftKey && keynum == 9 ){
								return true;
							}
							if (event.shiftKey)
							{
							  return false;
							}
							if($(this).val().length == 0 || ($(this).prop("selectionStart") != $(this).prop("selectionEnd"))){
								return (keynum == 48 || keynum == 96) ? false:true;
							}
							return(keynum == 8 || keynum == 9 || keynum == 17 || keynum == 46 || (keynum >= 35 && keynum <= 40) || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105) || (keynum == 65 && prevControl == event.currentTarget.id));							
							})
			})
};


jQuery.fn.OnlyNumbersAndPlusMinus = function() {
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
							return((keynum == 8 || keynum == 9 || keynum == 43 || keynum == 45 || keynum == 107 || keynum == 109 || keynum == 17 || keynum == 46 || (keynum >= 35 && keynum <= 40) || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105) || (keynum == 65 && prevKey == 17 && prevControl == event.currentTarget.id)));							
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

jQuery.fn.ForceNoSpecialSymbolWithSpace = function() {
	return $(this).each(function() {
				$(this).on('input', function(eventObj) {
					$(eventObj.target).val($(eventObj.target).val().replace(/[^a-zA-Z0-9 ]/g, ''));
				});
			});
};

jQuery.fn.ForceNoSpecialSymbolWithoutSpace = function() {
	return $(this).each(function() {
				$(this).on('input', function(eventObj) {
					$(eventObj.target).val($(eventObj.target).val().replace(/[^a-zA-Z0-9]/g, ''));
				});
			});
};
jQuery.fn.alphanumericOnly = function() {
	return $(this).each(function() {
		$(this).on('input', function(eventObj) {
			$(eventObj.target).val($(eventObj.target).val().replace(/[^a-zA-Z0-9]/g, ''));
		});
	});
};
jQuery.fn.NumericOnly = function() {
	return $(this).each(function() {
		$(this).on('input', function(eventObj) {
			$(eventObj.target).val($(eventObj.target).val().replace(/[^0-9]/g, ''));
		});
	});
};
jQuery.fn.AlphaOnly = function() {
	return $(this).each(function() {
		$(this).on('input', function(eventObj) {
			$(eventObj.target).val($(eventObj.target).val().replace(/[^a-zA-Z]/g, ''));
		});
	});
};
