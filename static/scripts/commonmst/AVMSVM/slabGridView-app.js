var objReadOnlyView = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/commonmst/AVMSVM/app',
			// appFolder : 'app',
			requires : ['GCP.view.SlabGridReadOnlyView','GCP.view.SlabGridSignatoryReadOnlyView'],
			launch : function() {
				if (modelAxmType == '1') {
					objReadOnlyView = Ext.create(
								'GCP.view.SlabGridSignatoryReadOnlyView', {
									renderTo : 'slabGridDiv'

								});
					} else {
						objReadOnlyView = Ext.create('GCP.view.SlabGridReadOnlyView', {
									renderTo : 'slabGridDiv'

								});
					}
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objReadOnlyView)) {
		objReadOnlyView.hide();
		objReadOnlyView.show();
	}
}

function saveAndNextLevel() {
	if (_glbCurrentRowIndex < _gblLevelCount) {
		_glbCurrentRowIndex++;
		//submitApprovers(detailViewStateVal);
		var record = getRecordFromApproverSlabByIndex(_glbCurrentRowIndex);
		setApproverDataFromObject(record);
		manageLinks();
	}
}

function saveAndPrevLevel() {
	if (_glbCurrentRowIndex > 0) {
		_glbCurrentRowIndex--;
		//bmitApprovers(detailViewStateVal);
		var record = getRecordFromApproverSlabByIndex(_glbCurrentRowIndex);
		setApproverDataFromObject(record);
		manageLinks();
	}
}

function getRecordFromApproverSlabByIndex(index) {
	var record = adminListView.getStore().getAt(index - 1);
	return record;
}

function setApproverDataFromObject(record) {
	if( record  &&  record.data )
		{
			var data = record.data;
			$("#axsMinreqDtl").val(data.axsMinreq);
			$("#axsSequence").val(data.axsSequence);
			$("#minReqLabel").text(' ');
			$("#minReqLabel").append(numOfApproversText);
			$("#minReqLabel").append(' ' + data.axsSequence);
		
			approverId = data.viewState;
			_gblAxsUsers = data.axsUser;
			manageUsers();
		}
}


function manageLinks() {
	if (_glbCurrentRowIndex == _gblLevelCount) {
		$("#lnkNextLevel").removeClass("navigationLink");
		$("#lnkNextLevel").removeAttr("onclick");
	} else {
		$("#lnkNextLevel").addClass("navigationLink");
		$("#lnkNextLevel").attr("onclick", "javascript:saveAndNextLevel();");
	}
	if (_glbCurrentRowIndex == 1) {
		$("#lnkPrevLevel").removeClass("navigationLink");
		$("#lnkPrevLevel").removeAttr("onclick");
	} else {
		$("#lnkPrevLevel").addClass("navigationLink");
		$("#lnkPrevLevel").attr("onclick", "javascript:saveAndPrevLevel();");
	}
}


function manageUsers() {

	if (undefined != _gblAxsUsers && _gblAxsUsers != ' ' && _gblAxsUsers != '') {
		document.getElementById('axsUser').options.length = 0;
		var strUser = _gblAxsUsers.split(",");
		for (var i = 0; i < strUser.length; i++) {
			var text = strUser[i];
			if (strUser[i] != null) {
				var value = text.substr(0, text.indexOf('/'));
				var newoption = new Option(text, value, false, false);
				document.getElementById('axsUser').options[i] = newoption;
			}
		}
	} else {
		$("#axsUser").empty();
	}
	// set the selected user list
	var strUrl = "services/authMatrixDetail/getUserList.json?viewState="
			+ matrixId + "&axmFrom="
			+ getNonFormattedAmount($("#axmFromAuth").val()) + "&axmTo="
			+ getNonFormattedAmount($("#axmToAuth").val());
	$.ajax({
				url : strUrl,
				contentType : "application/json",
				type : 'POST',
				data : {},
				success : function(data) {
					$("#addUser").empty();
					var select = document.getElementById("addUser");

					var x;
					// select.length = 1;
					if (null != data && data.length != 0) {
						for (x in data) {
							var option = document.createElement("option");
							option.text = x;
							option.value = data[x];
							select.add(option);
						}
					}
					removeSelectedUsers();
				}
			});

}



