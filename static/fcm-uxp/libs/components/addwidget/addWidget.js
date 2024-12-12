
var activeWidgetModule = null;
var cloneMaxCount = new Map();

const addWidget_templates = {
	addWidgetButton : '<button type="button" id="addwgtbtn" class="btn btn-raised primary-button apply-btn btn-add-widget rounded-circle" data-toggle="modal" data-target="#addWidgetPopup">' +
	                   '<span class="material-icons addSymbol" style="">add</span></button>',
	
	addWidgetPopup : '<div class="modal fade" id="addWidgetPopup" tabindex="-1" role="dialog" style = "z-index:999999" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">'+
                        '<div class="modal-dialog modal-lg" role="document">'+
                        '<div class="modal-content">' +
							'<div class="modal-header">' +
								'<h4 class="modal-title" id="exampleModalLabel">' +
								getDashLabel('btn.addWidget','Add Widgets') +
								'</h4>' +
								'<button type="button" class="close" id="add_widget_close" data-dismiss="modal" aria-label="Close">' +
								  '<span aria-hidden="true">&times;</span>' +
								'</button>' +
							'</div>' +
                        '<div class="modal-body">' +
                                                 '<div class="row">'+ 
						  '<div class="col-12" id="added_widgets_chips">'+
				          
						   '</div>'+
						 '</div>'+
						 '<div class="row">'+ 
						 '<div class="col-12">'+
						  '<input type="text" id="input_search" class="float-right form-control" style="width:250px;" placeholder="' +getDashLabel('addWidget.placeholder.search','Enter Keyword or %') +'">' +
						  '</div>'+
						  '</div>'+
						  '<div class="dropdown-divider"></div> <div class="row"><div id="addWidget_errorDiv" style="padding-left:10px;"></div></div> '+						  
						  '<div class="row">'+ 
						   '<div class="col-3" id="addWidget_left_section">' +
					         '<ul class="nav nav-pills flex-column list-unstyled addWidget-nav-list" id="addWidgetTab" role="tablist">'+
						 '</ul>'+
							'</div>'+
							//Right section for add widget
							'<div class= "col-9 tab-content" id="addWidget_right_section" style="max-height:430px;overflow:auto;">'+
							  
							'</div>'+
						'</div>'+	
                        '</div>' +
                        '</div>' +
                        '</div>' +
                     '</div>'
}

const widgetDataMap = {
	layoutId : { 
	       'banner':'dash-top-container',
		   'right':'dash-right-container',
		   'rightwide':'dash-right-container',
		   'left':'dash-left-container'
	},
	widgetColSpan : {
		 'banner': 2,
		 'right': 1,
		 'rightwide':2,
		 'left':2
	},
       modules : {
       '01':'Balance Reporting',
       '02':'Payments',
       '03':'Admin',
       '05':'Receivables',
       '06':'SCF',
       '13':'Positive Pay',
       'ALL':'ALL' 
       }
}

$(document).ready(function(){
     $('.dash-body').append(addWidget_templates.addWidgetButton);
     $('.dash-body').append(addWidget_templates.addWidgetPopup);
     
     if(_strUserLocale=="ar_BH")
     {     
     	$('#addWidgetPopup').addClass('field-rtl');
     	$('#addwgtbtn').removeClass('btn-add-widget');
		$('#addwgtbtn').addClass('btn-add-widget-rtl');
		$('#addwgtbtn').css('padding-right','10px');		
		$('#input_search').removeClass('float-right');
		$('#input_search').addClass('float-left');
		$("#addWidgetTab").css('padding-right','0');
	}
     
});

function validateforWidgets(modulesMap)
{
    if(modulesMap == null || modulesMap.size == 0)
    {
		$( "#addWidget_errorDiv" ).empty();
		 $( "#addWidget_errorDiv" ).append('<label for="error">'+getDashLabel('addWidget.noWidgetToAdd')+'</label>');
    }
    else
    {
		$( "#addWidget_errorDiv" ).empty();
    }
}
function fetchAvailableWidgets(){
   let resData = null;
   // FIXME: [JP] Populate window.widgetBaseUrl with correct context path??
   var contextPath = (window.widgetBaseUrl === undefined ? (rootUrl === undefined ? '/fcmcust/' : rootUrl) : window.widgetBaseUrl);
   var strUrl = contextPath + '/services/getClientWidgets.json';
   var strData = {};
   strData['$widget'] = 'NEW';
   if($('#input_search').val() != '')
	   strData['$autofilter'] = $('#input_search').val();
   strData[csrfTokenName] = csrfTokenValue ; 
   $.ajax(
   {
		 type : 'POST',
		 data : strData,
		 url : strUrl,
		 dataType : 'json',
         async : false,
		 success : function( data )
		 {
			 resData = data;
		 }                       
   });
   return resData;
}

