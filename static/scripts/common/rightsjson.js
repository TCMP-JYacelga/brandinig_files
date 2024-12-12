//Json objects for holding checked/unchecked Rights' Serials
var objJsonData = { "v":{}, "e":{}, "a":{} };
var arrRightTypes = ["v", "e", "a"];

function selectChildren(typeOfRight, parentSerial)
{
	var parentTrElement;
	var i, index;
	var parentImgElement;
	var checkAll = false;
	var childSerial;
	var arrChildSerials;

	if (typeOfRight.toUpperCase() == 'V')
	{
		index = 1;
	}
	else if (typeOfRight.toUpperCase() == 'E')
	{
		index = 2;
	}
	else
	{	
		index = 3;
	}	

	parentTrElement = document.getElementById("node-" + parentSerial)
	parentImgElement = parentTrElement.cells[index].childNodes[0].childNodes[0];

	if (parentImgElement.src.indexOf("icon_uncheckmulti") > -1)
	{
		parentImgElement.src = "static/images/icons/icon_checkmulti.gif";
		checkAll = true;
	}
	else
	{
		//if view acl parent is unchecked, we need to uncheck respective edit or auth acl parent.
		if (typeOfRight.toUpperCase() == 'V')
		{
			for(i=1; i<=3; i++)
			{
				parentImgElement = parentTrElement.cells[i].childNodes[0].childNodes[0];
				parentImgElement.src = "static/images/icons/icon_uncheckmulti.gif";
			}
		}
		else
			parentImgElement.src = "static/images/icons/icon_uncheckmulti.gif";
	}

	//acl_list varaible is of the json form {parentSerial:[childserial1,....childSerialn]
	//e.g. {1:[2,3,4,5],6:[7,8,9,10]...}
	//get the list of child serials for the selected parent serial
	arrChildSerials = acl_list[parentSerial];

	//check / uncheck all children as parent is checked / unchecked
	for ( i=0; i < arrChildSerials.length; i++)
	{
		if (arrChildSerials[i] != null && arrChildSerials[i] != undefined)
		{
			childSerial = arrChildSerials[i];

			if (!checkAll)
				processUnChecked(typeOfRight, childSerial);
			else
				markCheckUncheck(typeOfRight, childSerial, true);
		}
	}
}

function selectACL(typeOfRight, serial)
{
	typeOfRight = typeOfRight.toLowerCase();

	if (!objJsonData[typeOfRight][serial])
		markCheckUncheck(typeOfRight, serial, true);
	else
		processUnChecked(typeOfRight, serial);
	if ('v' == typeOfRight)
	{
		setSelectAllParent("__BASE",'v');
		setSelectAllParent("__BASE",'e');
		setSelectAllParent("__BASE",'a');
		setSelectAllHeader('v','chkSelectAllView');
		setSelectAllHeader('e','chkSelectAllEdit');
		setSelectAllHeader('a','chkSelectAllAuth');
	}
	else if ('e' == typeOfRight)
	{
		setSelectAllParent("__BASE",typeOfRight);
		setSelectAllHeader(typeOfRight,'chkSelectAllEdit');
	}
	else if ('a' == typeOfRight)
	{
		setSelectAllParent("__BASE",typeOfRight);
		setSelectAllHeader(typeOfRight,'chkSelectAllAuth');
	}
}

function markCheckUncheck(typeOfRight, childSerial, blnChecked)
{
	var childImgElement;
	var blnProceed = true;

	typeOfRight = typeOfRight.toLowerCase();
	childImgElement = document.getElementById("img-" + typeOfRight + "-" + childSerial );

	//if view acl is not selected do not proceed for selecting edit or auth acl
	if (blnChecked && typeOfRight != "v")
		blnProceed = objJsonData.v[childSerial]

	//check / uncheck the acl and mark the same in the json object as true or false.
	//Json object contains the list of checked / unchecked serials, for all acl types, in the form
	// { "v":{"1":true, "2":fasle,...}, "e":{"1":false, "2":false,...}, "a":{"6":true, "7":true,...} }
	if (childImgElement != null && childImgElement != undefined && blnProceed)
	{
		if (blnChecked && childImgElement.src.indexOf("icon_checked.gif") == -1)
			childImgElement.src = "static/images/icons/icon_checked.gif";
		else if (!blnChecked && childImgElement.src.indexOf("icon_unchecked.gif") == -1)
			childImgElement.src = "static/images/icons/icon_unchecked.gif";

		objJsonData[typeOfRight][childSerial] = blnChecked;
	}
}

