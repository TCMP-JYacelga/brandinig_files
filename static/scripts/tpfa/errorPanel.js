function createErrorDiv()
{
	var parentMessageArea = document.getElementById('parentMessageArea');
	var messageArea = document.getElementById('messageArea');
	if( null == messageArea )
	{
		messageArea = document.createElement('div');
		messageArea.id="messageArea";
		messageArea.className = "errors";
		parentMessageArea.appendChild(messageArea);
		messageArea.innerHTML = "<span>Error</span>";
	}
}
function addErrorToDiv(errorMessage)
{
	var updatedErrorMessage = "<ul><li>" + errorMessage + "</li></ul>";
	var messageArea = document.getElementById('messageArea');
	messageArea.innerHTML += updatedErrorMessage;
}//
function closeErrorDiv()
{
	var messageArea = document.getElementById('messageArea');
	//messageArea.innerHTML += "</ul>";
}
function clearAndHideErrorDiv()
{
	var messageArea = document.getElementById('messageArea');
	if( null != messageArea )
	{
		messageArea.innerHTML = "";
		messageArea.style.display = 'none';		
	}
}
function showErrorDiv()
{
	var messageArea = document.getElementById('messageArea');
	if( null != messageArea )
	{
		messageArea.className = "errors";
		messageArea.style.display = 'block';		
	}
}