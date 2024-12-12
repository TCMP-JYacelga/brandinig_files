function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function filter(url,frmId) {
	
	$('#filterHitDetails').val('Y');
	
	var showEqui=document.getElementById("showEquiBalances");
	
	if(showEqui.checked==true)
		{
		$('#showEquiBalances').val('Y');
		}
		else
		{
		$('#showEquiBalances').val('N');
		}
	goToPage(url,frmId);
}

function btrDownload(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}


function toggleSaveButton()
{
var frm = document.forms["frmMain"];
var arrTmp = {};
var objJson = {};
var newJsonString;	

if(isEmpty(frm.favorites.value))
{
for(var key in arrFavorites)
{
objJson['account'] = key;
objJson['remove'] = !arrFavorites[key];
arrTmp[key] = objJson;
newJsonString= JSON.stringify(arrTmp);
frm.favorites.value = newJsonString;
}

}

}


function toggleFavorite(ctrl, strAc, intPage, intIdx)
{

	var frm, strTmp, arrTmp;
	var blnPresent = false;

	if (arrFavorites[strAc])
		blnPresent = true;
 
	frm = document.forms["frmMain"];
	strTmp = frm.favorites.value;
	
	if (isEmpty(strTmp))
		arrTmp = {};
	else
		arrTmp = JSON.parse(strTmp);
		
	var strKey = intPage + "_" + intIdx;
	

	if (arrTmp[strKey])
	{
		// We need to either remove the clicked account if it is not already a favorite account or mark it as to be removed
		// if it is already a favorite
		
		//delete arrTmp[strKey];
		
		var objJson = arrTmp[strKey]
		
		var flg =objJson['remove'];
		if (flg){
			objJson['remove'] = false;			
			}
		else {
			objJson['remove'] = true;			
			}
				
		if (!blnPresent)
		{
			$(ctrl).toggleClass('icon-misc-selfavorite icon-misc-nonfavorite');
		}
		else
		{
			$(ctrl).toggleClass('icon-misc-favorite icon-misc-nonfavorite');
		}
	}
	else
	{
		// Clicked account is to be marked as either favorite or non-favorite
		var objJson = {};
		objJson['account'] = strAc;
		if (blnPresent){
			objJson['remove'] = true;
		
			}
		else {
			objJson['remove'] = false;	
			
			}
		arrTmp[strKey] = objJson;
 
		if (blnPresent)
		{
			$(ctrl).toggleClass('icon-misc-favorite icon-misc-nonfavorite');
		}	
		else
		{
			$(ctrl).toggleClass('icon-misc-selfavorite icon-misc-nonfavorite');
		}
	}
	
	
	frm.favorites.value = JSON.stringify(arrTmp);
	
	for(key in arrTmp){
		var objJson = arrTmp[key];
		if(null != objJson){
			var flg =objJson['remove'];
			if(arrFavorites[objJson['account']]){
				if(flg){
					document.getElementById("btnSave").className ="imagelink black inline button-icon icon-button-submit font_bold";
					break;
				} else {
					document.getElementById("btnSave").className ="imagelink grey inline_block button-icon icon-button-save font_bold";
				}	
			} else {
				if(!flg){
					document.getElementById("btnSave").className ="imagelink black inline button-icon icon-button-submit font_bold";
					break;
				} else {
					document.getElementById("btnSave").className ="imagelink grey inline_block button-icon icon-button-save font_bold";					
				}
			}
		}
	}	
	return false;
}

function savePreferences(strUrl, frmId)
{
	var btnSave = document.getElementById("btnSave");
	if (btnSave.className.startsWith("imagelink grey"))
		return;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showDateRangeSummary(ctrl) 
{
	if ("R" == ctrl.options[ctrl.selectedIndex].value)
	{
		$("#divDateRange").toggleClass("ui-helper-hidden", false);
		$("#dateRangeAlternate").addClass("ui-helper-hidden");
	}
	else 
	{
		$("#divDateRange").toggleClass("ui-helper-hidden", true);
		$("#dateRangeAlternate").removeClass("ui-helper-hidden");
	}
}