function processUnChecked(typeOfRight, childSerial)
{
	var i;

	//if view acl is unchecked then uncheck respective edit or auth acl as well
	if (typeOfRight.toUpperCase() == "V")
	{
		for (i=0; i < arrRightTypes.length; i++)
		{
			markCheckUncheck(arrRightTypes[i], childSerial, false);
		}
	}
	else
		markCheckUncheck(typeOfRight, childSerial, false);
}

function selectDeselectAllView()
{
	var typeOfRight = 'v';
	var viewChecks = $('img[id^="img-v-"]');
	if (!flagSelectAllView)
	{
		// selects all view acl
		viewChecks.each(function()
		{
			var serial = $(this).attr('id').substring(6);
			if (!objJsonData[typeOfRight][serial])
				markCheckUncheck(typeOfRight, serial, true);
		});	
		flagSelectAllView = !flagSelectAllView;
		document.getElementById('chkSelectAllView').src = "static/images/icons/icon_checkmulti.gif";
	}
	else
	{
		// de-selects all view acl
		viewChecks.each(function()
				{
					var serial = $(this).attr('id').substring(6);
					if (objJsonData[typeOfRight][serial])
						markCheckUncheck(typeOfRight, serial, false);
				});	
		flagSelectAllView = !flagSelectAllView;
		document.getElementById('chkSelectAllView').src = "static/images/icons/icon_uncheckmulti.gif";
		// de selects all edit acl and auth acl
		flagSelectAllEdit = true;
		flagSelectAllAuth=true;
		selectDeselectAllEdit();
		selectDeselectAllAuth();
	}
	setSelectAllParent("__BASE",typeOfRight);
}
function selectDeselectAllEdit()
{
	var typeOfRight = 'e';
	var editChecks = $('img[id^="img-e-"]');
	if (!flagSelectAllEdit)
	{
		if (flagSelectAllView)
		{
			// selects all edit acl
			editChecks.each(function()
			{
				var serial = $(this).attr('id').substring(6);
				if (!objJsonData[typeOfRight][serial])
					markCheckUncheck(typeOfRight, serial, true);
			});	
			flagSelectAllEdit = !flagSelectAllEdit;
			document.getElementById('chkSelectAllEdit').src = "static/images/icons/icon_checkmulti.gif";
		}
	}
	else
	{
		//de-select all edit acl
		editChecks.each(function()
				{
					var serial = $(this).attr('id').substring(6);
					if (objJsonData[typeOfRight][serial])
						markCheckUncheck(typeOfRight, serial, false);
				});	
		flagSelectAllEdit = !flagSelectAllEdit;
		document.getElementById('chkSelectAllEdit').src = "static/images/icons/icon_uncheckmulti.gif";
	}
	setSelectAllParent("__BASE",typeOfRight);
}
function selectDeselectAllAuth()
{
	var typeOfRight = 'a';
	var authChecks = $('img[id^="img-a-"]');
	if(!flagSelectAllAuth)
	{
	if (flagSelectAllView)
		{
		// selects all auth acl
		authChecks.each(function()
		{
			var serial = $(this).attr('id').substring(6);
			if (!objJsonData[typeOfRight][serial])
				markCheckUncheck(typeOfRight, serial, true);
		});
		flagSelectAllAuth = !flagSelectAllAuth;	
		document.getElementById('chkSelectAllAuth').src = "static/images/icons/icon_checkmulti.gif";
	}
	}
	else
	{
		authChecks.each(function()
				{
					var serial = $(this).attr('id').substring(6);
					if (objJsonData[typeOfRight][serial])
						markCheckUncheck(typeOfRight, serial, false);
				});
		flagSelectAllAuth = !flagSelectAllAuth;
		document.getElementById('chkSelectAllAuth').src = "static/images/icons/icon_uncheckmulti.gif";
	}
	setSelectAllParent("__BASE",typeOfRight);
}

