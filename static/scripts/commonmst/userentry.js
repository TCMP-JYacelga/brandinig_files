function populateRightsSerials(strAction,actionmode)
{
	var frm = document.forms["frmMain"];
	if("SAVE" == strAction || "ADD" == strAction || "ADDCHNGCAT" == strAction || "ADDCHKACROSS" == strAction)
		{
			if ("CategoryMode" == actionmode)
			{
				frm.action = "saveUserProfileCategory.form";
			}
			else if("ClientMode" == actionmode)
			{
				frm.action = "saveUserProfileClient.form";
			}
			else if("AccountMode" == actionmode)
			{
				frm.action = "saveUserProfileAccount.form";
			}
			else
			{
				frm.action = "saveUserProfileProduct.form";
			}
		}
	else if("EDIT" == strAction || "UPDATE" == strAction || "EDITCHNGCAT" == strAction || "EDITCHKACROSS" == strAction)
		{
			if ("CategoryMode" == actionmode)
			{
				frm.action = "updateUserProfileCategory.form";
			}
			else if("ClientMode" == actionmode)
			{
				frm.action = "updateUserProfileClient.form";
			}
			else if("AccountMode" == actionmode)
			{
				frm.action = "updateUserProfileAccount.form";
			}
			else
			{
				frm.action = "updateUserProfileProduct.form";
			}		
		}
		
	document.getElementById("viewRightsSerials").value = JSON.stringify(objJsonData["v"]);
	document.getElementById("editRightsSerials").value = JSON.stringify(objJsonData["e"]);
	document.getElementById("authRightsSerials").value = JSON.stringify(objJsonData["a"]);
	return true;
}

function showBackPage(strAction,strActionUrl)
{
	var strUrl;
	var frm = document.forms["frmMain"];
	frm.target ="";
	if ("AUTHVIEW" == strAction)
		{
		strUrl = "userAuthList.form";		
		}
	else 
		{
		strUrl = strActionUrl;		
		}
	if (frm.usrCode)
	{
		frm.usrCode.value = "";
	}
	if (frm.usrDescription)
	{
		frm.usrDescription.value = "";
	}
	frm.viewState.value = "";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
	return true;
}

function showCategoryMask(strAction,actionmode)
{
	var frm = document.forms["frmMain"]; 
	populateRightsSerials();
	frm.target ="";
	if (strAction == "ADD" || strAction == "ADDCHNGCAT" || strAction == "ADDCHKACROSS" || strAction == "SAVE")
		{
		
		if ("CategoryMode" == actionmode)
		{
			frm.action = "ChangeCategoryAdd_category.form";
		}
		else if("ClientMode" == actionmode)
		{
			frm.action = "ChangeCategoryAdd_client.form";
		}
		else if("AccountMode" == actionmode)
		{
			frm.action = "ChangeCategoryAdd_account.form";
		}
		else
		{
			frm.action = "ChangeCategoryAdd_product.form";
		}
		}
	else
		{
		if ("CategoryMode" == actionmode)
		{
			frm.action = "ChangeCategoryEdit_category.form";
		}
		else if("ClientMode" == actionmode)
		{
			frm.action = "ChangeCategoryEdit_client.form";
		}
		else if("AccountMode" == actionmode)
		{
			frm.action = "ChangeCategoryEdit_account.form";
		}
		else
		{
			frm.action = "ChangeCategoryEdit_product.form";
		}
		
		}
	frm.method = "POST";
	frm.submit();

}

function chkUnchkAcrossUser(strAction,actionmode)
{
	var frm = document.forms["frmMain"]; 
	populateRightsSerials();
	frm.target ="";
	if (strAction == "ADD" || strAction == "ADDCHNGCAT" || strAction == "ADDCHKACROSS" || strAction == "SAVE")
		{
		
		if ("CategoryMode" == actionmode)
		{
			frm.action = "ChkAcrossUserAdd_category.form";
		}
		else if("ClientMode" == actionmode)
		{
			frm.action = "ChkAcrossUserAdd_client.form";
		}
		else if("AccountMode" == actionmode)
		{
			frm.action = "ChkAcrossUserAdd_account.form";
		}
		else
		{
			frm.action = "ChkAcrossUserAdd_product.form";
		}
		
		}
		//frm.action = "ChkAcrossUserAdd.form";
	else
		{
		
		if ("CategoryMode" == actionmode)
		{
			frm.action = "ChkAcrossUserEdit_category.form";
		}
		else if("ClientMode" == actionmode)
		{
			frm.action = "ChkAcrossUserEdit_client.form";
		}
		else if("AccountMode" == actionmode)
		{
			frm.action = "ChkAcrossUserEdit_account.form";
		}
		else
		{
			frm.action = "ChkAcrossUserEdit_product.form";
		}
		
		}
		//frm.action = "ChkAcrossUserEdit.form";
	frm.method = "POST";
	frm.submit();

}

function getRecord(json,elementId)
{		
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
	
    for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if(document.getElementById(inputIdArray[i]))
    	{
    	var type = document.getElementById(inputIdArray[i]).type;
    	if(type=='text'){
    	 document.getElementById(inputIdArray[i]).value = JSON.parse(myJSONObject).columns[0].value;}
    	else {
    	 document.getElementById(inputIdArray[i]).innerHTML = JSON.parse(myJSONObject).columns[0].value;} 
    	}
	}    
}

function userClientFilter(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";	
	populateRightsSerials();	
	frm.method = "POST";
	frm.submit();	
}

function userViewClientFilter(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}