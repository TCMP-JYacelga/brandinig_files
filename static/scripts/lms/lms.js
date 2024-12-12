function unDefined(val)
{
	//return typeof(val) === undefined;
	//return (val != null && val !== null);
	return (typeof val == "undefined");
	
}
function DateAdd(txtDate, days, usFormat)
 {
        var newDateStr;
        var dateParts = txtDate.split(/[^0-9]+/);

        var year = Number(dateParts[2]);
        if (year < 50)  // so 0-49 becomes 2000-2049, 50-99 become 1950-1999 
            year += 2000;
        else if (year < 100)
            year += 1900;
        var unixDate;
        if (usFormat)
            unixDate = new Date(year.toString(), dateParts[0]-1, dateParts[1]);
        else
            unixDate = new Date(year.toString(), dateParts[1]-1, dateParts[0]);
        unixDate = new Date(unixDate.getTime() + days * 24 * 60 * 60 * 1000);

        var newDay = unixDate.getDate().toString();
        var newMonth = (unixDate.getMonth()+1).toString();
        var newYear = unixDate.getFullYear().toString();
        newDateStr = (newMonth + "/" + newDay + "/" + newYear);
		return new Date(newDateStr);
 }


function disableSweepBackFields(state)
{
	var args=disableSweepBackFields.arguments;
	var ele;
	if(args.length >=1)
	{
		for(var i=1;i<args.length;i++)
		{
			
			ele = args[i];
			var eleObj =document.getElementById(ele);
			if(eleObj)
			{
				if(!state)
				{
					eleObj.disabled=true;
				}
				else
					eleObj.disabled=false;
			}
		}
	}
	return false;
}

function showList(url,title,id,type)
{
	var pid ="product";
	var args = showList.arguments;
	try
	{
		if(args.length > 0)
		{
			pid = args[0];
		}
	}
	catch(e){}

	url = url + "?id="+id+'&type='+type;
		
	window.open(url,title,'width=312,height=350,resizable=0,scrollbars=1');
	return false;
}

function disableSelectMst(obj)
{
 	if (obj == null || unDefined(obj))
 		return;
 	var element ;
 	try
 	{
 		element = obj.options[obj.selectedIndex].value;
 	}
 	catch(e)
 	{
 	}
 	if (element == null || unDefined(element))
 		return;
 	
	if(obj.id == 'moveCond')
	{
	 	if(element == 'R')
	 	{
	 		document.getElementById('minBalance').value=minBal;
			document.getElementById('maxBalance').value=maxBal;
	 		document.getElementById('maxBalance').disabled = false;
	 		document.getElementById('maxBalance').readOnly = false;
	 	
	 		
			document.getElementById('maxBalance').className = 'cwRInputBox';
	 		document.getElementById('minBalance').className = 'cwRInputBox';
	 
	 		document.getElementById('minBalance').disabled = false;
	 		document.getElementById('minBalance').readOnly = false;
	 		
	 	}
	 	else if(element == 'M' || element == 'R')
	 	{
	 		document.getElementById('minBalance').value=minBal;
			document.getElementById('maxBalance').value='';
			document.getElementById('minBalance').disabled = false;
	 		document.getElementById('minBalance').readOnly = false;
	 	
	 		document.getElementById('minBalance').className = 'cwRInputBox';
	 		document.getElementById('maxBalance').className = 'cwInputBoxDisabled';
	 	
			document.getElementById('maxBalance').disabled = true;
			document.getElementById('maxBalance').readOnly = true;
	
	
		}
	 	else
	 	{
	 		document.getElementById('minBalance').value='';
			document.getElementById('maxBalance').value='';
		
			document.getElementById('maxBalance').disabled = true;
			document.getElementById('maxBalance').readOnly = true;
	
			document.getElementById('minBalance').disabled = true;
			document.getElementById('minBalance').readOnly = true;
			document.getElementById('maxBalance').className = 'cwInputBoxDisabled';
	 		document.getElementById('minBalance').className = 'cwInputBoxDisabled';
	 	}
	
	}
	
	return true;
}