function setSelectAllHeader(typeOfRight,checkId)
{
	var flag = true;
	var checks;
	
	if ('v'==typeOfRight)
		checks = $('img[id^="img-v-"]');
	if ('e'==typeOfRight)
		checks = $('img[id^="img-e-"]');
	if ('a'==typeOfRight)
		checks = $('img[id^="img-a-"]');
	checks.each(function()
			{
				var serial = $(this).attr('id').substring(6);
				if (!objJsonData[typeOfRight][serial])
					{
						flag = false;
					}
			});	
			
	if (flag)
	{
		if ('v'==typeOfRight)
			flagSelectAllView = true;
		if ('e'==typeOfRight)
			flagSelectAllEdit = true;
		if ('a'==typeOfRight)
			flagSelectAllAuth = true;
		if (null != document.getElementById(checkId))
			document.getElementById(checkId).src = "static/images/icons/icon_checkmulti.gif";
	}
	else
	{
		if ('v'==typeOfRight)
			flagSelectAllView = false;
		if ('e'==typeOfRight)
			flagSelectAllEdit = false;
		if ('a'==typeOfRight)
			flagSelectAllAuth = false;
		if (null != document.getElementById(checkId))
			document.getElementById(checkId).src = "static/images/icons/icon_uncheckmulti.gif";
	}	
}
function selectDeselectParent(parent,typeOfRight,changeState)
{
	if('' == changeState)
	{
		if (arrParentChecks[parent+'-'+typeOfRight] == 'checked')
			changeState = 'unchecked';
		else
			changeState = 'checked';
	}
	if (arrParentChecks[parent+'-'+typeOfRight] != changeState)
	{
	console.log('event');
	if (arrParentChecks[parent+'-'+typeOfRight] == 'unchecked')
	{
	console.log('select');
		//select all children
		$('[parent="'+ parent +'"]').each(function() {
			var checkImage;
			var childrenImage = $(this).find("img");
			for(var i = 0; i< childrenImage.length;i++)
			{
				if (childrenImage[i].getAttribute('id').indexOf('img-'+typeOfRight+'-') > -1)
					checkImage = childrenImage[i];
			}
			if (null != checkImage)
			{
				var serial = checkImage.getAttribute('id').substring(6);
				if (!objJsonData[typeOfRight][serial])
					markCheckUncheck(typeOfRight, serial, true);
			}
			//if child is parent then recursive call
			var nid = $(this).attr('id');
			var obj2 = $('[parent="'+ nid+'"]');
			if (obj2.size() > 0) {
				selectDeselectParent(nid, typeOfRight,'checked');
			}
		});
		arrParentChecks[parent+'-'+typeOfRight] = 'checked';
		document.getElementById(parent+'-'+typeOfRight).src = "static/images/icons/icon_checkmulti.gif";
	}
	else
	{
	console.log('de-select');
		//de-select all children
		$('[parent="'+ parent +'"]').each(function() {
			var checkImage;
			var childrenImage = $(this).find("img");
			for(var i = 0; i< childrenImage.length;i++)
			{
				if (childrenImage[i].getAttribute('id').indexOf('img-'+typeOfRight+'-') > -1)
					checkImage = childrenImage[i];
			}
			if (null != checkImage)
			{
				var serial = checkImage.getAttribute('id').substring(6);
				if (objJsonData[typeOfRight][serial])
					markCheckUncheck(typeOfRight, serial, false);
			}
			
			//if child is parent then recursive call
			var nid = $(this).attr('id');
			var obj2 = $('[parent="'+ nid+'"]');
			if (obj2.size() > 0) {
				selectDeselectParent(nid, typeOfRight,'unchecked');
			}
		});
		arrParentChecks[parent+'-'+typeOfRight] = 'unchecked';
		document.getElementById(parent+'-'+typeOfRight).src = "static/images/icons/icon_uncheckmulti.gif";
		//if view acl removed then edit and auth scl are also removed
		if ('v'==typeOfRight)
		{
			arrParentChecks[parent+'-e'] = 'checked';
			selectDeselectParent(parent,'e','');
			arrParentChecks[parent+'-a'] = 'checked';
			selectDeselectParent(parent,'a','')
		}
	}
	}
	//updates the parent checkboxes
	setSelectAllParent("__BASE",typeOfRight);
	
	// update the header checkboxes
	if ('v'==typeOfRight)
			setSelectAllHeader('v','chkSelectAllView');
		if ('e'==typeOfRight)
			setSelectAllHeader('e','chkSelectAllEdit');
		if ('a'==typeOfRight)
			setSelectAllHeader('a','chkSelectAllAuth');		 
}

