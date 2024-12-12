const DATATABLECOLTYPE = {
	'text'         : 'string',
	'amount'       : 'num-fmt',
	'number'       : 'num-fmt',
	'date'         : 'date',
	'selectbox'    : 'string',
	'multibox'     : 'string',
	'autocomplete' : 'string',
	'enum'         : 'string'
};

const DatatableWidgetUtils = {
	defaultConfig : {
	  "sDom": '<"top"i><"sorting-label">lt<"bottom"pf>',	
	  'searching'      : false,
	  'paging'         : false,
	  'fixedHeader'    : false,
	  'info'           : false,
	  'scrollY'        : "100%",	  
	  'scrollX'        : "100%",
	  'scrollCollapse' : false,
	  'scroller'       : false,
	  "order"          : [],
	  "language": {
		  "emptyTable": getDashLabel('err.noData','No data to display')
	  }
	},
	mergeSortArray : function(array1, array2) {
		var len = array2.length;
		
		
		var result_array = [];
		var arr = array1.concat(array2);
		var len = arr.length;
		var assoc = {};

		while(len--) {
			var item = arr[len];

			if(!assoc[item[0]]) 
			{ 
		        if($.type(item[0]) == 'number')
				{
					//item[0] = ""+item[0];
				}
				result_array.unshift(item);
				assoc[item[0]] = true;
			}
		}

		return result_array;
	}
};

var dataTable = function(){
	return datatableWidget();
};

