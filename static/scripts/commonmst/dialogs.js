/**
 * A helper function to display an alert popup using jquery. This function
 * assumes that the jquery.js and jquery.simplemodal-1.2.3.js are included in
 * the calling html.
 * @param strMesg - The message to be displayed in alert window
 *
 * <pre id="example">
 * <a href="javascript:showAlert('Ubable to set value of field txtGLCode');">Alert</a>
 * </pre>
 *
 * This function assumes that the following markup be present in the html
 * <pre>
 *   <div id='confirm' style="display:none;">
 *       <a href='#' title='Close' class='modalCloseX simplemodal-close'>x</a>
 *       <div class='header'>
 *           <span>Warning</span>
 *       </div>
 *       <p class='message'></p>
 *       <div class='buttons'>
 *           <div class='btnOk'>Ok</div>
 *       </div>
 *   </div>
 * </pre>
 *
 * You will also have to include following scripts in your html
 * <pre>
 * <link rel="stylesheet" type="text/css" href="css/confirmdg.css" media="screen"></link>
 * <script src="js/jquery-1.3.2.min.js" type="text/javascript"></script>
 * <script src="js/jquery.simplemodal-1.2.3.pack.js" type="text/javascript"></script>
 * <script src="js/dialogs.js" type="text/javascript"></script>
 * </pre>
 */
function showAlert(strMesg, strTitle, strData, funcPointer)
{
    $('#confirm').modal({
		close:false,
		position: ["20%"],
		overlayId:'confirmModalOverlay',
		containerId:'confirmModalContainer',
		onShow: function (dialog) {
			if (strTitle)
				dialog.data.find('dialogTitle').append(strTitle);
			dialog.data.find('.message').append(strMesg);

            dialog.data.find('.btnCancel').click(function() {
                $.modal.close();
            });

			// if the user clicks "yes"
			dialog.data.find('.btnOk').click(function() {
				// close the dialog
				$.modal.close();
				funcPointer(strData);
			});
		}
	});
}

function showError(strMesg, strTitle)
{
	if(strMesg !='')
	{
    	$('#confirm').modal({
			close:false,
			position: ["20%"],
			overlayId:'confirmModalOverlay',
			containerId:'confirmModalContainer',
			onShow: function (dialog) {
				if (strTitle)
					dialog.data.find('dialogTitle').append(strTitle);
				dialog.data.find('.message').append(strMesg);

            	dialog.data.find('.btnCancel').click(function() {
                	$.modal.close();
            	});

				// if the user clicks "yes"
				dialog.data.find('.btnOk').click(function() {
					// close the dialog
					$.modal.close();
				});
		}});
	}
}
function showErrMsg(strMesg, strTitle)
{
	if(strMesg !='')
	{
    $('#confirmMsg').modal({
		close:false,
		position: ["20%"],
		overlayId:'confirmModalOverlay',
		containerId:'confirmModalContainer',
		onShow: function (dialog) {
			if (strTitle)
				dialog.data.find('dialogTitle').append(strTitle);
			dialog.data.find('.message').append(strMesg);

            dialog.data.find('.btnCancel').click(function() {
                $.modal.close();
            });

			// if the user clicks "yes"
			dialog.data.find('.btnOk').click(function() {
				// close the dialog
				$.modal.close();
				
			});
		}
	});
	}
}
/**
 * A helper function to display an alert popup using jquery. This function
 * assumes that the jquery.js and jquery.simplemodal-1.2.3.js are included in
 * the calling html. After closing it calls the getpromptValue function passing
 * it the value entered by the user. The users of the prompt are required to
 * implement this function.
 *
 * @param strMesg - The message to be displayed in alert window
 *
 * <pre id="example">
 * <a href="javascript:showPrompt('Please Enter Reject Remark');">Prompt</a>
 *
 * </pre>
 * This function requires that the following markup be present in the html.
 * <pre>
 *   <div id='prompt' style="display:none;">
 *       <a href='#' title='Close' class='modalCloseX simplemodal-close'>x</a>
 *       <div class='header'>
 *           <span>Input</span>
 *       </div>
 *       <span class='msgContainer'>
 *           <span class='message'></span>
 *           &nbsp;<textarea id="txtInput" name="txtInput" cols="48" rows="7"
 *                   onkeypress="javascript:limitText(this, 255);"></textarea>
 *       </span>
 *       <div class='buttons'>
 *           <div class='btnOk'>Ok</div>
 *           <div class='btnCancel'>Cancel</div>
 *       </div>
 *   </div>
 * <pre>
 *
 * You will also have to include following scripts in your html
 * <pre>
 * <link rel="stylesheet" type="text/css" href="css/confirmdg.css" media="screen"></link>
 * <script src="js/jquery-1.3.2.min.js" type="text/javascript"></script>
 * <script src="js/jquery.simplemodal-1.2.3.pack.js" type="text/javascript"></script>
 * <script src="js/dialogs.js" type="text/javascript"></script>
 * </pre>
 */
function showPrompt(strMesg, strData, funcPointer)
{
    var retVal = "";
    $('#prompt').modal({
		close:false,
		position: ["20%"],
		overlayId:'confirmModalOverlay',
		containerId:'confirmModalContainer',
		onShow: function (dialog) {
			dialog.data.find('.message').append(strMesg);
            dialog.data.find('.btnCancel').click(function() {
                $.modal.close();
            });
			// if the user clicks "yes"
			dialog.data.find('.btnOk').click(function() {
				// close the dialog
				//document.getElementById('txtInput').value;
				//retVal = jQuery().find('#txtInput').attr("value");
				retVal = document.getElementById('txtInput').value;
				//alert ('eval '+  document.getElementById('txtInput').value);
				$.modal.close();
                funcPointer(strData, retVal);
			});
		}
	});
}

/**
 * A generic function to limit contet of the input element to specified length.
 * @author Prasad P. Khandekar
 * @version 1.0
 * @date May 28, 2009
 */
function limitText(ctrl, intMax)
{
    var val = ctrl.value;
    if (val && val.length >= intMax)
        ctrl.value = val.substring(0, intMax);
	else
		return true;
	return false;
}
