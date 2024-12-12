var objProfileView = null;
var objDestinationSelectionPopup = null;
Ext.Loader.setConfig(
{
	enabled : true,
	disableCaching : false,
	setPath :
	{
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
} );
Ext.application(
{
	name : 'GCP',
	appFolder : 'static/scripts/messageForms/messageDetail/app',
	requires :
	[
		'GCP.view.MessageFormDtlGridView','GCP.view.DestinationSelectionPopup'
	],
	controllers :
	[
		'GCP.controller.MessageFormDtlGridController'
	],
	launch : function()
	{
		objProfileView = Ext.create( 'GCP.view.MessageFormDtlMainView',
		{
			renderTo : 'messageFormDtlDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objProfileView ) )
	{
		objProfileView.hide();
		objProfileView.show();
	}
}

function showAddDestinationPopup()
{
	objDestinationSelectionPopup = Ext.create('GCP.view.DestinationSelectionPopup', {
		itemId : 'destinationSelectionPopup',
		fnCallback : setDestinationRoleList,
		title : getLabel('createNewDesc', 'Create New Destination'),
		listeners : {
			resize : function(){
				this.center();
			}
		}
	});		
	objDestinationSelectionPopup.show();
}

function setDestinationRoleList(records,strDestName) {
	var selectedDestinationRoles = "";
	for ( var i = 0; i < records.length; i++) {
		var val = records[i];
		if (!Ext.isEmpty(val))
		{
			selectedDestinationRoles = selectedDestinationRoles + val;
			if (i < records.length - 1) {
				selectedDestinationRoles = selectedDestinationRoles + ',';
			}
		}
	}
	var objParam = {};
	objParam['destinationName'] = strDestName;
	objParam['rolesList'] = selectedDestinationRoles;
	$.ajax({
		url : 'services/saveRoleDestinationList.json',
		type : 'POST',
		dataType : 'json',
		data : objParam,
		success : function(response) {
			if(response.errorModel!=null)
			{
				if(response.errorModel[0].defaultMessage!=null)
				{
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel(
										'instrumentErrorPopUpTitle',
										'Error'),
								msg : response.errorModel[0].defaultMessage,
								buttons : Ext.MessageBox.OK,
								cls : 'ux_popup',
								icon : Ext.MessageBox.ERROR
							});
				}
			}
			else
			{
				var destDield = document.getElementById("formDestination");
				var option = document.createElement('option');
				option.text = response.model.destinationName;
				option.value = response.model.destinationId;
				if ($("#formDestination option[value='destination']").length == 0) {
					$("#formDestination option").eq(1)
							.before($("<option></option>").attr("value",
									"destination").addClass('separator')
									.text("--Destinations--"));
				}
				$("#formDestination option").eq(2).before(option);
				//destDield.appendChild(option);								
				$('#formDestination').val(response.model.destinationId);
			}	
		},
		failure : function(response) {
		}
	});	
}