function disableText(obj)
{
	if (obj == 'false')
	{
			document.getElementById('thrAmntFCYContract').disabled = false;
			document.getElementById('thrAmntFCYContract').readOnly = false;
			document.getElementById('thrAmntFCYContract').className = 'cwRInputBox';
	 	
	}
	else if (obj == 'true')
	{
			document.getElementById('thrAmntFCYContract').value='';
			document.getElementById('thrAmntFCYContract').disabled = true;
			document.getElementById('thrAmntFCYContract').readOnly = true;
			document.getElementById('thrAmntFCYContract').className = 'cwInputBoxDisabled';
	 
	}
	return true;
}

function disableSelect(obj)
{
	if (obj == null || unDefined(obj))
 		return;
 	var element ;
 	try
 	{
 		element = obj.options[obj.selectedIndex].value;
 	}
 	catch(e)
 	{
 	}
 	if (element == null || unDefined(element))
 		return;
 	

 	if(obj.id == 'moveCond')
	{
		var arrAllowFill = document.getElementsByName("allowFillDeficit");
		var allowFill;
		try
		{
			allowFill = arrAllowFill[0];
			allowFill.disabled = false;
		 	allowFill.readOnly = false;
		 	enable(allowFill);
		}
		catch(e)
		{
		}
	 	if(element == 'F')
	 	{
			document.getElementById('maxBalance').value='';
			document.getElementById('minBalance').value='';
		 	document.getElementById('targetAmnt').value='';
	 	
		 	document.getElementById('maxBalance').disabled = true;
			document.getElementById('maxBalance').readOnly = true;
	
			document.getElementById('minBalance').disabled = true;
			document.getElementById('minBalance').readOnly = true;
	
			document.getElementById('targetAmnt').disabled = true;
			document.getElementById('targetAmnt').readOnly = true;
		
			try
			{
			document.getElementById('proportionate').value = '';
			document.getElementById('proportionate').disabled = true;
			document.getElementById('proportionate').readOnly = true;
			document.getElementById('proportionate').className = 'cwInputBoxDisabled';
			}
			catch(e)
			{
			}
			try
	 		{
				document.getElementById('fixedAmnt').value=fixedAmnt;
				document.getElementById('fixedAmnt').disabled = false;
		 		document.getElementById('fixedAmnt').readOnly = false;
			 	
		 		document.getElementById('fixedAmnt').className = 'cwRInputBox';
	 		}
			catch(e)
			{
			}
			
	 		document.getElementById('maxBalance').className = 'cwInputBoxDisabled';
	 		document.getElementById('minBalance').className = 'cwInputBoxDisabled';
			document.getElementById('targetAmnt').className = 'cwInputBoxDisabled';
	 	}
	 	else if(element == 'R')
	 	{
	 		document.getElementById('targetAmnt').value='';
			document.getElementById('maxBalance').value=maxBalance;
			document.getElementById('minBalance').value=minBalance;
			
	
			document.getElementById('maxBalance').disabled = false;
	 		document.getElementById('maxBalance').readOnly = false;
	 
	 		document.getElementById('minBalance').disabled = false;
	 		document.getElementById('minBalance').readOnly = false;
	
	 		try
	 		{
	 			document.getElementById('fixedAmnt').value='';
	 			document.getElementById('fixedAmnt').disabled = true;
				document.getElementById('fixedAmnt').readOnly = true;
				document.getElementById('fixedAmnt').className = 'cwInputBoxDisabled';
				
			}
	 		catch(e)
	 		{
	 		}
			document.getElementById('targetAmnt').disabled = true;
			document.getElementById('targetAmnt').readOnly = true;
	
			try
			{
			document.getElementById('proportionate').value = '';
			document.getElementById('proportionate').disabled = true;
			document.getElementById('proportionate').readOnly = true;
			document.getElementById('proportionate').className = 'cwInputBoxDisabled';
			}
			catch(e)
			{
			}
	 		
			document.getElementById('maxBalance').className = 'cwRInputBox';
	 		document.getElementById('minBalance').className = 'cwRInputBox';
			document.getElementById('targetAmnt').className = 'cwInputBoxDisabled';
	 	}
	 	else if(element == 'M' || element == 'R')
	 	{
			document.getElementById('maxBalance').value='';
			document.getElementById('targetAmnt').value='';
			document.getElementById('minBalance').value=minBalance;
	
			document.getElementById('minBalance').disabled = false;
	 		document.getElementById('minBalance').readOnly = false;
	 		
			document.getElementById('maxBalance').disabled = true;
	 		document.getElementById('maxBalance').readOnly = true;
	 
	 		try
	 		{
	 			document.getElementById('fixedAmnt').value='';
	 			document.getElementById('fixedAmnt').disabled = true;
				document.getElementById('fixedAmnt').readOnly = true;
				document.getElementById('fixedAmnt').className = 'cwInputBoxDisabled';
				
			}
	 		catch(e)
	 		{
	 		}
	
	
			document.getElementById('targetAmnt').disabled = true;
			document.getElementById('targetAmnt').readOnly = true;

			try
			{
			document.getElementById('proportionate').value = '';
			document.getElementById('proportionate').disabled = true;
			document.getElementById('proportionate').readOnly = true;
			document.getElementById('proportionate').className = 'cwInputBoxDisabled';
			}
			catch(e)
			{
			}
			document.getElementById('maxBalance').className = 'cwInputBoxDisabled';
	 		document.getElementById('minBalance').className = 'cwRInputBox';
			document.getElementById('targetAmnt').className = 'cwInputBoxDisabled';
	 	}
	 	else if(element == 'T')
	 	{
	 		try
	 		{
		 		if (allowFill != null && ! unDefined(allowFill))
		 		{
			 	//	allowFill.checked = false;
				 //	enable(allowFill);
				// 	allowFill.disabled = true;
			 	//	allowFill.readOnly = true;
		 		}
	 		}
	 		catch(e)
	 		{
	 		}
	 		document.getElementById('minBalance').value='';
			document.getElementById('maxBalance').value='';
			document.getElementById('targetAmnt').value=targetAmnt;
			
			document.getElementById('targetAmnt').disabled = false;
	 		document.getElementById('targetAmnt').readOnly = false;
	
		
			document.getElementById('maxBalance').disabled = false;
	 		document.getElementById('maxBalance').readOnly = false;
	 
	 		document.getElementById('minBalance').disabled = false;
	 		document.getElementById('minBalance').readOnly = false;
	
	 		try
	 		{
	 			document.getElementById('fixedAmnt').value='';
	 			document.getElementById('fixedAmnt').disabled = true;
				document.getElementById('fixedAmnt').readOnly = true;
				document.getElementById('fixedAmnt').className = 'cwInputBoxDisabled';
				
			}
	 		catch(e)
	 		{
	 		}
	
			try
			{
			document.getElementById('proportionate').value = '';
			document.getElementById('proportionate').disabled = true;
			document.getElementById('proportionate').readOnly = true;
			document.getElementById('proportionate').className = 'cwInputBoxDisabled';
			}
			catch(e)
			{
			}
			document.getElementById('maxBalance').className = 'cwInputBoxDisabled';
	 		document.getElementById('minBalance').className = 'cwInputBoxDisabled';
			document.getElementById('targetAmnt').className = 'cwRInputBox';
	
	 	}
	 	else if(element == 'Z')
	 	{
			document.getElementById('maxBalance').value='';
			document.getElementById('minBalance').value='';
			document.getElementById('targetAmnt').value='';
			
			document.getElementById('maxBalance').disabled = true;
	 		document.getElementById('maxBalance').readOnly = true;
	 
	 		document.getElementById('minBalance').disabled = true;
	 		document.getElementById('minBalance').readOnly = true;
	
	 		try
	 		{
	 			document.getElementById('fixedAmnt').value='';
	 			document.getElementById('fixedAmnt').disabled = true;
				document.getElementById('fixedAmnt').readOnly = true;
				document.getElementById('fixedAmnt').className = 'cwInputBoxDisabled';
				
			}
	 		catch(e)
	 		{
	 		}
	
			document.getElementById('targetAmnt').disabled = true;
			document.getElementById('targetAmnt').readOnly = true;
			document.getElementById('maxBalance').className = 'cwInputBoxDisabled';
	 		document.getElementById('minBalance').className = 'cwInputBoxDisabled';
			document.getElementById('targetAmnt').className = 'cwInputBoxDisabled';
			try
			{
			document.getElementById('proportionate').value = '';
			document.getElementById('proportionate').disabled = true;
			document.getElementById('proportionate').readOnly = true;
			document.getElementById('proportionate').className = 'cwInputBoxDisabled';
			}
			catch(e)
			{
			}
	 	}
	 	else if (element == 'P')
	 	{
			document.getElementById('maxBalance').value='';
			document.getElementById('minBalance').value='';
			document.getElementById('targetAmnt').value='';
			
	 		
			document.getElementById('maxBalance').disabled = true;
	 		document.getElementById('maxBalance').readOnly = true;
	 
	 		document.getElementById('minBalance').disabled = true;
	 		document.getElementById('minBalance').readOnly = true;
	
	 		try
	 		{
	 			document.getElementById('fixedAmnt').value='';
	 			document.getElementById('fixedAmnt').disabled = true;
				document.getElementById('fixedAmnt').readOnly = true;
				document.getElementById('fixedAmnt').className = 'cwInputBoxDisabled';
				
			}
	 		catch(e)
	 		{
	 		}
	
			document.getElementById('targetAmnt').disabled = true;
			document.getElementById('targetAmnt').readOnly = true;
			try
			{			
			document.getElementById('proportionate').value = proportionate;
			document.getElementById('proportionate').disabled = false;
			document.getElementById('proportionate').readOnly = false;
			document.getElementById('proportionate').className = 'cwRInputBox';
			}
			catch(e)
			{
			}
			document.getElementById('maxBalance').className = 'cwInputBoxDisabled';
	 		document.getElementById('minBalance').className = 'cwInputBoxDisabled';
			document.getElementById('targetAmnt').className = 'cwInputBoxDisabled';
	 	
	 	}
	 	else
	 	{
			document.getElementById('maxBalance').value='';
			document.getElementById('minBalance').value='';
			document.getElementById('targetAmnt').value='';
			
			document.getElementById('maxBalance').disabled = true;
	 		document.getElementById('maxBalance').readOnly = true;
	 
	 		document.getElementById('minBalance').disabled = true;
	 		document.getElementById('minBalance').readOnly = true;
	
	 		try
	 		{
	 			document.getElementById('fixedAmnt').value='';
	 			document.getElementById('fixedAmnt').disabled = true;
				document.getElementById('fixedAmnt').readOnly = true;
				document.getElementById('fixedAmnt').className = 'cwInputBoxDisabled';
				
			}
	 		catch(e)
	 		{
	 		}
	
			document.getElementById('targetAmnt').disabled = true;
			document.getElementById('targetAmnt').readOnly = true;
	
			document.getElementById('maxBalance').className = 'cwInputBoxDisabled';
	 		document.getElementById('minBalance').className = 'cwInputBoxDisabled';
			document.getElementById('targetAmnt').className = 'cwInputBoxDisabled';
			try
			{
			document.getElementById('proportionate').value = '';
			document.getElementById('proportionate').disabled = true;
			document.getElementById('proportionate').readOnly = true;
			document.getElementById('proportionate').className = 'cwInputBoxDisabled';
			}
			catch(e)
			{
			}
	 	}
		
		
	
	}
	else if(obj.id == 'srcToTarget')
	{
		if(element == 'F')
		{
			document.getElementById('lendingRate').value=lendingRate;
			document.getElementById('lendingRate').className = 'cwRInputBox';
			document.getElementById('lendingRate').readonly = false;
			document.getElementById('lendingRate').disabled = false;
			
			document.getElementById('STFixedRate').value='';
			document.getElementById('STFixedRate').className = 'cwInputBoxDisabled';
			document.getElementById("brate1").style.visibility= "hidden";
			document.getElementById('STFixedRate').disabled = true;
			document.getElementById('STFixedRate').readOnly = true;
			
			document.getElementById('STSpread').value='';
			document.getElementById('STSpread').disabled = true;
			document.getElementById('STSpread').readOnly = true;
			document.getElementById('STSpread').className = 'cwInputBoxDisabled';
		}
		else if(element == 'V')
		{
			document.getElementById('lendingRate').value='';
			document.getElementById('lendingRate').className = 'cwInputBoxDisabled';
			document.getElementById('lendingRate').readonly = true;
			document.getElementById('lendingRate').disabled = true;
			
			document.getElementById('STFixedRate').value=STFixed;
		
			document.getElementById('STFixedRate').className = 'cwRInputBox';
			document.getElementById('STFixedRate').disabled = false;
			document.getElementById('STFixedRate').readOnly = false;
			document.getElementById("brate1").style.visibility= "visible";
			
			document.getElementById('STSpread').value=STSpread;
			
			document.getElementById('STSpread').disabled = false;
			document.getElementById('STSpread').readOnly = false;
			
			document.getElementById('STSpread').className = 'cwRInputBox';
		}
		
	}
	else if(obj.id == 'targetToSrc')
	{
		if(element == 'F')
		{
			document.getElementById('borrowRate').value=borrowRate;
			document.getElementById('borrowRate').className = 'cwRInputBox';
			document.getElementById('borrowRate').readonly = false;
			document.getElementById('borrowRate').disabled = false;
					
			document.getElementById('TSFixedRate').value='';
			document.getElementById('TSSpread').value='';
			document.getElementById('TSSpread').disabled = true;
			document.getElementById('TSSpread').readOnly = true;
			document.getElementById('TSFixedRate').readonly = true;
			document.getElementById('TSFixedRate').disabled = true;
			document.getElementById("brate2").style.visibility= "hidden";
			document.getElementById('TSFixedRate').className = 'cwInputBoxDisabled';
			document.getElementById('TSSpread').className = 'cwInputBoxDisabled';
		}
		else if(element == 'V')
		{
			document.getElementById('borrowRate').value='';
			document.getElementById('borrowRate').className = 'cwInputBoxDisabled';
		
			document.getElementById('borrowRate').readonly = true;
			document.getElementById('borrowRate').disabled = true;
			
			document.getElementById('TSFixedRate').value=TSFixed;
			document.getElementById('TSSpread').value=TSSpread;
			document.getElementById('TSSpread').disabled = false;
			document.getElementById('TSSpread').readOnly = false;
			document.getElementById('TSFixedRate').readonly = false;
			document.getElementById('TSFixedRate').disabled = false;
			
			document.getElementById("brate2").style.visibility= "visible";
			
			document.getElementById('TSSpread').className = 'cwRInputBox';
			document.getElementById('TSFixedRate').className='cwRInputBox';
			
		}
	}


 	 	return false;	
}

