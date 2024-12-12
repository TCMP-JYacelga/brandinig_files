

function createCurrencyAutoCompletor()
{
	// alert('Inside ... createCurrencyAutoCompletor');
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		fieldCls : 'xn-form-text w16 xn-suggestion-box',
		itemId : 'baseRateCurrencyItemId',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		cfgUrl : 'services/userseek/baseRatesMstCcySeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'baseRatesMstCcySeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'CODE',
		cfgDataNode2 : 'DESCR',
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "baseRateCurrency" ).value = record[ 0 ].data.CODE;
				//document.getElementById( "currencyDesc" ).value = record[ 0 ].data.DESCR;
			}
		}
	} );
	auto1.render( Ext.get( 'currencyDiv' ) );
	auto1.setValue( document.getElementById( "baseRateCurrency" ).value );
}


function renderAutoCompleters()
{

	// if( !Ext.Ajax )
	// {
		// // to get reference of Ext.Ajax until its loaded completely. 
		// setTimeout( function()
		// {
			// renderAutoCompleters();
		// }, 1000 );
	// }
	// else
	// {
		if(pageMode == 'add')
		createCurrencyAutoCompletor();
	// }
}

function setDirtyBit()
{
	 document.getElementById( "dirtyBit" ).value = '1';
}//setDirtyBit
function warnBeforeCancel(strUrl) {
	var dirtyBit = $('#dirtyBit').val();
	if('1' == dirtyBit) {
		$('#confirmMsgPopup').dialog({
				autoOpen : false,
				maxHeight: 550,
				minHeight:'auto',
				width : 400,
				modal : true,
				resizable: false,
				draggable: false
		/*buttons : {
			"Yes" : function() {
				var frm = document.forms["frmMain"];
				frm.action = strUrl;
				frm.target = "";
				frm.method = "POST";
				frm.submit();
			},
			"No" : function() {
				$(this).dialog("close");
			}
		}*/
		});
		$('#confirmMsgPopup').dialog("open");
		$('#cancelConfirmMsg').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneConfirmMsgbutton').bind('click',function(){
				var frm = document.forms["frmMain"];
				frm.action = strUrl;
				frm.target = "";
				frm.method = "POST";
				frm.submit();
		});
		$('#textContent').focus();
	}
	else {
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}