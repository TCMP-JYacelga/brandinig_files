function printFrontImage(frontUrl,backUrl)
{
	if(frontUrl.indexOf(".srvc") !== -1 || backUrl.indexOf(".srvc") !== -1)
	{
		$.ajax({
			type : 'POST',
			url : frontUrl,
			dataType : 'html',
			success : function( imageData )
			{
				$.unblockUI();
				$.ajax({
					type : 'POST',
					url : backUrl,
					dataType : 'html',
					success : function( data )
					{
						printBackImage(imageData,data);
					},
					error : function( request, status, error )
					{
						$.unblockUI();
					}
				} );
			},
			error : function( request, status, error )
			{
				$.unblockUI();
			}
		} );
	}
	else
	{
		printBackImage(frontUrl,backUrl);
	}
}

function printBackImage(frontImage,backImage)
{
	var popup=window.open('', 'my div', 'height=600,width=800');
	popup.document.write('<html><body style="display:block;"><div>');
	popup.document.write('<img style="padding: 0;display: block;margin: 0 auto;max-height: 100%;max-width: 100%;" src="data:image/jpeg;base64,' + frontImage + '" />');
	popup.document.write('<br><br>');
	popup.document.write('<img style="padding: 0;display: block;margin: 0 auto;max-height: 100%;max-width: 100%;" src="data:image/jpeg;base64,' + backImage + '" />');
	popup.document.write('</div></body></html>');

	 $(popup).ready(function() {
		 setTimeout(
		    function(){
		    	popup.document.close();
		    	popup.focus();
		    	popup.print();
		    	popup.close();
		    },(1000));
		});
}