function parseRestData(data)
{
	let moduleSet = new Set();
	if(data && data.clientwidgets && data.clientwidgets.length > 0)
	{
		$(data.clientwidgets).each(function (index,data){
			moduleSet.add(data.module);
		});
		
		if(moduleSet.size == 1)
			paintReponse(data, true);
		else
			paintReponse(data, false);
	}
	else
	{
		 paintReponse(data, false);
	}
}
function paintReponse(clientWidgetData, paintonlyModule)
{
	let widgets = {};
	widgets['ALL'] = [];
	let allWidgets = [];
	var modulesMap = new Map();
	cloneMaxCount = getCloneMaxCount();
	$(clientWidgetData.clientwidgets).each(function (index,data){
	if(!widgetCloneNumberMap.has(data.widgetCode) || widgetCloneNumberMap.get(data.widgetCode)< cloneMaxCount.get(data.widgetCode)) {	
        
         if(!paintonlyModule) {
            modulesMap.set('ALL', 'ALL');
          }          
		modulesMap.set(data.module, data.widgetCategory);
		if(typeof widgets[data.widgetCategory] === 'undefined')
			widgets[data.widgetCategory] = [];
		widgets[data.widgetCategory].push({
			"widgetDesc": data.widgetDesc,
			"categoryDesc": data.widgetCategory,
			"widgetInfo" : data.widgetInfo,
            "widgetThumb" : data.widgetThumb,
            "url": "addToDashboard('"+widgetDataMap.layoutId[data.widgetType]+"','" + data.widgetDesc +"','"+data.widgetCode+"','"+data.group+"',"+ widgetDataMap.widgetColSpan[data.widgetType]+ ")"

		});
		widgets['ALL'].push({		
			"widgetDesc": data.widgetDesc,
			"categoryDesc": data.widgetCategory,
			"widgetInfo" : data.widgetInfo,
			"widgetThumb" : data.widgetThumb,
			"url": "addToDashboard('"+widgetDataMap.layoutId[data.widgetType]+"','" + data.widgetDesc +"','"+data.widgetCode+"','"+data.group+"',"+ widgetDataMap.widgetColSpan[data.widgetType]+ ")"
		});
	}
	});
        paintAddWidgetPopup(modulesMap);
        validateforWidgets(modulesMap);
        modulesMap.forEach(function(value, key){
          paintWidgets(widgets[value], key);
        });
	paintSearchBox();
    removeWidgetFromDashboard();
    $('#addWidgetPopup').on('hidden.bs.modal', function (e) {
       if($('#input_search').val()!='') {
         $('#input_search').val('');
         $('#input_search').trigger('blur');
       }
       $('#addWidget_ALL').trigger('click');
	   if($('#added_widgets_chips button').length > 0) {
         dashBoard.init({"metadata": usrDashboardPref.dashboard}); 
       }
       $('#added_widgets_chips').empty();
   });
	
    if(activeWidgetModule != null && activeWidgetModule != '')
    	$('#'+activeWidgetModule).trigger('click');
}

function getCloneMaxCount(){
	var cloneMap = new Map();
	for (let property in widgetMap){
		if(!cloneMap.has(widgetMap[property].widgetType))
          if(typeof widgetMap[property].cloneMaxCount === 'undefined')
          widgetMap[property].cloneMaxCount = 1;
		  cloneMap.set(widgetMap[property].widgetType, widgetMap[property].cloneMaxCount);
	}
	return cloneMap;
}

