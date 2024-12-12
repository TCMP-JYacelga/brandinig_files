function retrieveExtGrid(strUrl , strval)
{	
	var instStatus = strval.options[strval.selectedIndex].value;
	document.getElementById('instStatus').value = instStatus ;
	var frm = document.forms["frmMain"];
	var execId = document.getElementById("agerExecId").value;
	var filterFlag = document.getElementById("fltrFlag").value;
//	var instStatus = document.getElementById("instStatus").value;
	// me.setDataForFilter();
	/*strUrl = strUrl + "?$agerExecId=" + execId
			+ "&$fltrFlag=" + filterFlag + "&$instStatus="
			+ instStatus + "&csrfTokenName="
			+ csrfTokenValue;*/
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function back(strUrl)
{
	var frm = document.forms['frmMain'];
	frm.action = strUrl+ "?&"+ "$mode=readView";
	frm.method='POST';
	frm.target='';
	frm.submit();
	return true;
	
}

function showMovementDtlReq( movId,fltrType,exeId )
{
	var csrf_name = document.getElementById( "csrfTok" ).name;
	var csrf_token = document.getElementById( csrf_name ).value;
	var strData = {};
	strData[ 'MOVID' ] = movId;
	strData[ 'FLTRTYPE' ] = fltrType;
	strData[ 'EXEID' ] = exeId;
	strData[ csrf_name ] = csrf_token;
	$.ajax( {
		type : 'POST',
		data : strData,
		url : 'agreementSweepQueryActDtl.form',
		dataType : 'html',
		success : function( data )
		{
			var $response = $( data );
			$( '#movementDetails' ).html(
					$response.find( '#movementDetailsView' ) );
			$( '#movementDetails' ).dialog( {
				bgiframe : true,
				autoOpen : false,
				width : "auto",
				height : "auto", 
				resizable : true,
				title : getLabel('movementDetail', 'Movement Detail'),
				modal : true,
				buttons :[
					{
						text:getLabel('btnOk','Ok'),
						click : function() {
							$(this).dialog("close");
						}
					}
				]
			} );
			$( '#dialogMode' ).val( '1' );
			$( '#movementDetails' ).dialog( 'open' );
		}
	} );
}

function downloadXlsComputationSummary()
{
	var strUrl = "downloadXlsAgreementSweepQueryList.srvc?" + csrfTokenName + '=' + csrfTokenValue ;
	strUrl = strUrl + '&' + "$pageType=" + pageType + '&' + "$structureType=" + structureType + '&' + '$structureSubType=' + structureSubType;
	if( !( typeof selectedDate === 'undefined' ) )
	{
		strUrl = strUrl + '&' + "$selectedDate=" + selectedDate;
	}
	var frm = document.getElementById( "frmMain" );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


function downloadXls(me,strUrl)
{
	if (me.className.startsWith("imagelink grey"))
	{
		return;
	}
	else
	{
		var frm = document.forms["frmMain"]; 
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
	
}
function updateAppliedFilterSection() {
	var component = $('#sweepQueryinstStatus').find('select');
	var strSelectedItem = component.closest(".form-group").find('label.frmLabel').text();
	var strSelectedValue = $(component).find(':selected').text();
	var appliedFiltersRowList = $(component).closest("#filterByPanelDiv").find("#appliedFiltersRow").find("ul");
	var filterItem = "";
	if(!Ext.isEmpty(strSelectedValue) && strSelectedValue !== "All") {
		appliedFiltersRowList.empty();
		filterItem = '<li><a class="applied-filter-item" onclick="clearFilter(this);" data-filtername="'+ strSelectedItem + '">' + strSelectedItem + ' ' + strSelectedValue + '<i class="fa fa-times-circle"></i></a></li>';
		appliedFiltersRowList.append(filterItem);
		/*$('<a class="inline_block t7-anchor" onclick="">' + 'Clear Filters' + '</a>').insertAfter(appliedFiltersRowList);*/
		appliedFiltersRowList.after('<a class="inline_block t7-anchor clear-link" onclick="clearAllFilters();">' + 'Clear Filters' + '</a>');
		
		setTimeout(function() {
			var q = Ext.create('Ext.tip.ToolTip', {
			    target: appliedFiltersRowList.find('li').get(0),
			    html: strSelectedItem.trim() + ' ' + strSelectedValue.trim()
			});
		}, 1000);
	}
}

function clearFilter(item) {
	if(jQuery.trim($(item).data("filtername")) === "Movement") {
		var component = $('#sweepQueryinstStatus').find('select');
		component.val('All').change();
	}
}

function clearAllFilters() {
	var component = $('#sweepQueryinstStatus').find('select');
	component.val('All').change();
}

$(document).on('click', '.panel-heading.filter-toggle-handler', function(e) {
	$(this).find('.filter-collapse').toggleClass('fa-caret-up fa-caret-down');
	$(this).find('#appliedFilters').text('');
	$(this).siblings('div.panel-body').slideToggle(function(){
		if($(this).is(':visible')) {
			// uncollapsed
			if(Ext) {
				var extToolTip = Ext.getCmp('sweepQueryResultfilterTip');
				if(!Ext.isEmpty(extToolTip)) {
					extToolTip.destroy();
				}
			}
		} else {
			// collapsed
			var appliedFilters = "";
			var bodyPanel = $(this);
			var formGroups = bodyPanel.find(".form-group");
			var collapsedAppliedFilters = $(bodyPanel).siblings('div.panel-heading').find('#appliedFilters');
			formGroups.each(function(index, formGroupItem) {
				var field = "";
				var value = "";
				if($(formGroupItem).find('select').length > 0) {
					field = jQuery.trim($(formGroupItem).find('label').text());
					value = jQuery.trim($(formGroupItem).find('select').find(':selected').text());
					
					if(value === "All") {
						field = "";
						value = "";
					}
				} else {
					/*field = jQuery.trim($(formGroupItem).find('label').text());
					value = jQuery.trim($(formGroupItem).find('span').text());*/
				}
				if(!(Ext.isEmpty(field) || Ext.isEmpty(value))) {
					if(appliedFilters) {
						appliedFilters = appliedFilters + ", ";
					}
					appliedFilters = appliedFilters + field + " " + value;
				}
				else{
					
				}
			});
			var panelHeadingElem = collapsedAppliedFilters.closest('.panel-heading');
			var maxWidth = panelHeadingElem.width();
			if(Ext.isEmpty(appliedFilters)) {
				appliedFilters = getLabel("nofilterapplied", "No Filters Applied");
			}
			collapsedAppliedFilters.text(appliedFilters);
			collapsedAppliedFilters.closest('.panel-title').css('overflow', 'hidden');
			collapsedAppliedFilters.closest('.panel-title').css('text-overflow', 'ellipsis');
			collapsedAppliedFilters.closest('.panel-title').css('white-space', 'nowrap');
			collapsedAppliedFilters.closest('.panel-title').css('max-width', maxWidth + 'px');
			/*collapsedAppliedFilters.attr('title', appliedFilters);*/
			if(Ext && !Ext.isEmpty(appliedFilters)) {
				Ext.create('Ext.tip.ToolTip', {
					id : 'sweepQueryResultfilterTip',
				    target: panelHeadingElem.get(0),
				    html: appliedFilters
				});
			}
		}
	});
});