	var arrRule , arrAuthRule, intGrpCount, strDummyRule;
	var intParent, arrRule , arrAuthRule, intGrpCount;
	var Exp = /\^/;
	var txtRule;
	intParent = 0;
	arrRule = new Array();
	arrAuthRule = new Array();
	intGrpCount = 0 ;
	var gblnInGroup = false;
	var gintGrElementCnt = 0;
function Start_Group()
{
	if (gblnInGroup == false)
	{
		gblnInGroup = true;
		ConstructRule( "G" , 1 , "Group"  );
	}
	else
	{
		if (gintGrElementCnt<2)
			alert(getLabel('signatorymatrixmsg', 'Group must contain two or more elements.!'));		
		else
			alert(getLabel('signatorymatrixmsg1', 'The earlier group is not closed.'));		
	}
}
function End_Group()
{
	if (gintGrElementCnt >=2)
	{
		gblnInGroup = false;
		gintGrElementCnt = 0;
	}
	else
	{
		if (gblnInGroup)
			alert(''+getLabel('signatorymatrixmsg', 'Group must contain two or more elements.'));	
		else
			alert(''+getLabel('signatorymatrixmsg2', 'A Group has not been started.'));	
	}
}
function Add_Element( pType, pElement )
{
	var intLevel;
	var blnIsDuplicate = false;
	var selIndex = pElement.selectedIndex;
	var pElementval=pElement.options[selIndex].text;
	if (gblnInGroup)
	{
		intLevel = 2;
		blnIsDuplicate = ConstructRule( pType , intLevel , pElementval  );
		if(!blnIsDuplicate && gblnInGroup)
			gintGrElementCnt++;
	}
	else
	{
		intLevel = 1;
		ConstructRule( pType , intLevel , pElementval  );
	}
}

function getAccountUser(mode)
{
	var frm = document.forms["frmMain"]; 
	var axmPrdoracc = document.getElementById("axmPrdoracc").value;
	document.getElementById("txtRule").value="";
	document.getElementById("axmRule").value="";
	if (axmPrdoracc != "SELECT")
	{
		if(document.getElementById("axmType").value == 1)
		{
			if(mode == "ADD_SIG" || mode == "ACCTYPE_SIG")
				frm.action = "signatoryAccType.form";
			else if(mode == "EDIT_SIG" || mode == "EDIT_SIGACC")
				frm.action = "updateSignatoryAccMatrix.form";
		}
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}	
}

