function getElementType(field,fieldValue)
{
	var elementType='';
	var multiTagId='';
	if(fieldValue == 'Y' || fieldValue == 'N')
				{
					elementType = 'checkbox';
					if ($("input[name='"+field+"']:checked").val())
					{
						elementType = 'radio';
					}
					else if(document.getElementById(field) != null && 
						document.getElementById(field).tagName != null && document.getElementById(field).tagName == 'LABEL')
					{
						elementType='checkbox';
					}
					else if(document.getElementById(field) != null && 
						document.getElementById(field).tagName != null && document.getElementById(field).tagName != 'INPUT')
					{
						elementType='';
					}
				}
				else if ($("input[name='"+field+"']:checked").val())
				{
					elementType = 'radio';
				}
				else if(document.getElementById(field) != null)
				{
					if(document.getElementById(field).nextElementSibling != null)
					{
					multiTagId = document.getElementById(field).nextElementSibling.id;
						if(multiTagId != "" && document.getElementById(multiTagId).multiple)
						{
							elementType = 'multiple';
						}
					}
					else if(document.getElementById(field).tagName != null && document.getElementById(field).tagName == 'A')
					{
						elementType = 'anchorTag';
					}
					if(document.getElementById(field).tagName != null && document.getElementById(field).tagName == 'IMG')
					{
						elementType = 'checkbox';
					}
				}

	return elementType;
}

function showNewValueList(field,fieldValue,elementType)
{
	
switch(elementType)
				{
					case 'checkbox':
						$('[for="'+field+'"]').addClass("newFieldGridValue");
					break;
					case 'radio':
						var radioElements = $("input[name='"+field+"']");
						for(var i=0;i<radioElements.length;i++)
						{
							if(radioElements[i].value == fieldValue)
							{
								$('[for="'+radioElements[i].id+'"]').addClass("newFieldValue");
							}
						}
					break;
					case 'multiple':
						var multiTagId = document.getElementById(field).nextElementSibling.id;
						var options =  fieldValue.split(",");
						$('[for="'+field+'"]').addClass("newFieldValue");
						$("#"+multiTagId+" option").each(function(){
						  if(jQuery.inArray($(this).val(), options) != -1){
							  $(this).addClass("newFieldValue");
							  $('input[value="' + $(this).val() +'"]').parent().addClass("newFieldGridValue")
						  }
					  });
					break;
					default:
						$('#'+field).addClass("newFieldGridValue");
					break;
				}
}

function hideNewValueList(field,fieldValue,elementType)
{
switch(elementType)
				{
					case 'checkbox':
						$('[for="'+field+'"]').removeClass("newFieldGridValue");
					break;
					case 'radio':
						var radioElements = $("input[name='"+field+"']");
						for(var i=0;i<radioElements.length;i++)
						{
							if(radioElements[i].value == fieldValue)
							{
								$('[for="'+radioElements[i].id+'"]').removeClass("newFieldValue");
							}
						}
					break;
					case 'multiple':
						var multiTagId = document.getElementById(field).nextElementSibling.id;
						var options =  fieldValue.split(",");
						$('[for="'+field+'"]').removeClass("newFieldValue");
						$("#"+multiTagId+" option").each(function(){
						  if(jQuery.inArray($(this).val(), options) != -1){
							  $(this).removeClass("newFieldValue");
							  $('input[value="' + $(this).val() +'"]').parent().removeClass("newFieldGridValue")
						  }
					  });
					break;
					default:
						$('#'+field).removeClass("newFieldGridValue");
					break;
				}
}
function showModifiedValueList(field,fieldValue,elementType,options)
{
	switch(elementType)
			{
				case 'checkbox':
						$('[for="'+field+'"]').addClass("modifiedFieldValue");
					break;
				case 'radio':
					var radioElements = $("input[name='"+field+"']");
						for(var i=0;i<radioElements.length;i++)
						{
							if(radioElements[i].value == fieldValue)
							{
								$('[for="'+radioElements[i].id+'"]').addClass("newFieldValue");
							}
						}
				break;
				case 'multiple':
					var multiTagId = document.getElementById(field).nextElementSibling.id;
					$("#"+multiTagId+" option").each(function(){
					  if(jQuery.inArray($(this).val(), options) != -1){
						  $(this).addClass("modifiedFieldValue");
						  $('input[value="' + $(this).val() +'"]').parent().addClass("newFieldGridValue")
						}
					 });
				break;
				case 'anchorTag':
					$('#'+field).addClass("modifiedFieldValue");
				break;
			}
}

function hideModifiedValueList(field,fieldValue,elementType,options)
{
	switch(elementType)
			{
				case 'checkbox':
						$('[for="'+field+'"]').removeClass("modifiedFieldValue");
					break;
				case 'radio':
					var radioElements = $("input[name='"+field+"']");
						for(var i=0;i<radioElements.length;i++)
						{
							if(radioElements[i].value == fieldValue)
							{
								$('[for="'+radioElements[i].id+'"]').removeClass("newFieldGridValue");
							}
						}
				break;
				case 'multiple':
					var multiTagId = document.getElementById(field).nextElementSibling.id;
					$("#"+multiTagId+" option").each(function(){
					  if(jQuery.inArray($(this).val(), options) != -1){
						  $(this).removeClass("modifiedFieldValue");
						  $('input[value="' + $(this).val() +'"]').parent().removeClass("newFieldGridValue")
						}
					 });
				break;
				default:
					$('#'+field).removeClass("modifiedFieldValue");
				break;
			}
}
function showOldValueList(field,fieldValue,elementType,options)
{
	switch(elementType)
			{
				case 'checkbox':
						$('[for="'+field+'"]').addClass("deletedFieldValue");
				break;
				case 'radio':
						var radioElements = $("input[name='"+field+"']");
						for(var i=0;i<radioElements.length;i++)
						{
							if(radioElements[i].value == fieldValue)
							{
								$('[for="'+radioElements[i].id+'"]').addClass("deletedFieldValue");
							}
						}
				break;
				case 'multiple':
					var multiTagId = document.getElementById(field).nextElementSibling.id;
					$("#"+multiTagId+" option").each(function(){
					  if(jQuery.inArray($(this).val(), options) != -1){
						  $(this).addClass("deletedFieldValue");
						  $('input[value="' + $(this).val() +'"]').parent().addClass("deletedFieldValue")
					  }
				  });
				break;
			}
}
function hideOldValueList(field,fieldValue,elementType,options)
{
	switch(elementType)
			{
				case 'checkbox':
						$('[for="'+field+'"]').removeClass("deletedFieldValue");
				break;
				case 'radio':
						var radioElements = $("input[name='"+field+"']");
						for(var i=0;i<radioElements.length;i++)
						{
							if(radioElements[i].value == fieldValue)
							{
								$('[for="'+radioElements[i].id+'"]').removeClass("deletedFieldValue");
							}
						}
					break;
				case 'multiple':
					var multiTagId = document.getElementById(field).nextElementSibling.id;
					$("#"+multiTagId+" option").each(function(){
					  if(jQuery.inArray($(this).val(), options) != -1){
						  $(this).removeClass("deletedFieldValue");
						  $('input[value="' + $(this).val() +'"]').parent().removeClass("deletedFieldValue")
					  }
				  });
				break;
			}
}
