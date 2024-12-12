jQuery.fn.ForceNumericOnly = function(intPrecision, intDecimal) {
	if (intPrecision == null)
		intPrecision = 16;
	if (intDecimal == null)
		intDecimal = 4;
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
				return false;
			}
			if ((this.value.length >= intPrecision - 4)
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
				if (((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105)) && this.value.indexOf('.') != -1)
				{
					if(((caret > this.value.indexOf('.') && (this.value.substring(this.value.indexOf('.'))).length < intDecimal+1)
						|| (caret <= this.value.indexOf('.') && this.value.indexOf('.') < (intPrecision-intDecimal) ))) 
						return true;
					else
					return false;
				}
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

jQuery.fn.ForceAlphabetsAndSpaceAndCommaOnly = function() {
	return this
	.each(function(){
		$(this)
				.keypress(function(e) 
				{
					// allows only alphabets & space
					var keycode = e.which || e.keyCode;				
					console.log(keycode);
					if ((keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122) ||
							(keycode >= 48 && keycode <= 57) || (keycode >= 96 && keycode <= 105)|| keycode == 8 || keycode == 9 ||keycode == 32||keycode == 44)
						return true;

					return false;
				})
	})
};

jQuery.fn.ForceAlphabetsAndSpaceAndCommaAndPlusOnly = function() {
	return this
	.each(function(){
		$(this)
				.keypress(function(e) 
				{
					// allows only alphabets & space
					var keycode = e.which || e.keyCode;				
					console.log(keycode);
					if ((keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122) ||
							(keycode >= 48 && keycode <= 57) || (keycode >= 96 && keycode <= 105)|| keycode == 8 || keycode == 9 ||keycode == 32||keycode == 44 ||keycode == 43)
						return true;

					return false;
				})
	})
};

jQuery.fn.ForceAlphabetsAndSpaceOnly = function() {
	return this
	.each(function(){
		$(this)
				.keypress(function(e) 
				{
					// allows only alphabets & space
					var keycode = e.which || e.keyCode;						
					if ((keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122)
							|| keycode == 8 || keycode == 9 ||keycode == 32)
						return true;

					return false;
				})
	})
};

jQuery.fn.ForceNoSpecialSymbol = function() {
	return this.each(function() {
		$(this).keydown(function(e) {
			var key = e.charCode || e.keyCode || e.which || 0;
			// allow backspace, tab, delete, numbers
			// keypad numbers, letters ONLY
			if (e.shiftKey
					&& (key == 54 || key == 192 || key == 190 || key == 48 || key == 57)) {
				return false;
			}
			return (key == 8 || key == 9 || key == 46 || key == 190
					|| (key >= 35 && key <= 40) || (key >= 48 && key <= 57)
					|| (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
		})
	})
};

jQuery.fn.AllowDeleteFunctionality = function() {
	return this.each(function() {
				$(this).keydown(function(e) {
							var key = e.charCode || e.keyCode || e.which || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad numbers ONLY
							return (key == 8 || key == 46);
						})
			})
};
jQuery.fn.dateBox = function() {
	return this.each(function() {
				$(this).keydown(function(e) {
							var key = e.charCode || e.keyCode || e.which || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad for TAB
							return (key == 9 || key == 8 || key == 46);
						})
			})
};

jQuery.fn.OnlyNumbers = function() {
	return this.each(function() {
		$(this).keydown(function(event) {
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
			if ((event.shiftKey )&&( keynum == 35 ||  keynum == 36 ||keynum == 37 || keynum == 39 || keynum == 9)) {
				return true;
			}
			else if(event.shiftKey){
				return false;
			}
			return ((keynum == 8 || keynum == 9 || keynum == 17 || keynum == 46
					|| (keynum >= 35 && keynum <= 40)
					|| (keynum >= 48 && keynum <= 57)
					|| (keynum >= 96 && keynum <= 105) || (keynum == 65
					&& prevKey == 17 && prevControl == event.currentTarget.id)));
		})
	})
};

jQuery.fn.ForceAmountOnly = function() {
	return this.each(function() {
		$(this).keydown(function(event) {
			var keynum;
			var keychar;
			if (window.event) { // IE
				keynum = event.keyCode;
			}
			if (event.which) { // Netscape/Firefox/Opera
				keynum = event.which;
			}
			if (event.shiftKey) {
				return false;
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
								.substring(this.value.indexOf('.'))).length > 4))
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

;
(function($) {
	$.fn.placehold = function(placeholderClassName) {
		var placeholderClassName = placeholderClassName || "placeholder", supported = $.fn.placehold
				.is_supported();

		function toggle() {
			for (i = 0; i < arguments.length; i++) {
				arguments[i].toggle();
			}
		}

		return supported ? this : this.each(function() {
					var $elem = $(this), placeholder_attr = $elem
							.attr("placeholder");

					if (placeholder_attr) {
						if ($elem.val() === ""
								|| $elem.val() == placeholder_attr) {
							$elem.addClass(placeholderClassName)
									.val(placeholder_attr);
						}

						if ($elem.is(":password")) {
							var $pwd_shiv = $("<input />", {
										"class" : $elem.attr("class") + " "
												+ placeholderClassName,
										"value" : placeholder_attr
									});

							$pwd_shiv.bind("focus.placehold", function() {
										toggle($elem, $pwd_shiv);
										$elem.focus();
									});

							$elem.bind("blur.placehold", function() {
										if ($elem.val() === "") {
											toggle($elem, $pwd_shiv);
										}
									});

							$elem.hide().after($pwd_shiv);
						}

						$elem.bind({
									"focus.placehold" : function() {
										if ($elem.val() == placeholder_attr) {
											$elem
													.removeClass(placeholderClassName)
													.val("");
										}
									},
									"blur.placehold" : function() {
										if ($elem.val() === "") {
											$elem
													.addClass(placeholderClassName)
													.val(placeholder_attr);
										}
									}
								});

						$elem.closest("form").bind("submit.placehold",
								function() {
									if ($elem.val() == placeholder_attr) {
										$elem.val("");
									}

									return true;
								});
					}
				});
	};
	$.fn.placehold.is_supported = function() {
		return "placeholder" in document.createElement("input");
	};
})(jQuery);

(function($) {
	$.fn.caret = function(pos) {
		var target = this[0];
		var isContentEditable = target.contentEditable === 'true';
		// get
		if (arguments.length == 0) {
			// HTML5
			if (window.getSelection) {
				// contenteditable
				if (isContentEditable) {
					target.focus();
					var range1 = window.getSelection().getRangeAt(0), range2 = range1
							.cloneRange();
					range2.selectNodeContents(target);
					range2.setEnd(range1.endContainer, range1.endOffset);
					return range2.toString().length;
				}
				// textarea
				return target.selectionStart;
			}
			// IE<9
			if (document.selection) {
				target.focus();
				// contenteditable
				if (isContentEditable) {
					var range1 = document.selection.createRange(), range2 = document.body
							.createTextRange();
					range2.moveToElementText(target);
					range2.setEndPoint('EndToEnd', range1);
					return range2.text.length;
				}
				// textarea
				var pos = 0, range = target.createTextRange(), range2 = document.selection
						.createRange().duplicate(), bookmark = range2
						.getBookmark();
				range.moveToBookmark(bookmark);
				while (range.moveStart('character', -1) !== 0)
					pos++;
				return pos;
			}
			// Addition for jsdom support
			if (target.selectionStart)
				return target.selectionStart;
			// not supported
			return 0;
		}
		// set
		if (pos == -1)
			pos = this[isContentEditable ? 'text' : 'val']().length;
		// HTML5
		if (window.getSelection) {
			// contenteditable
			if (isContentEditable) {
				target.focus();
				window.getSelection().collapse(target.firstChild, pos);
			}
			// textarea
			else
				target.setSelectionRange(pos, pos);
		}
		// IE<9
		else if (document.body.createTextRange) {
			if (isContentEditable) {
				var range = document.body.createTextRange();
				range.moveToElementText(target);
				range.moveStart('character', pos);
				range.collapse(true);
				range.select();
			} else {
				var range = target.createTextRange();
				range.move('character', pos);
				range.select();
			}
		}
		if (!isContentEditable)
			target.focus();
		return pos;
	}
})(jQuery);

jQuery.fn.UpperCaseOnly = function() {
	return this.each(function() {
				$(this).keyup(function(e) {
							$(this).val($(this).val().toUpperCase());
						})
			})
};

jQuery.fn.NoSpecialCharacters = function(strChars) {
	return this.each(function() {
				$(this).keypress(function(e) {
					var strReg = strChars
							|| '`~!@#$%^&*()-_=+\\|]}[{;:\'"/?.>,<';
					var key = e.charCode || 0;
					var arrChar = (strReg || '').split('') || [];
					var arrKeys = [];
					$.each(arrChar, function(intIndex, _char) {
								arrKeys.push(_char.charCodeAt(0))
							});
					var isSpecialChar = $.inArray(key, arrKeys) > -1;
					if (isSpecialChar)
						return false;
					return true;
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
jQuery.fn.ForceNoSpecialSymbolWithSpaceAndPlus = function() {
	return $(this).each(function() {
				$(this).on('input', function(eventObj) {
					$(eventObj.target).val($(eventObj.target).val().replace(/[^a-zA-Z0-9 +]/g, ''));
				});
			});
};
jQuery.fn.ForceNoSpecialSymbolWithSpaceAndSlash = function() {
	return $(this).each(function() {
		$(this).on('input', function(eventObj) {
			$(eventObj.target).val($(eventObj.target).val().replace(/[^a-zA-Z0-9 \\/.]/g, ''));
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

jQuery.fn.alphanumericWithSpaceOnly = function() {
	return $(this).each(function() {
		$(this).on('input', function(eventObj) {
			$(eventObj.target).val($(eventObj.target).val().replace(/[^a-zA-Z 0-9]/g, ''));
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
jQuery.fn.NoSpecificSpecialSymbolsOnly = function() {
	return this
	.each(function(){
		$(this)
				.keypress(function(e) 
				{
					// allows only alphabets & space
					var keycode = e.which || e.keyCode;				
					console.log(keycode);
					if (keycode == 58 || keycode == 60 || keycode == 62 || keycode == 94 || keycode == 96 || keycode == 123 
					||keycode == 125  || keycode == 126 
					|| (keycode >= 40 && keycode <= 42) || (keycode >= 91 && keycode <= 93))
			       return false;

					return true;
				})
	})
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
function createDecimalString() 
{
	var decimalString = '.' + repeatString(strAmountMinFraction ,"0") ;
	decimalString = decimalString.concat('1');
	return decimalString;
}
function repeatString(intLength, strField) {
	  var repeat = [];
	  repeat.length = intLength;
	  return repeat.join(strField);
}
