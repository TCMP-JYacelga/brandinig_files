CommonUtility = {};

CommonUtility.isEmpty = function(val)
{
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

CommonUtility.goToPage = function(strUrl, frmId) {
	var frm = document.createElement( 'FORM' );
	frm.name = 'frmMain';
	frm.id = 'frmMain';
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	document.body.appendChild( frm );
	frm.submit();
	document.body.removeChild( frm );
}

CommonUtility.showToast = function(id)
{
	 $('#' + id).toast('show');
}

CommonUtility.createToast = function(title, message, img, timeout, index)
{
	let mainDiv = document.createElement("div");
	mainDiv.setAttribute('id', "toastDiv" + index);
	mainDiv.setAttribute('role', "alert");
	mainDiv.setAttribute('aria-live', "assertive");
	mainDiv.setAttribute('aria-atomic', "true");
	mainDiv.setAttribute('class', "toast");
	mainDiv.setAttribute('data-delay', timeout);
	mainDiv.setAttribute('style', "position: absolute; top: 1rem; right: 1rem;");
	
	let subDiv = document.createElement("div");
	subDiv.setAttribute('id', "subDiv");
	subDiv.setAttribute('class', "toast-header");
	
	let imgSpan = document.createElement("span");
	imgSpan.setAttribute('class', 'material-icons');
	imgSpan.innerText = img;
	
	if(img == 'check_circle')
	{
		imgSpan.setAttribute('style', "color:green;");
	}
	else
	{
		imgSpan.setAttribute('style', "color:red;");
	}
	
	let strong = document.createElement("strong");
	strong.setAttribute('class', "mr-auto");
	strong.innerText = title;
	
	let btn = document.createElement("button");
	btn.setAttribute('class', "close");	
	btn.setAttribute('data-dismiss', "toast");	
	btn.setAttribute('aria-label', "Close");
	
	let span = document.createElement("span");
	span.setAttribute('aria-hidden', 'true');
	span.innerText = "x";
	
	let divBody = document.createElement("div");
	divBody.setAttribute('class', "toast-body");
	divBody.innerText = message;
	
	mainDiv.append(subDiv);
	subDiv.append(imgSpan);
	subDiv.append(strong);
	btn.append(span);
	subDiv.append(btn);
	mainDiv.append(divBody);
	return mainDiv;
}

/* Creating our algorithm functions */
CommonUtility.mergeSort = function(list){
    // Getting the half part of the list
    let half = list.length/2;
    if(list.length < 2){
      return list;
    }
    
    // Getting the left part of the list, by default the other part will be the right
    const left = list.splice(0,half);
    
    // Call merge function and mergeSort recursively to solve the sorting
    return CommonUtility.merge(CommonUtility.mergeSort(left),CommonUtility.mergeSort(list));
}

CommonUtility.merge = function(left,right){
    
    let list = [];
    let finalList = [];
    // Main loop through the left and right parts to merge them sorted
    while(left.length && right.length){
      // Execute the comparison statement
      if(left[0] < right [0]){
        list.push(left.shift());
      }else{
        list.push(right.shift());
      }
    }
    if(list.length > 0)
    	finalList = finalList.concat(list);
    if(left.length > 0)
    	finalList = finalList.concat(left);
    if(right.length > 0)
    	finalList = finalList.concat(right);    
    // Return the list sorted and merged with the rest operator.
    return finalList;
}

 CommonUtility.dateFilter = function( widgetType, defaultValue)
 {
   let dateOptions = [
	   {code : '7days', desc: 'Last 7 Days'},
       {code : '14days', desc: 'Last 14 Days'},
       {code : '30days', desc: 'Last 30 Days'},
       {code : '3months', desc: 'Last 3 Months'},
	   {code : '6months', desc: 'Last 6 Months'},
	   {code : '9months', desc: 'Last 9 Months'},
	   {code : '1year', desc: 'Last 1 Year'}] ;

   let filterDateList = '<select class="widget-custom-filter small-select d-none" id="quickDateFilter_'+widgetType+'">';

   for(var index in dateOptions)
   {
	   if (defaultValue === index.code )
	   {
           filterDateList += '<option selected value="'+index.code+'">'+getDashLabel('quickDateFilter.'+index.code,index.desc)+'</option>';
	   }
	   else
	   {
           filterDateList += '<option value="'+index.code+'">'+getDashLabel('quickDateFilter.'+index.code,index.desc)+'</option>';
	   }
   }
   filterDateList += '</select>';
   
   $('#quickDateFilter_'+widgetType).change(function(){
   });
			
   	$('#groupWidgetContainer_'+widgetType).find('.refresh-icon').before( filterDateList );
 }