function disableCheck(obj)
{

	var name ;
	
	if (obj == null || unDefined(obj))
 		return;
 	var element ;
 	try
 	{
 		name = obj.name;
 	}
 	catch(e)
 	{
 	}
 	if (name == null || unDefined(name))
 		return;
 	

	if(name == 'dlyContrRlimit')
	{
	
		if(obj.checked == true)
		{
			document.getElementById('dlyContrRAmnt').value =dlyContrRAmnt;
			document.getElementById('dlyContrRAmnt').disabled =false;
			document.getElementById('dlyContrRAmnt').readOnly =false;
			
			document.getElementById('dlyContrRAmnt').className = 'cwRInputBox';
			
		}
		else
		{
			document.getElementById('dlyContrRAmnt').value ='';
		
			document.getElementById('dlyContrRAmnt').disabled =true;
			document.getElementById('dlyContrRAmnt').readOnly =true;
			document.getElementById('dlyContrRAmnt').className = 'cwInputBoxDisabled';
		}
			
	}
	else if(name == 'dlyContrPlimit')
	{
		if(obj.checked == true)
		{
			document.getElementById('dlyContrPAmnt').value =dlyContrPAmnt;
			document.getElementById('dlyContrPAmnt').disabled =false;
			document.getElementById('dlyContrPAmnt').readOnly =false;
			document.getElementById('dlyContrPAmnt').className = 'cwRInputBox';
		}
		else
		{
			document.getElementById('dlyContrPAmnt').value ='';
			document.getElementById('dlyContrPAmnt').disabled =true;
			document.getElementById('dlyContrPAmnt').readOnly =true;
			document.getElementById('dlyContrPAmnt').className = 'cwInputBoxDisabled';
		}
	}
	else if( name == 'limitFundTrnsf')
	{
	
		if(obj.checked == true)
		{
			document.getElementById('minLimit').value = minLimit;
			document.getElementById('maxLimit').value = maxLimit;
			document.getElementById('minLimit').disabled =false;
			document.getElementById('minLimit').readOnly =false;
			document.getElementById('maxLimit').disabled =false;
			document.getElementById('maxLimit').readOnly =false;
			document.getElementById('minLimit').className = 'cwRInputBox';
			document.getElementById('maxLimit').className = 'cwRInputBox';
	
		}
		else
		{
			document.getElementById('minLimit').value ='';
			document.getElementById('maxLimit').value ='';
			document.getElementById('minLimit').disabled =true;
			document.getElementById('minLimit').readOnly =true;
			document.getElementById('maxLimit').disabled =true;
			document.getElementById('maxLimit').readOnly =true;
			document.getElementById('minLimit').className = 'cwInputBoxDisabled';
			document.getElementById('maxLimit').className = 'cwInputBoxDisabled';
		}
	}
	else if(name == 'appMinLotCond')
	{
		if(obj.checked == true)
		{
			document.getElementById('minLot').value=minLot;
			document.getElementById('minLot').disabled =false;
			document.getElementById('minLot').readOnly =false;
			document.getElementById('minLot').className = 'cwRInputBox';
		}
		else
		{
			document.getElementById('minLot').value='';
			document.getElementById('minLot').disabled =true;
			document.getElementById('minLot').readOnly =true;
			document.getElementById('minLot').className = 'cwInputBoxDisabled';
		}
	}
	else if(name == 'incomeSharing')
	{
		if(obj.checked == true)
		{
			document.getElementById('sharing').value=sharing;
			document.getElementById('sharing').disabled =false;
			document.getElementById('sharing').readOnly =false;
			document.getElementById('sharing').className = 'cwRInputBox';
			
		}
		else
		{
			document.getElementById('sharing').value='';
			document.getElementById('sharing').disabled =true;
			document.getElementById('sharing').readOnly =true;
			document.getElementById('sharing').className = 'cwInputBoxDisabled';
		}
	
	}
	
	return true;
}