function ConstructRule( strType , intLevel , strEleValue  )
{
	var flag, intJ, strTemp, tempLevel, tempType, tempParent, strErr,strRule;
	strErr = "";
	len = arrRule.length;
	if ( len > 0 )
	{
		strTemp = arrRule[len-1];
		intJ = 0;
		var pos;

		while ( pos != -1 )
		{
			if ( intJ == 0 )
				pos = strTemp.indexOf("^");
			else
				pos = strTemp.indexOf("^",pos+1);

			if ( intJ == 0 )
				tempType =  strTemp.substr( pos+1,1 );
			if ( intJ == 1 )
				tempLevel = strTemp.substr( pos+1,1);
			if ( intJ == 2)
				tempParent = strTemp.substr( pos+1,1 );
			intJ++;
		}
	}
	if ( strType != "G" )
	{
		if ( intLevel == 1 )
			strTemp = eval ( "'" + strEleValue + "^" + strType + "^" + intLevel + "^0,'" ) ;
		else
			strTemp = eval ( "'" + strEleValue + "^" + strType + "^" + intLevel + "^" +intParent +",'" ) ;
	}

	if ( strEleValue == "None")
		alert('Select a category or user.');
	else
	{	if ( strErr == "" )
		{
			if ( strType == "G" )
			{
				if ( len == 0 )
				{
					arrRule[len] = strEleValue + "^" + strType + "^" + intLevel + "^0," ;
					intParent = arrRule.length - 1;
				}
				else
				{
					if ( tempType == strType )
						strErr = "\n Not a group element. " ;
					else
					{
						arrRule[len] = strEleValue + "^" + strType + "^" + intLevel +"^0," ;
						intParent = arrRule.length - 1;
					}
				}
			}
			else
			{
				if ( len == 0 )
				{
					if ( intLevel == 2 )
						strErr = "\n Not a group element. ";
					else
					{
						arrRule[len] = strEleValue + "^" + strType + "^" + intLevel + "^0," ;
						intParent = arrRule.length - 1;
					}
				}
				else
				{
					if ( intLevel == 1 )
					{
						if ( tempType == "G" )
							strErr = "\n Invalid group element.";
						else
						{
							arrRule[len] = strEleValue + "^" + strType + "^" + intLevel + "^0," ;
							intParent = arrRule.length - 1;
						}
					}
					else
					{
						if ( tempType == "G" )
							arrRule[len] = strEleValue + "^" + strType + "^" + intLevel + "^" + intParent + "," ;
						else
						{
							if ( tempLevel == "1" )
								strErr = "\n Invalid entry. " ;
							else
								arrRule[len] = strEleValue + "^" + strType + "^" + intLevel + "^" + intParent + ",";
						}

					}
				}
			}
		}

		if ( strErr != "")
		{
			alert(strErr);
			return true;
		}
		else
		{
			var strRuleDescNew = ShowRuleDesc(arrRule);	
			if(strRuleDescNew.length >= maxCharsLength)
			{
				arrRule.pop();
				if (gblnInGroup && gintGrElementCnt<2)
				{
					if(strType != "G")
						arrRule.pop();
					
					if(gintGrElementCnt === 1)
						arrRule.pop();					
					
					gblnInGroup = false;
					gintGrElementCnt = 0;
					alert(ruleLenExceedRemove);
				}
				else
					alert(ruleLenExceed);
				
				strRuleDescNew = ShowRuleDesc(arrRule);
			}
	
			strRule = arrRule.toString()
			for ( i=0 ; i < arrRule.length ; i++ )
			{
				strRule = strRule.replace( /,,/i , "," );
			}
			strRule = strRule.substr( 0,strRule.length-1);
			strRule = strRule.replace( /"/g, "" );
			strRule = strRule.replace( /,$/, "" );
			document.getElementById("axmRule").value = strRule.replace( /^\[/, "" );
			//ShowRule ( arrRule ) ;
			document.getElementById("txtRule").value =strRuleDescNew;
			return false;
		}
	}
}
function ShowRuleDesc( arrRule )
{
	var strRule, strTemp, strTempVal, strValSearch, strElement, strType;
	var intLen, intI, intJ, intPos, intLevel;
	var strOpen,strClose,strAnd,strInsideGroup;

	strOpen = " OR ( " ;
	strClose = " ) OR " ;
	strAnd = " AND " ;
	strInsideGroup = "";
	strRule = "";
	intLen = arrRule.length;
	
	for ( intI=0; intI <= intLen - 1; intI++ )
	{
		strTemp = arrRule[intI];
		intJ = 0;

		strValSearch = strTemp;
		intPos = strValSearch.search(Exp);

		while ( intPos > 0  )
		{
			strTempVal = strValSearch.substr(0, intPos );
			if (intPos + 1 < strValSearch.length)
				strValSearch = strValSearch.substr( intPos + 1 );
			else
				strValSearch="";

			switch (intJ)
			{
				case 0:
					strElement = strTempVal;
					intJ++;
					break;
				case 1:
					strType = strTempVal;
					intJ++;
					break;
				case 2:
					intLevel = parseInt(strTempVal,10);
					intJ++;
					break;
			}
			if (strValSearch.length > 0)
				intPos = strValSearch.search(Exp);
			else
				intPos = -1;
		}

		if ( strType == "G" )
		{
			intGrpCount = 0 ;
			if (strRule.length > 0 )
			{
				if ( strInsideGroup == "Y" )
					strRule = strRule +  " ) " + strOpen ;
				else
					strRule = strRule + strOpen;
			}
			else
				strRule = " ( " ;

			strInsideGroup = "Y";
			continue;
		}
		else
		{
			if ( intLevel == 1 )
			{
				if (strInsideGroup == "Y" )
				{
					strRule = strRule + strClose + strElement;
					strInsideGroup = "N";
					intGrpCount = 0 ;
				}
				else
				{
					if ( strRule.length > 0 )
						strRule = strRule + " OR " + strElement;
					else
						strRule = strElement;
				}

				continue;
			}
			else
			{
				if (intLevel == 2 )
				{
					if ( strInsideGroup == "Y")
					{
						intGrpCount++ ;
						if ( strRule.substr(strRule.length - 2,1) == "(" )
							strRule = strRule + strElement;
						else
							strRule = strRule + strAnd + strElement ;
						continue;
					}
				}
			}
		}
	}
	if ( strInsideGroup == "Y" )
	{	strRule = strRule + " ) ";
		strInsideGroup == "N";
	}
	if(strRule == "")
		strRule = arrRule;
	return strRule;
}

function ShowRule( arrRule )
{
	var strRule, strTemp, strTempVal, strValSearch, strElement, strType;
	var intLen, intI, intJ, intPos, intLevel;
	var strOpen,strClose,strAnd,strInsideGroup;

	strOpen = " OR ( " ;
	strClose = " ) OR " ;
	strAnd = " AND " ;
	strInsideGroup = "";
	strRule = "";
	intLen = arrRule.length;
	
	for ( intI=0; intI <= intLen - 1; intI++ )
	{
		strTemp = arrRule[intI];
		intJ = 0;

		strValSearch = strTemp;
		intPos = strValSearch.search(Exp);

		while ( intPos > 0  )
		{
			strTempVal = strValSearch.substr(0, intPos );
			if (intPos + 1 < strValSearch.length)
				strValSearch = strValSearch.substr( intPos + 1 );
			else
				strValSearch="";

			switch (intJ)
			{
				case 0:
					strElement = strTempVal;
					intJ++;
					break;
				case 1:
					strType = strTempVal;
					intJ++;
					break;
				case 2:
					intLevel = parseInt(strTempVal,10);
					intJ++;
					break;
			}
			if (strValSearch.length > 0)
				intPos = strValSearch.search(Exp);
			else
				intPos = -1;
		}

		if ( strType == "G" )
		{
			intGrpCount = 0 ;
			if (strRule.length > 0 )
			{
				if ( strInsideGroup == "Y" )
					strRule = strRule +  " ) " + strOpen ;
				else
					strRule = strRule + strOpen;
			}
			else
				strRule = " ( " ;

			strInsideGroup = "Y";
			continue;
		}
		else
		{
			if ( intLevel == 1 )
			{
				if (strInsideGroup == "Y" )
				{
					strRule = strRule + strClose + strElement;
					strInsideGroup = "N";
					intGrpCount = 0 ;
				}
				else
				{
					if ( strRule.length > 0 )
						strRule = strRule + " OR " + strElement;
					else
						strRule = strElement;
				}

				continue;
			}
			else
			{
				if (intLevel == 2 )
				{
					if ( strInsideGroup == "Y")
					{
						intGrpCount++ ;
						if ( strRule.substr(strRule.length - 2,1) == "(" )
							strRule = strRule + strElement;
						else
							strRule = strRule + strAnd + strElement ;
						continue;
					}
				}
			}
		}
	}
	if ( strInsideGroup == "Y" )
	{	strRule = strRule + " ) ";
		strInsideGroup == "N";
	}
	if(strRule == "")
		strRule = arrRule;
	
	document.getElementById("txtRule").value =strRule;
}

function ShowRuleForGrid( arrRule )
{
	var strRule, strTemp, strTempVal, strValSearch, strElement, strType;
	var intLen, intI, intJ, intPos, intLevel;
	var strOpen,strClose,strAnd,strInsideGroup;

	strOpen = " OR ( " ;
	strClose = " ) OR " ;
	strAnd = " AND " ;
	strInsideGroup = "";
	strRule = "";
	intLen = arrRule.length;
	
	for ( intI=0; intI <= intLen - 1; intI++ )
	{
		strTemp = arrRule[intI];
		intJ = 0;

		strValSearch = strTemp;
		intPos = strValSearch.search(Exp);

		while ( intPos > 0  )
		{
			strTempVal = strValSearch.substr(0, intPos );
			if (intPos + 1 < strValSearch.length)
				strValSearch = strValSearch.substr( intPos + 1 );
			else
				strValSearch="";

			switch (intJ)
			{
				case 0:
					strElement = strTempVal;
					intJ++;
					break;
				case 1:
					strType = strTempVal;
					intJ++;
					break;
				case 2:
					intLevel = parseInt(strTempVal,10);
					intJ++;
					break;
			}
			if (strValSearch.length > 0)
				intPos = strValSearch.search(Exp);
			else
				intPos = -1;
		}

		if ( strType == "G" )
		{
			intGrpCount = 0 ;
			if (strRule.length > 0 )
			{
				if ( strInsideGroup == "Y" )
					strRule = strRule +  " ) " + strOpen ;
				else
					strRule = strRule + strOpen;
			}
			else
				strRule = " ( " ;

			strInsideGroup = "Y";
			continue;
		}
		else
		{
			if ( intLevel == 1 )
			{
				if (strInsideGroup == "Y" )
				{
					strRule = strRule + strClose + strElement;
					strInsideGroup = "N";
					intGrpCount = 0 ;
				}
				else
				{
					if ( strRule.length > 0 )
						strRule = strRule + " OR " + strElement;
					else
						strRule = strElement;
				}

				continue;
			}
			else
			{
				if (intLevel == 2 )
				{
					if ( strInsideGroup == "Y")
					{
						intGrpCount++ ;
						if ( strRule.substr(strRule.length - 2,1) == "(" )
							strRule = strRule + strElement;
						else
							strRule = strRule + strAnd + strElement ;
						continue;
					}
				}
			}
		}
	}
	if ( strInsideGroup == "Y" )
	{	strRule = strRule + " ) ";
		strInsideGroup == "N";
	}
	if(strRule == "")
		strRule = arrRule;
	return strRule;
}
function resetRule()
{
	intParent=0;
	arrRule = "";
	arrAuthRule = "";
	arrRule = new Array();
	arrAuthRule = new Array();
	intGrpCount=0;
	document.getElementById("txtRule").value="";
	gblnInGroup = false;
	gintGrElementCnt = 0;
}

function ShowExistingRule( arrRule )
{
	var strRule, strTemp, strTempVal, strValSearch, strElement, strType;
	var intLen, intI, intJ, intPos, intLevel;
	var strOpen,strClose,strAnd,strInsideGroup;

	strOpen = " OR ( " ;
	strClose = " ) OR " ;
	strAnd = " AND " ;
	strInsideGroup = "";
	strRule = "";
	intLen = arrRule.length;
	
	for ( intI=0; intI <= intLen - 1; intI++ )
	{
		strTemp = arrRule[intI];
		intJ = 0;

		strValSearch = strTemp;
		intPos = strValSearch.search(Exp);

		while ( intPos > 0  )
		{
			strTempVal = strValSearch.substr(0, intPos );
			if (intPos + 1 < strValSearch.length)
				strValSearch = strValSearch.substr( intPos + 1 );
			else
				strValSearch="";

			switch (intJ)
			{
				case 0:
					strElement = strTempVal;
					intJ++;
					break;
				case 1:
					strType = strTempVal;
					intJ++;
					break;
				case 2:
					intLevel = parseInt(strTempVal,10);
					intJ++;
					break;
			}
			if (strValSearch.length > 0)
				intPos = strValSearch.search(Exp);
			else
				intPos = -1;
		}

		if ( strType == "G" )
		{
			intGrpCount = 0 ;
			if (strRule.length > 0 )
			{
				if ( strInsideGroup == "Y" )
					strRule = strRule +  " ) " + strOpen ;
				else
					strRule = strRule + strOpen;
			}
			else
				strRule = " ( " ;

			strInsideGroup = "Y";
			continue;
		}
		else
		{
			if ( intLevel == 1 )
			{
				if (strInsideGroup == "Y" )
				{
					strRule = strRule + strClose + strElement;
					strInsideGroup = "N";
					intGrpCount = 0 ;
				}
				else
				{
					if ( strRule.length > 0 )
						strRule = strRule + " OR " + strElement;
					else
						strRule = strElement;
				}

				continue;
			}
			else
			{
				if (intLevel == 2 )
				{
					if ( strInsideGroup == "Y")
					{
						intGrpCount++ ;
						if ( strRule.substr(strRule.length - 2,1) == "(" )
							strRule = strRule + strElement;
						else
							strRule = strRule + strAnd + strElement ;
						continue;
					}
				}
			}
		}
	}
	if ( strInsideGroup == "Y" )
	{	strRule = strRule + " ) ";
		strInsideGroup == "N";
	}
	if(strRule == "")
		strRule = arrRule;
	
	document.getElementById("oldAxmRule").value =strRule;
}