function paintSearchBox()
{
	$('#input_search').autocomplete({
		  source: function( request, response ) {
			  if($('#input_search').val() == '' || $('#input_search').val() == null)
			  {
				  let response = fetchAvailableWidgets();
				  parseRestData(response);
			  }
			  else {
			   var strUrl = 'services/getClientWidgets.json';
			   var strData = {};
			   strData['$widget'] = 'NEW';
			   strData['$isBannerAdded'] = true;
			   strData['$autofilter'] = request.term;
			   strData[csrfTokenName] = csrfTokenValue ; 
			   $.ajax(
			   {
					 type : 'POST',
					 data : strData,
					 url : strUrl,
					 dataType : 'json',
					 success : function( data )
					 {
                        var results = $.map(data.clientwidgets, function (item) {
							if(!widgetCloneNumberMap.has(item.widgetCode) || widgetCloneNumberMap.get(item.widgetCode)< cloneMaxCount.get(item.widgetCode)) {
								return {
									label: item.widgetDesc,
									value: item.widgetDesc,
									rec: item
								}								
							}
						})
                         if(data.clientwidgets.length == 0) 
                          results = {label:getDashLabel('addWidget.message.noResultsFound')};
						return response(results);
					 }
			   });
			  }
		  },
		  minLength: 0,
		  select: function( event, ui ) {
			var data = {};
			data.clientwidgets = [];
			data.clientwidgets.push(ui.item.rec);
			$(this).val(ui.item.label);
			parseRestData(data);
		  }		  
		});	
}
function paintWidgets(widgetList, module){
         module = widgetDataMap.modules[module].split(' ');
	let container = 'addWidgetSection'+module[0];
	$('#'+container).empty();
	$(widgetList).each(function (index,data){
		let widgetItem = '<div id="widget_item" class="add-widget-item">';
		widgetItem+=     '<div class="row">';
		widgetItem+=     '<div class="col-2 align-middle" style="margin-top:2.2em">';
		widgetItem+=        '<img src="./'+ data.widgetThumb +'">';
		widgetItem+=     '</div>';
		widgetItem+=     '<div class="col-10">';
        widgetItem+=        '<h6>' + data.widgetDesc + '</h6>';
		widgetItem+=        '<span style="font-family:futura-pt">' + data.widgetInfo +'</span>' ;
		widgetItem+=     '</div>'; 
		widgetItem+=     '</div>';
		widgetItem+=     '<div class="row"><div class="col-12 mb-2">';
		widgetItem+=       '<button class="btn primary-button float-right btn-display" id="btn_add"  onclick ="' + data.url + '">';
		widgetItem+=         '+  ' + getDashLabel('btn.add','Add');
		widgetItem+=       '</button>';
		widgetItem+=     '</div></div>';
		widgetItem+=     '<div class="dropdown-divider"></div>';
        widgetItem+=     '</div>';
		$('#'+container).append(widgetItem);
	});   
    
	
}

function addToDashboard(layoutId, widgetDesc, widgetType, groupContainerId, colSpan){
	let widgetAdded = false;
	let widgetId = widgetType + '_' + getNextUniqueId();
 
   $(usrDashboardPref.dashboard.layouts).each(function(index, data) {
      if(data.layoutId == layoutId && layoutId == 'dash-top-container') { 
    	  
    	  $(usrDashboardPref.dashboard.layouts[index].groupContainers).each(function(idx, container) {
    		  if(container.id == groupContainerId)
    		  {
    			  usrDashboardPref.dashboard.layouts[index].groupContainers[idx].widgetContainers.push({
    				  "widgetId" : widgetId,
    				  "widgetType": widgetType
    			  });
    			  widgetAdded = true;
    		  }
    	  });
       }
   });

   if(!widgetAdded)
   {
	   $(usrDashboardPref.dashboard.layouts).each(function(index, data) {   
		  if(!widgetAdded && data.layoutId == layoutId)
		  {
	    	  (usrDashboardPref.dashboard.layouts[index].groupContainers).push({
		           "id":groupContainerId,
		   		   "position": 1,
		   		   "colSpan": colSpan,
		   		   "rowSpan": 1, 
		           "widgetContainers": [{
		           "widgetType": widgetType,
		           "widgetId":widgetId}]
	           });   		  
		  }
	   });	   
   }
	  
	  updateDashboardPref();	  
      addChips(widgetDesc, widgetId);
      getWidgetsForCloneCount();
      let response = fetchAvailableWidgets();
	  parseRestData(response);

}