function setSelectAllParent(id,typeOfRight)
{
	var flag = 'checked';
	
	$('[parent="'+id+'"]').each(function() {
		
		flag = setChildren($(this),typeOfRight);
		
		if (flag == 'checked')
		{
			arrParentChecks[$(this).attr('id')+'-'+typeOfRight] = 'checked';
			document.getElementById($(this).attr('id')+'-'+typeOfRight).src = "static/images/icons/icon_checkmulti.gif";
		}
		else
		{
		
			arrParentChecks[$(this).attr('id')+'-'+typeOfRight] = 'unchecked';
			document.getElementById($(this).attr('id')+'-'+typeOfRight).src = "static/images/icons/icon_uncheckmulti.gif";
		}
		
	});
	
	}
function setChildren(node,typeOfRight)
{
var flag;
	
			var children = $('[parent="'+ node.attr('id')+'"]');
				children.each(function() {
				var flagRec = '';
					var moreChildren = $('[parent="'+ $(this).attr('id')+'"]');
					
					if (moreChildren.size() > 0)
					{
						// recursive call if child is also parent
						flagRec =  setChildren($(this),typeOfRight);
						
						if (flagRec == 'checked')
						{
							arrParentChecks[$(this).attr('id')+'-'+typeOfRight] = 'checked';
							document.getElementById($(this).attr('id')+'-'+typeOfRight).src = "static/images/icons/icon_checkmulti.gif";
						}
						else
						{				
							arrParentChecks[$(this).attr('id')+'-'+typeOfRight] = 'unchecked';
							document.getElementById($(this).attr('id')+'-'+typeOfRight).src = "static/images/icons/icon_uncheckmulti.gif";
						}
						if ((flagRec == 'checked' && flag == 'checked') || (flagRec == 'nochild' && flag == 'checked')
								|| (flagRec == 'checked' && flag == 'nochild'))
							{
								flag = 'checked';
							}
							
						else 
							flag = 'unchecked';
						
					}						
					else
					{
						var checkImage;
						var childrenImage = $(this).find("img");
						for(var i = 0; i< childrenImage.length;i++)
						{
							if (childrenImage[i].getAttribute('id').indexOf('img-'+typeOfRight+'-') > -1)
								checkImage = childrenImage[i];
						}
						if (null != checkImage)
						{
							var serial = checkImage.getAttribute('id').substring(6);
							if (!objJsonData[typeOfRight][serial])
							{
								flag = 'unchecked';
							}
							else
							{
								if (flag != 'unchecked')
									flag = 'checked';
							}
						}
						else						
						{
							if (flag == '')
								flag = 'nochild';
						}
					}
				});
			return flag;	
}