function disableElements()
{
	args = disableElements.arguments;
	for(i = 0 ; i <args.length;i++)
	{
		document.getElementById(args[i]).disabled=true;
		document.getElementById(args[i]).readOnly=true;
		document.getElementById(args[i]).className = 'cwInputBox';
	
	}
}

function dow(obj)
{
	var elename = obj.name;
	var element = document.getElementsByName(elename);
	for(i=0;i<element.length;i++)
	{
		if(obj.id != element[i].id)
		{
			element[i].checked =false;
		}
		else
		{
			element[i].checked =true;
		}
	}
	
}
function setFreqDisplay(t)
{	

	if (t == null || unDefined(t))
 		return;
 	var element ;
 	try
 	{
 		element = t.options[t.selectedIndex].value;
 	}
 	catch(e)
 	{
 	}
 	if (element == null || unDefined(element))
 		return;
 	
    if (element == 'W')
	{
		document.getElementById('dayofWeekSpan').style.display='block';
		document.getElementById('dayOfMonthId').style.display='none';
	}
	else if(element == 'M')
	{
		document.getElementById('dayofWeekSpan').style.display='none';
		document.getElementById('dayOfMonthId').style.display='block';
	}
	else
	{
		document.getElementById('dayofWeekSpan').style.display='none';
		document.getElementById('dayOfMonthId').style.display='none';
		
	}
}