function paintAddWidgetPopup(moduleMap) {
       $('#addWidget_left_section ul').empty();
       $('#addWidget_right_section').empty();
	moduleMap.forEach(function(value, key){
		var val = value.split(' ');
		var href = 'addWidgetSection'+val[0];
		var id = 'addWidget_' + val[0];
        var ariaSelected = (value == 'ALL' || moduleMap.size == 1)?true:false; 
        var itemClass = (value == 'ALL' || moduleMap.size == 1)?'active':'';
        var tabClass =  (value == 'ALL' || moduleMap.size == 1)?'show active':'';

		var listItem = '<li class="nav-item">'+
						'<a class="nav-link '+ itemClass + '"id="' + id + '" onclick="setActiveModule(this.id);" data-toggle="tab" href="#' + href + '"role="tab" aria-controls="' +href + '"aria-selected=' + ariaSelected  +'>'+
						'<span class="addWidget-item-border"></span>' +
						   getDashLabel('addWidget.'+key, value) +
						'</a>'+
					  '</li>';
		 var tabRef =  '<div class="tab-pane fade ' + tabClass + '"role="tabpanel" id="' + href +'">' +
		               '</div>';
		 $('#addWidget_left_section ul').append(listItem);
		$('#addWidget_right_section').append(tabRef);
	});
	
}

function setActiveModule(selectedModule)
{
	activeWidgetModule = selectedModule;
}
function addChips(widgetDesc, widgetId){
   let chip = '<button id="add_widget_button'+getNextUniqueId()+'" class="btn btn-raised btn-primary m-1 p-1 pl-2" style="font-size:10px; text-transform:inherit">';
       chip += widgetDesc + '<i class="material-icons align-middle text-center ml-1" style="font-size:10px;" id="remove_widget" widgetId = "'+ widgetId+ '">close</i>';
       chip += '</button>';
  $('#added_widgets_chips').append(chip);
}

function getWidgetsForCloneCount(){
        widgetCloneNumberMap.clear();
	let dashboardLayoutsJson = usrDashboardPref.dashboard.layouts;
	if (dashboardLayoutsJson) {
		$.each(dashboardLayoutsJson, function(indexLayout, layout){
			if (layout) {
				$.each(layout.groupContainers, function(indexGroupContainer, groupContainer){
					if (groupContainer) {
					$.each(groupContainer.widgetContainers, function(indexWidgetContainers, widgetContainer){
						countWidgetClones(widgetContainer.widgetType);
					});
					}
				});
			}
		});
	}
}

function countWidgetClones(widgetType){
	if(widgetCloneNumberMap.has(widgetType)) {
		widgetCloneNumberMap.set(widgetType, Number(1)+Number(widgetCloneNumberMap.get(widgetType)));
	   }
	   else {
		widgetCloneNumberMap.set(widgetType, Number(1));
	   }
}

function removeWidgetFromDashboard(){
  let id;
  $('#added_widgets_chips button').click(function(){
     id= $(this).find('i').attr('widgetId');
     buttonId = $(this).attr('id');
     let _index, _index2, _index3;
	   $(usrDashboardPref.dashboard.layouts).each(function(index, layout){
		   _index = index;
		   $(layout.groupContainers).each(function(index2, layout2){
			   _index2 = index2;
			  $(layout2.widgetContainers).each(function(index3, layout3){
				   _index3 = index3;
				 if(layout3.widgetId == id)
				 {
                     // splice will remove the provided index element from array
                     usrDashboardPref.dashboard.layouts[_index].groupContainers[_index2].widgetContainers.splice(_index3,1);
                     // if widgetContainers becomes empty then remove the groupcontainer itself
                     if(usrDashboardPref.dashboard.layouts[_index].groupContainers[_index2].widgetContainers.length == 0)
                         usrDashboardPref.dashboard.layouts[_index].groupContainers.splice(_index2,1);
                     updateDashboardPref();
                     getWidgetsForCloneCount();
       			  	 let response = fetchAvailableWidgets();
       			  	 parseRestData(response);
				 }
			  }); 
		   });
	   });
      $('#'+buttonId).remove();
      });
}