function datatableWidget()
{   
    var _widgetInstance = _widget();
	var _thisWidget = {};
	_thisWidget.constructor = function(props) {
        _widgetInstance.constructor(props.widgetId, props.target, props.url, 
				props.method, props.reqData, props.resRoot);
		_thisWidget = $.extend(_thisWidget, _widgetInstance);
		_thisWidget.dataMethod = props.dataMethod != undefined ? _thisWidget.dataMethod : 'ajax';
		_thisWidget.staticData = props.data;
		_thisWidget.rootData = props.rootData != undefined ? JSON.stringify(props.rootData) : '';		
		_thisWidget.fields   = props.fields;	
		_thisWidget.utils = DatatableWidgetUtils;
		_thisWidget.groupFields = props.grouping;
		_thisWidget.sortMethod = props.sortMethod;
		_thisWidget.widgetType = props.widgetType;
		_thisWidget.seeMoreUrl = props.seeMoreUrl;
		_thisWidget.maxRecords = (props.maxRecords && !isNaN(props.maxRecords)) ? props.maxRecords : 5;
    };
	
    _thisWidget.initialize = function(){
		let _this = this;
		if(_this.dataMethod == 'ajax')
		{
			this.callAjax().then(function(resData){
				_this.createDatatable(resData);
			}).catch(function(error){
				//_this.setErrorMessage(error);
			});
		}
		else
		{			
		   	if(_this.rootData)
			{
				let rtData = _this.jsonPathToValue(_this.rootData,_this.staticData);
				if(rtData && rtData.length > 0)
				{
					_this.createDatatable(rtData);
				}
			}
			else
			{
				//_this.setErrorMessage('No data to display');
			}
		}
		if(_thisWidget.seeMoreUrl !== undefined && _thisWidget.seeMoreUrl !== '')
		{
			_this.viewMoreBind(_thisWidget.widgetId, _thisWidget.seeMoreUrl);
		}
	};
	
	_thisWidget.viewMoreBind = function(widgetId, seeMoreUrl) {
			let directionVar = "float-right";
			 if(_strUserLocale == 'ar_BH')
			 {
				 directionVar = "float-left";
			 }
			let viewMoreDiv = '<div class="view-more-btn"><a class="btn btn-primary '+directionVar+'" style="font-size:12px;padding: 0rem 0.5rem;" href="' + _thisWidget.seeMoreUrl + '">';
			viewMoreDiv += getDashLabel('utils.link.viewMore');
			viewMoreDiv += '</a></div>';
			$('#widget-footer-'+widgetId).empty();
			$('#widget-footer-'+widgetId).append(viewMoreDiv);
	   };
	   
	   _thisWidget.viewQBConnectBind = function(widgetId, seeMoreUrl) {
           let leftDiv = '<div class="sameRow" style="height: 45px;">';
           leftDiv += '</div>';
           let QBDiv = '<div class="widget-action-lastupdated sameRow" align="right" style="height: 45px;"><button type="button" class="btn btn-raised btn-primary" onclick="javascript:launchPopup();" tabindex="1">'+getDashLabel('datatable.connectToQB','Connect To QuickBooks')+'</button>';
           //QBDiv += getDashLabel('btr.balances.qb','QBooks');
           QBDiv += '</div>';
           $('#widget-footer-'+widgetId).empty();
           $('#widget-footer-'+widgetId).addClass('flex');
           $('#widget-footer-'+widgetId).append(leftDiv);
           $('#widget-footer-'+widgetId).append(QBDiv);
      };
	
	_thisWidget.setErrorMessage = function(error){
		$('#'+this.target).html(error);
	};
	
	_thisWidget.createDatatable = function(resData){
		let _this = this;
		let table = document.createElement('table');
		table.className = 'display nowrap table table-hover table-striped';
		table.id = 'datatable_'+this.widgetId;
		table.setAttribute('cellspacing','0');
		table.setAttribute('width','100%');
		$('#'+this.target).html( table );
		
		let config = this.utils.defaultConfig;
			config.data = $.type(resData) == 'array' ? resData : [];
			config.columns = this.getDataColumn();
        /*grouping start*/
			let groupCol = [];
			let groupColOrder = [];
			let colCount = config.columns.length;
			let groupColCount = _this.groupFields ? _this.groupFields.length : 0;
			let newColCount = (colCount - groupColCount)+1;
			// check if number of records are more than max records then limit records to max number of records
			if (config.data.length > _thisWidget.maxRecords) {
				config.data = config.data.slice(0, _thisWidget.maxRecords);
			}
			$(this.groupFields).each(function(index){
				let groupFldName = _this.groupFields[index];
				$(config.columns).each(function(index2, colData){
					if(groupFldName == colData.data)
					{
						groupCol.push(index2);
						groupColOrder.push([''+index2, 'asc']);
					}
				});
			});
			
			this.isGroupActive = groupCol.length > 0;
			
			if(this.isGroupActive)
			{
			   config.columnDefs = [
				  { "visible": false, "targets": groupCol }
			   ];
			   config.order = groupColOrder;
			   // following orderFixed config will be used in case of Group by. 
			   // In group by within group sorting will be achieved by this config.
			   config.orderFixed = groupColOrder;
			   config.displayLength = 25;
			   config.drawCallback = function ( settings, x ) {				 
				  let api = this.api();
				  let rows = api.rows( {page:'current'} ).nodes();
				  let orderedCol = '';
				  let orderedColArray = [];
				  let recordApi = api;
				  for(let index= 0; index < groupCol.length; index++)
				  {					  
				      let last=null;
					  let lastGroup = null;
					  let lastGroupIndex = index > 0 ? groupCol[index-1] : -1;
					  let groupColIndex = groupCol[index];
					  let groupColTitle = settings.aoHeader[0][groupCol[index]].cell.innerText;
					  
					  api.column(groupCol[index], {page:'current'} ).data().each( function ( group, i ) {
						  let prevGroup;
						  if(lastGroupIndex != (-1))
						  {
							prevGroup = recordApi.column(lastGroupIndex,{page:'current'}).data()[i];  
							if(prevGroup == undefined || prevGroup == null) prevGroup = '';
						  }
						  
						  if(group == undefined || group == null) group = '';
						  if ( (lastGroupIndex != (-1) && lastGroup !== prevGroup) || last !== group) {
							  $(rows).eq( i ).before(
									'<tr class="group"><td colspan="'+newColCount+'" style="font-weight:bold">'+groupColTitle+': '+group+'</td></tr>'
							  );
							  last = group;
							  lastGroup = prevGroup;
							  if(orderedColArray.indexOf(groupColTitle) == -1)
							  {
								  let sort = $('#'+_this.widgetId+'_group_'+groupColIndex).attr('order');
								  if(sort == undefined)
								  {
									  sort = 'asc';
								  }
								  let sortClass = sort == 'asc' ? 'sorting_asc' : 'sorting_desc';
								  orderedColArray.push(groupColTitle);
								  orderedCol += '<button id="'+_this.widgetId+'_group_'+groupColIndex+'" col="'+groupColIndex+'" order="'+sort+'" class="'+_this.widgetId+'_datatable-order-btn btn btn-raised btn-primary m-1 p-1 pl-2" style="font-size:10px; text-transform:inherit">';
								  orderedCol += '<span class="'+sortClass+'">'+groupColTitle+' '+'</span>';
								  orderedCol += '<i class="badge top badge-secondary material-icons"></i>';
								  orderedCol += '</button>';
							  }
						  }
					  } );        	  
				  }				  
				  $('#widget-body-'+_this.widgetId+' .sorting-label').html(orderedCol);
				  $('.'+_this.widgetId+'_datatable-order-btn').on( 'click', function () {
						let currentIndex = $(this).attr('col');
						let currentOrder = $(this).attr('order');
                                                currentOrder  = (currentOrder && currentOrder == 'asc') ? 'desc' : 'asc';
                                                $(this).attr('order',currentOrder);
						if('asc' == currentOrder)
						{
							$(this).find('span').removeClass('sorting_desc').addClass('sorting_asc');
						}
						else
						{
							$(this).find('span').removeClass('sorting_asc').addClass('sorting_desc');
						}
						//_this.datatable.order( [ currentOrder, currentSort ] ).draw();
						let presentSort = [];

                                                $('.'+_this.widgetId+'_datatable-order-btn').each(function(){
                                                    let colOrder2 = [];
                                                    let ctIndex = $(this).attr('col');
						    let ctOrder = $(this).attr('order');
                                                    if(currentIndex == ctIndex )
                                                    {
                                                      ctOrder = currentOrder;
                                                    }
						    colOrder2.push(ctIndex);
						    colOrder2.push(ctOrder);
                                                    presentSort.push(colOrder2);                                                    
                                                });
						
						_this.datatable.fnSort(presentSort);
				  });
			   }	
			}
			else
			{
				config.order = []
				config.drawCallback = function(settings){};
				config.columnDefs = [];
			}
			/*grouping end*/
			
        if(this.fields.rows && this.fields.rows.buttons && window.embedded !== true) // hide row level menu for datatable widget
		{
				config.columns.push({
				visible: true,
				targets: -1,
				orderable : false,
				render: function (data, type, full, meta) {
					  let buttonList = '<button id="row-action-menu-btn" class="btn btn-dark pl-2 pr-2 pt-2 pb-0 ml-3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="material-icons">more_vert</i></button>';
					  buttonList += '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="row-action-menu-btn">';
					  $(_this.fields.rows.buttons).each(function(index, metadata){
						 let btnHidden =  metadata.hidden != undefined ? metadata.hidden(_this.rootData, full) : false;
						 if(!btnHidden){
                            buttonList += '<a class="dropdown-item" id="'+_this.widgetId+'_rowaction_'+metadata.id+'_'+meta.row+'" href="javascript:void(0);">'+metadata.label+'</a>';
						 }
						 
						 $('#'+_this.widgetId+'_rowaction_'+metadata.id+'_'+meta.row).ready(function(){
							 $('#'+_this.widgetId+'_rowaction_'+metadata.id+'_'+meta.row).unbind('click');
							 $('#'+_this.widgetId+'_rowaction_'+metadata.id+'_'+meta.row).click(function(){
								metadata.callbacks.onclick(full);
							 });
						 });
						 
					  });
					  buttonList += '</div>';
				  return buttonList;
				}
			});
			
		}
					 
		this.datatable = $('#datatable_'+this.widgetId).dataTable( config );
		
		if (_this.sortMethod !== 'none') 
		{
			$('#widget-body-'+_this.widgetId+' .sorting-label').html('<span class="show-widget-hover">'+getDashLabel('datatable.multiSortInfo','Shift + Click column for multiple sorting')+'</span">');
			$(this.datatable).on( 'order.dt', function ( settings, x ) {
				
				let orderArray = [];
				orderArray = x.aaSorting;
				let orderedCol = '';
				if(_this.sortMethod == 'group')
				{
					let groupOrder = groupColOrder;
					if(!groupOrder || groupOrder  == null || groupOrder.length == 0)
	                                {
	                                    orderArray = [];
	                                }
	                                else if(groupOrder && groupOrder.length > 0){
										//&& (groupOrder.length != orderArray.length)
						//$.merge( groupOrder, orderArray );					
						//orderArray = groupOrder;
						orderArray = _this.utils.mergeSortArray(groupOrder, orderArray);
					}
				}
				$(orderArray).each(function(index){
					let colIndex = orderArray[index][0];
					let colOrder = orderArray[index][1];
					let colTitle = x.aoColumns[colIndex].sTitle;
					let indexGroupOrder = $('#'+_this.widgetId+'_group_'+colIndex).attr('order');
					if(indexGroupOrder != undefined && _this.sortMethod == 'group')
					{
					  //colOrder = indexGroupOrder == 'asc' ? 'desc' : 'asc';
					}
					orderedCol += '<button id="'+_this.widgetId+'_group_'+colIndex+'" col="'+colIndex+'" order="'+colOrder+'" class="btn btn-raised btn-primary m-1 p-1 pl-2" style="font-size:10px; text-transform:inherit">';
					orderedCol += '<span class="'+(colOrder == 'asc' ? 'sorting_asc' : 'sorting_desc')+'">'+colTitle+' '+'</span>';
					orderedCol += '<i class="badge top badge-secondary material-icons '+_this.widgetId+'_removeSort">clear</i>';
					orderedCol += '</button>';
				});
				$('#widget-body-'+_this.widgetId+' .sorting-label').html(orderedCol);
				$('.'+_this.widgetId+'_removeSort').unbind('click');
				$('.'+_this.widgetId+'_removeSort').click(function(){
					_this.removeSorting(this);
				});			
				
				if(orderArray.length == 0 && _this.widgetType != 'fxRatesWidget')
				{
					$('#widget-body-'+_this.widgetId+' .sorting-label').html('<span class="show-widget-hover">'+getDashLabel('datatable.multiSortInfo','Shift + Click column for multiple sorting')+'</span">');
				}
				
				let widgetId = _this.widgetId;	
				if(usrSortingPref.widgets){
					if(usrSortingPref.widgets[widgetId]){
						usrSortingPref.widgets[widgetId].savedSorting = orderArray;
					}
					else{
						usrSortingPref.widgets[widgetId] = {
							savedSorting : orderArray
						} 
					}
				}
			});
			this.refreshSorting();
		}
		$.fn.dataTable.ext.errMode = 'none';
		// following jQuery to solve issue of datatable header alignment issue with data records.
		$('.carousel-control-prev,.carousel-control-next, .carousel-indicators').unbind('click');
		$('.carousel-control-prev,.carousel-control-next, .carousel-indicators').click(function(){
			setTimeout(function(){ $('.dataTable').DataTable().columns.adjust(); }, 300);
		});
    };
	
    _thisWidget.getDataColumn = function(){
		let columns = [];
		let widgetId = _thisWidget.widgetId;
		let sortMethod = _thisWidget.sortMethod;
			$.each(this.fields.columns, function(index,data) {
			  if (data.render === undefined) {
                    data.render = function(data, type, row)
                    {
                        if(data != undefined)
                        {
                            return data;
                        }
                        return "";
                    };
                }
			  if(usrDashboardPref.widgets && usrDashboardPref.widgets[widgetId] && usrDashboardPref.widgets[widgetId].columns && usrDashboardPref.widgets[widgetId].columns.length!==0){
				  if(usrDashboardPref.widgets[widgetId].columns.indexOf(data.fieldName)>-1 && data.fieldName!=='ALL') {
					  columns.push({
							"title"     : data.label, 
							"data"      : data.fieldName,
							"type"      : DATATABLECOLTYPE[data.type],
							"orderable" : sortMethod === "none" ? false : (data.orderable != undefined ? data.orderable : true),				
							"render"    : data.render,
							"className" : data.type == 'amount' ?  "text-right" : ""
								
						});
				  }	 
			  } 
			  else if(data.visible=== undefined ? true : data.visible) {
				columns.push({
					"title"     : data.label, 
					"data"      : data.fieldName,
					"type"      : DATATABLECOLTYPE[data.type],
					"orderable" : sortMethod === "none" ? false : (data.orderable != undefined ? data.orderable : true),				
					"render"    : data.render,
					"className" : data.type == 'amount' ?  "text-right" : ""
						
				});
			  }
			});
		return columns;
	};
	
	_thisWidget.refreshSorting = function(){
		let presentSort = [];
		let refreshSorting = [];
		let widgetId = this.widgetId;
		let _this = this;
		if(usrSortingPref.widgets){
			if(usrSortingPref.widgets[widgetId]){
				refreshSorting = usrSortingPref.widgets[widgetId].savedSorting;
				let presentSort = [];
				if(refreshSorting && refreshSorting.length != 0)
				{
					let orderedCol = '';
					
					$(refreshSorting).each(function(index){
						let colOrder2 = [];
						let colIndex = refreshSorting[index][0];
						let colOrder = refreshSorting[index][1];
						let colTitle = _this.datatable.fnSettings().aoColumns[colIndex].sTitle;
						orderedCol += '<button col="'+colIndex+'" order="'+colOrder+'" class="btn btn-raised btn-primary m-1 p-1 pl-2" style="font-size:10px; text-transform:inherit">';
						orderedCol += '<span class="'+(colOrder == 'asc' ? 'sorting_asc' : 'sorting_desc')+'">'+colTitle+' '+'</span>';
						orderedCol += '<i class="badge top badge-secondary material-icons '+_this.widgetId+'_removeSort">clear</i>';
						orderedCol += '</button>';
						
						  colOrder2.push(colIndex);
						  colOrder2.push(colOrder);
						  presentSort.push(colOrder2);
					});
					
					$('#widget-body-'+_this.widgetId+' .sorting-label').html(orderedCol);
					$('.'+_this.widgetId+'_removeSort').unbind('click');
					$('.'+_this.widgetId+'_removeSort').click(function(){
						_this.removeSorting(this);
					});
				}
				else
				{
					$('#widget-body-'+_this.widgetId+' .sorting-label').html('<span class="show-widget-hover">'+getDashLabel('datatable.multiSortInfo','Shift + Click column for multiple sorting')+'</span">');
				}
				
				this.datatable.fnSort(presentSort);
			}
			else
			{
				this.datatable.fnSort([]);
			}
		}
	};
	
	_thisWidget.removeSorting = function(el){
		let colEle = $('#widget-body-'+this.widgetId+' thead')[0];
		let colIndex = $(el).parent().attr('col');
		let _this = this;
		let presentSort = [];
		
		$('.'+this.widgetId+'_removeSort').each(function(){
			let colOrder = [];
			let col = $(this).parent().attr('col');
			let order = $(this).parent().attr('order');
			if(col != colIndex)
			{
			  colOrder.push(col);
			  colOrder.push(order);
			  presentSort.push(colOrder);	
			}
		});
		
		this.datatable.fnSort(presentSort);
		$(el).parent().remove();
		
		let widgetId = _this.widgetId;
				
		if(usrSortingPref.widgets){
			if(usrSortingPref.widgets[widgetId]){
				usrSortingPref.widgets[widgetId].savedSorting = presentSort;
			}
		}
	};
	return _thisWidget;
}