function enableMe()
{
	return true;
}
function disableMe()
{
	return true;
}

function enable(v)
{
	var obj = null;
	if (v.name == 'allowFillDeficit')
	{
		if (v.checked == true)
		{
		 obj = document.getElementsByName('lmtFillDeficit');
		 obj[0].disabled = false;
		}
		else
		{
		 obj = document.getElementsByName('lmtFillDeficit');
		 obj[0].checked = false;
		 obj[0].disabled = true;
		 enable (obj[0]);
		}
	}
	else if (v.name == 'lmtFillDeficit')
	{
	 /*
	 if (v.checked == true)
	 {
	 	 obj = document.getElementsByName('dlyContrPlimit');
		 obj[0].disabled = false;
		 disableCheck(obj[0]);
		 obj = document.getElementsByName('dlyContrRlimit');
		 obj[0].disabled = false;
		 disableCheck(obj[0]);
			
	 }
	 else
	 {
		  obj = document.getElementsByName('dlyContrPlimit');
		  obj[0].checked = false;
		  disableCheck(obj[0]);
		  obj[0].disabled = true;
		  obj = document.getElementsByName('dlyContrRlimit');
		  obj[0].checked = false;
		  disableCheck(obj[0]);
		  obj[0].disabled = true;
	 }
	 */
	}
	else if ( v.name == 'limitFundTrnsf')
	{
		  if (v.checked == true)
		  {
			  obj = document.getElementsByName('trnsfMaxAmnt');
			  disableCheck(obj[0]);
			  obj[0].disabled = false;
		  }
		  else
		  {
			  obj = document.getElementsByName('trnsfMaxAmnt');
			  obj[0].checked = false;
			  disableCheck(obj[0]);
			  obj[0].disabled = true;
		  }
		  
		
	}
	else if (v.name == 'interAcctTrfPricing')
	{
		if (v.checked == true)
		{
			obj = document.getElementById('srcToTarget');
			obj.disabled = false;
			obj.className = 'cwRInputBox';
			obj = document.getElementById('lendingRate');
			obj.disabled = false;
			obj.className = 'cwInputBoxDisabled';
			obj = document.getElementById('borrowRate');
			obj.disabled = false;
			obj.className = 'cwInputBoxDisabled';
			obj = document.getElementById('targetToSrc');
			obj.disabled = false;
			obj.className = 'cwRInputBox';
			obj = document.getElementById('STFixedRate');
			obj.disabled = false;
			obj.className = 'cwRInputBox';
			obj = document.getElementById('TSFixedRate');
			obj.disabled = false;
			obj.className = 'cwRInputBox';
				
			obj = document.getElementById("brate1");
			obj.style.visibility = "visible";
			obj = document.getElementById("brate2");
			obj.style.visibility= "visible";
			
			disableSelect(document.getElementById('srcToTarget'));
			disableSelect(document.getElementById('targetToSrc'));
			
		}
		else
		{
			disableSelect(document.getElementById('srcToTarget'));
			disableSelect(document.getElementById('targetToSrc'));
			obj = document.getElementById('srcToTarget');
			obj.disabled = true;
			obj.className = 'cwInputBoxDisabled';
			obj = document.getElementById('lendingRate');
			obj.disabled = true;
			obj.className = 'cwInputBoxDisabled';
			obj = document.getElementById('borrowRate');
			obj.disabled = true;
			obj.className = 'cwInputBoxDisabled';
			obj = document.getElementById('targetToSrc');
			obj.disabled = true;
			obj.className = 'cwInputBoxDisabled';
			obj = document.getElementById('STFixedRate');
			obj.disabled = true;
			obj.className = 'cwInputBoxDisabled';
			obj = document.getElementById('TSFixedRate');
			obj.disabled = true;
			obj.className = 'cwInputBoxDisabled';
			obj = document.getElementById('STSpread');
			obj.disabled = true;
			obj.className = 'cwInputBoxDisabled';
			obj = document.getElementById ('TSSpread');
			obj.disabled = true;
			obj.className = 'cwInputBoxDisabled';
			obj = document.getElementById("brate1");
			obj.style.visibility = "hidden";
			obj = document.getElementById("brate2");
			obj.style.visibility= "hidden";
		
		}
		
	}
	return;
}