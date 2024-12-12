function showActions(ctrl, divId) 
{
	if (!ctrl || isEmpty(divId)) return;
	$("#" + divId).show();
	return false;
}

function hideActions(ctrl, divId) 
{
	if (!ctrl || isEmpty(divId)) return;
	$("#" + divId).hide();
	return false;
}

jQuery.fn.ForceIntegerOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e)
						{
							// allows numbers,backspace, tab
							var keycode = e.which || e.keyCode;							
							if ((keycode >= 48 && keycode <= 57)|| keycode == 8 || keycode == 9)
								return true;
							return false;
						})
			})
};

jQuery.fn.ForceNumericOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e)
						{
							// allows numbers, backspace,'.' once ,tab
							var keycode = e.which || e.keyCode;
							var value=$(this).val();
							var i=0;
							for(i=0;i<value.length;i++)
							{
							  if(value.charAt(i)=='.' && keycode == 46)
							  {
							    return false;
							  }
							}
							if ((keycode >= 48 && keycode <= 57)|| keycode == 8 || keycode == 9 || keycode == 46)
								return true;
							return false;
						})
			})
};

jQuery.fn.ForcePlusAndNumbersOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) {
							
							// allows numbers, backspace,'.' once ,tab
							var keycode = e.which || e.keyCode;
							var value=$(this).val();
							
							if(value.length == 0 && keycode == 43)
								return true;
							
							if(value.length == 0 && keycode != 43)
								return false;
							
							if ((keycode >= 48 && keycode <= 57)|| keycode == 8 || keycode == 9)
								return true;

							return false;
						})
			})
};

jQuery.fn.ForceAlphaNumericSpaceOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) 
						{
							// allows alphabets, numbers, space, backspace, tab, delete
							var keycode = e.which || e.keyCode;

							if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122) || keycode == 32
									|| keycode == 8 || keycode == 9 || keycode == 46 ||keycode == 13)
								return true;

							return false;
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

jQuery.fn.dateBox = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) 
						{
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad for TAB
							return (key == 9 || key==8 || key==46);
						})
			})
};
jQuery.fn.BillRefTextBox = function() {
	return this
			.each(function() {
				$(this)
						.keyup(function(e) {
							//Allow Enter key 
							if(e.keyCode==13)
							{
								javascript:simpleFilter('frmMain');
							}
							})
			})
};
jQuery.fn.ForceHundredCharsOnly = function() {
	return this
	.each(function(){
		$(this)
				.keypress(function(e) 
				{
					// allows only 100 characters to be entered
					var value=$(this).val();
					if(value.length >= 100) 
					{
						if(e.keyCode == 8)
						{
						return true;
						}
						else
						{
						return false;
						}
					}
					else
					{
						return true;
					}
				})
	})
};