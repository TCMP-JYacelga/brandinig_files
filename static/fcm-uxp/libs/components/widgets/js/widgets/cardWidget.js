const amountMaskingText = 'xxx,xxx.xx';

var card = function(){
	return cardWidget();
};

var counter = 0;

function cardWidget() {
	var _this = {};
	_this.constructor = function(metadata) {
		this.metadata = metadata;
	   };

   _this.initialize = function() {
	   let _this = this;
	   this.metadata.actions.refresh.callbacks.init(this.addData, this.metadata);
	   $.subscribe('com.finastra.widget.lastUpdatedTime', function(obj, data)
	   {
	      _this.lastUpdatedTime(data);
	   });
       if(this.metadata.seeMoreUrl !== undefined && this.metadata.seeMoreUrl !== '') {
			ActionButtonRenderer.viewMoreBind(this.metadata.widgetId, this.metadata.seeMoreUrl);
		}
	   // only for btrBankName & btrAccountType widgets
	   $('.balanceDetail').parent().unbind('click');
	   $('.balanceDetail').parent().click(function() {
			var dataSlideTo = $(this).attr('data-slide-to');
			$('button[data-target="#groupWidgetContainer_btrAccountSummary"]').parent().find('button').removeClass('active');
			$('button[data-target="#groupWidgetContainer_btrAccountSummary"][data-slide-to="'+dataSlideTo+'"]').addClass('active');
		   BTRBalancesHelper.toggleBalanceWidget();
	   });
   };

   _this.lastUpdatedTime = function(data){
	   	let widgetId = data.widgetId;	
		let updatedTime = data.updatedTime;	
		let updatedTimeDiv = '<div class="widget-action-lastupdated sameRow">';
		updatedTimeDiv += getDashLabel('lastUpdatedOn')+': '+updatedTime;
		updatedTimeDiv += '</div>';
	//	$('#widget-footer-'+widgetId).append(updatedTimeDiv);
		
   };

   _this.addData = function(rowData, metadata) {
	   
	if(metadata.widgetType == 'quickLink' || metadata.widgetType == 'broadcastMessage')
	{
		let targetDiv = metadata.target;
		
		$('#'+targetDiv).empty();
		$(rowData.dataArray).each(function(index, data){
			$('#'+targetDiv).append(data);
		});
	}
	else
	{
		   let targetDiv = metadata.target;
		   $('#'+targetDiv).empty();
		   let cardCount = 0;
		   $(rowData.dataArray).each(function(index, data){
			   if(cardCount < 5)
			   {
				   let isMoreView = isViewMoreVisible(data,metadata.widgetType);
				   let item = isMoreView ? '<div class="card-item" view-more=true>' : '<div class="card-item">';
				   if(metadata.widgetType == 'btrAccountType')
				   {
					   item += '<div class="item-block" onclick="BTRBalancesHelper.showAccountTypeDetails(this,accountBalances);" data-show=true>';				   
				   }
				   else if(metadata.widgetType == 'btrBankName')
				   {
					   item += '<div class="item-block" onclick="BTRBalancesHelper.showAccountTypeDetails(this,bankBalances);" data-show=true>';				   
				   }
				   else
				   {
					   item += '<div class="item-block" onclick="BTRBalancesHelper.showAccountTypeDetails(this,currencyBalances);" data-show=true>';				   
				   }
				   
				   
				   item += '<div class="item-label">'+data.label+'</div>';
				   item += '<div class="item-value"><span class="secure-hidden-text show">'+amountMaskingText+'</span><span class="amount secure-display-text">'+data.value+'</span></div>';
				   item += '<div class="item-icon uxg-chevron-default"></div>';
				   
				   item += '</div>';
				   item += '<div class="item-des">';
				   
				   
				   if(metadata.widgetType == 'btrBankName')
				   {
					   if(data.balances && data.balances.length > 0)
					   {
						   item += createBankBalanceView(data);
					   }
				   }
				   else if(metadata.widgetType == 'btrAccountType')
				   {
					   if(data.balances && data.balances.length > 0)
					   {
						   let maxLength = (data.balances.length > 2) ? 2 : data.balances.length ;
						   for(let cnt = 0 ; cnt < maxLength; cnt++)
						   {
							   let rec =data.balances[cnt]; 
							   if(cnt == 0)
							   {
								   item +='<div class="row">';
								   item +='<div class="col-sm-4 item-detail-header" >'+getDashLabel('btr.balances.bank')+'</div>';
								   item +='<div class="col-sm-4 item-detail-header" >'+getDashLabel('btr.balances.acctNmbr')+'</div>';
								   item +='<div class="col-sm-4 item-detail-header" >'+getDashLabel('typecode.'+ rec.typeCode)+'</div>';
								   item +='</div>';
							   }
								  
							   item +='<div class="row">';
							   item +='<div class="col-sm-4" style="">'+rec.bank+'</div>';
							   
							   let updatedTime= getDashLabel('lastUpdatedOn')+': '+dateFormat(new Date(rec.timeStamp),'|');
							   item +='<div class="col-sm-4" style="">'+rec.accNmbr+' ';
							   item +='<button type="button" class="btn btn-btr-info"  title="'+updatedTime+'">';
							   item +='<i class="material-icons color-grey info-icon">info</i></button></div>';

							   if(rec.equivalentAmount != null && window.embedded === undefined)
							   {
								   item += '<div class="col-sm-4" style=""><span class="secure-hidden-text show item-bank-amount">'+amountMaskingText+'</span><span class="secure-display-text baseAmount item-bank-amount">'+rec.baseAmount+'</span>';
								   item += '<span class="secure-display-text equivalentAmount item-bank-amount" >'+rec.equivalentAmount+'</span>';
								   if (window.embedded === undefined) 
								   {
								   		item += '<span class="compare-arrow"><i class="material-icons color-grey secure-display-text detailAmountToggle">compare_arrows</i></span>';
								   }
								   item += '</div>';
							   }
							   else
							   {
								   item +='<div class="col-sm-4" style=""><span class="secure-hidden-text show item-bank-amount">'+amountMaskingText+'</span><span class="amount secure-display-text baseAmount item-bank-amount" >'+rec.baseAmount+'</span></div>'; 
							   } 							   
							   item +='</div>';						   
						   }
					   }				   
				   }
				   else if(metadata.widgetType == 'btrCurrency')
				   {
					   if(data.balances && data.balances.length > 0)
					   {
						   let maxLength = (data.balances.length > 2) ? 2 : data.balances.length;
						   for(let cnt = 0 ; cnt < maxLength; cnt++)
						   {
							   let rec =data.balances[cnt]; 
							   if(cnt == 0)
							   {
								   item +='<div class="row">';
								   item +='<div class="col-sm-3 item-detail-header" >'+getDashLabel('btr.balances.bank')+'</div>';
								   item +='<div class="col-sm-3 item-detail-header" >'+getDashLabel('btr.balances.acctNmbr')+'</div>';
								   item +='<div class="col-sm-3 item-detail-header" >'+getDashLabel('btr.balances.accountType')+'</div>';
								   item +='<div class="col-sm-3 item-detail-header" >'+getDashLabel('btr.balances.amount')+'</div>';
								   item +='</div>';
							   }
								  
							   item +='<div class="row">';
							   item +='<div class="col-sm-3" style="">'+rec.bank+'</div>';
							   let updatedTime= getDashLabel('lastUpdatedOn')+': '+dateFormat(new Date(rec.timeStamp),'|');
							   
							   item +='<div class="col-sm-3" style="">'+rec.acctNmbr+' ';
							   item +='<button type="button" class="btn btn-btr-info" title="'+updatedTime+'">';
							   item +='<i class="material-icons color-grey info-icon">info</i></button></div>';
							   item +='<div class="col-sm-3" style="">'+getDashLabel('accountType.'+ rec.typeCode)+'</div>';
							//   item +='<div class="col-sm-3" style=""><span class="secure-hidden-text show item-bank-amount">'+amountMaskingText+'</span><span class="amount secure-display-text baseAmount item-bank-amount" >'+rec.baseAmount+'</span></div>'; 							   
							   if(rec.equivalentAmount != null)
							   {
								   item += '<div class="col-sm-3" style=""><span class="secure-hidden-text show item-bank-amount">'+amountMaskingText+'</span><span class="secure-display-text baseAmount item-bank-amount">'+rec.baseAmount+'</span>';
								   item += '<span class="secure-display-text equivalentAmount item-bank-amount" >'+rec.equivalentAmount+'</span>';
								   if (window.embedded === undefined) 
								   {
									   item += '<span class="compare-arrow"><i class="material-icons color-grey secure-display-text detailAmountToggle">compare_arrows</i></span>';
								   }
								   item += '</div>';
							   }
							   else
							   {
								   item +='<div class="col-sm-3" style=""><span class="secure-hidden-text show item-bank-amount">'+amountMaskingText+'</span><span class="amount secure-display-text baseAmount item-bank-amount" >'+rec.baseAmount+'</span></div>'; 
							   } 						   
							   
							   item +='</div>';						   
						   }
					   }				   
				   }
				   item += '</div>';
				   $('#'+targetDiv).append(item);
			   }
			   cardCount++;
		   });
		   
		   $('.detailAmountToggle').unbind('click');
		   $('.detailAmountToggle').click(function(ele) {
			   if($(this) && $(this).parent())
			   {
			   	   let parent = $(this).parent();
			   	   if(parent && $(parent).parent())
			   	   {
			   		   parent = $(parent).parent();
			   	   }
			   	   let baseAmount = null, equivalentAmount = null;
			   	   if(parent.find('.baseAmount'))
			   	   {
			   		   baseAmount = parent.find('.baseAmount');
			   	   }	   
			   	   // toggle class based upon existing class
			   	   if(baseAmount != null &&  $(baseAmount).hasClass('d-none'))
			   	   {
			   		   baseAmount.removeClass('d-none');
			   	   }
			   	   else
			   	   {
			   		   baseAmount.addClass('d-none');
			   	   }
			   	   
			   	   if(parent.find('.equivalentAmount'))
			   	   {
			   		   equivalentAmount = parent.find('.equivalentAmount');
			   	   }
			   	   if(equivalentAmount != null && $(equivalentAmount).hasClass('d-none'))
			   	   {
			   		   equivalentAmount.removeClass('d-none');
			   	   }
			   	   else
			   	   {
			   		   equivalentAmount.addClass('d-none');
			   	   }			   	   
			   }
		   });
		   
		   if(!rowData.dataArray)
		   {
			   rowData.entCurrency = btrAccCurrency;
			   rowData.entBalance = '0.00';
		   }
		   else
		   {
			   let elementId = metadata.widgetId + '_length';
			   $('#'+targetDiv).append('<input type="hidden" id="'+elementId+'" name="'+elementId+'" value="'+rowData.dataArray.length+'">');
			   if(rowData.dataArray.length == 1)
			   {
				   BTRBalancesHelper.renderSingleView(metadata.widgetId, 1);
				   
			   }   
		   }
		   // if more than 5 banks/Accounts/Currency
		   if(rowData && rowData.dataArray && rowData.dataArray.length > 5 )
		   {
			   $('#groupWidgetContainer_'+metadata.widgetId).find('.viewMore').removeClass('d-none');
		   }
		   else
		   {
			   // if single card with more than 2 detail records 
			   if(rowData && rowData.dataArray && rowData.dataArray.length == 1 && rowData.dataArray[0] 
			   			&& rowData.dataArray[0].balances && rowData.dataArray[0].balances.length > 2 )
			   {
				   $('#groupWidgetContainer_'+metadata.widgetId).find('.viewMore').removeClass('d-none');				   
			   }
			   else
			   {
				   $('#groupWidgetContainer_'+metadata.widgetId).find('.viewMore').addClass('d-none');				   
			   }

		   }
			   if(_strUserLocale == 'ar_BH'){
				   
				   let enterpriceBal = '<div class="dash-header-enterprice" style="text-align:left !important;">';
					   enterpriceBal += '<div class="uxg-body-2 mb-0 mr-2" >'+getDashLabel('enterpriseBalance.title')+'</div>';
					   enterpriceBal += 	'<div class="secure-text">';
					   enterpriceBal += 	'<h3>';
					   enterpriceBal += 			'<span class="currency">'+rowData.entCurrency+'</span>';
					   enterpriceBal += 			'<span class="secure-hidden-text show mr-2">'+amountMaskingText+'</span>';
					   enterpriceBal += 			'<span class="amount secure-display-text mr-2" style="display: inline;">'+rowData.entBalance+'</span>';
					   enterpriceBal += 	'</h3>';
					   enterpriceBal +=  '<div class="btn-group btn-group-toggle secure-show-btn" data-toggle="buttons">';
						enterpriceBal +=     '<button type="button" id = "btn_visible" class="btn secure-hidden-text show" aria-pressed="false">';
						enterpriceBal +=       '<i class="material-icons color-white">visibility</i> </button>';
						enterpriceBal +=     '<button type="button" id = "btn_visible_off" class="btn" aria-pressed="false">'
						enterpriceBal +=        '<i class="material-icons color-white">visibility_off</i> </button>'
						enterpriceBal +=   '</div>'
					   enterpriceBal +=     '</div>';
					   enterpriceBal += '</div>';
					
						$('.dash-header-enterprice').remove();
						$('#groupWidgetContainer_btrAccountSummary').prepend(enterpriceBal);
			   }
			   else{
				   let enterpriceBal = '<div class="dash-header-enterprice">';
			   enterpriceBal += '<div class="uxg-body-2 mb-0 mr-2" >'+getDashLabel('enterpriseBalance.title')+'</div>';
			   enterpriceBal += 	'<div class="secure-text">';
			   enterpriceBal += 	'<h3>';
			   enterpriceBal += 			'<span class="currency">'+rowData.entCurrency+'</span>';
			   enterpriceBal += 			'<span class="secure-hidden-text show mr-2">'+amountMaskingText+'</span>';
			   enterpriceBal += 			'<span class="amount secure-display-text mr-2" style="display: inline;">'+rowData.entBalance+'</span>';
			   enterpriceBal += 	'</h3>';
			   enterpriceBal +=  '<div class="btn-group btn-group-toggle secure-show-btn" data-toggle="buttons">';
				enterpriceBal +=     '<button type="button" id = "btn_visible" class="btn secure-hidden-text show" aria-pressed="false">';
				enterpriceBal +=       '<i class="material-icons color-white">visibility</i> </button>';
				enterpriceBal +=     '<button type="button" id = "btn_visible_off" class="btn" aria-pressed="false">'
				enterpriceBal +=        '<i class="material-icons color-white">visibility_off</i> </button>'
				enterpriceBal +=   '</div>'
			   enterpriceBal +=     '</div>';
			   enterpriceBal += '</div>';
			
			$('.dash-header-enterprice').remove();
			$('#groupWidgetContainer_btrAccountSummary').prepend(enterpriceBal);
			   }
			
			$('.secure-show-btn #btn_visible_off').click(function(){
				$('.secure-show-btn #btn_visible').show();
				$('.secure-show-btn #btn_visible_off').hide();
				$('.secure-hidden-text').show();
				$('.secure-display-text').hide();

				$.each($('.baseAmount, .equivalentAmount'), function( index, cfg ) {
					$(cfg).addClass('d-none');
				});	
				
				localStorage.removeItem('EntBalanceMasking');
				localStorage.setItem('EntBalanceMasking', 'mask');
			});
			
			$('.secure-show-btn #btn_visible').click(function(){
				$('.secure-show-btn #btn_visible_off').show();
				$('.secure-show-btn #btn_visible').hide();
				$('.secure-hidden-text').hide();
				$('.secure-display-text').show();
			 
				$.each($('.baseAmount'), function( index, cfg ) {
					$(cfg).removeClass('d-none');
				});
				
				$.each($('.equivalentAmount'), function( index, cfg ) {
					$(cfg).addClass('d-none');
				});
				
				localStorage.removeItem('EntBalanceMasking');
				localStorage.setItem('EntBalanceMasking', 'unmask');
			});
			
			let entBalanceMasking = localStorage.getItem('EntBalanceMasking');
			if('unmask' == entBalanceMasking)
			{	
				$('.secure-show-btn #btn_visible').trigger('click');
			}
			else
			{		
				$('.secure-show-btn #btn_visible_off').trigger('click');
			}
			// remove ellipsis menu for BTR Balance Widget
			if(metadata.widgetType =='btrAccountType' || metadata.widgetType =='btrBankName' || metadata.widgetType == 'btrCurrency')
			{
				if($('#groupWidgetContainer_'+metadata.widgetId) && $('#groupWidgetContainer_'+metadata.widgetId).find('#widget-action-menu-btn'))
					$('#groupWidgetContainer_'+metadata.widgetId).find('#widget-action-menu-btn').addClass('d-none');
			}
	}
};
 return _this;
}

function isViewMoreVisible(data, widget)
{
	let flag = false;
	if(data.balances && data.balances.length > 0)
	{
		if(widget == 'btrBankName' || widget == 'btrAccountType' || widget == 'btrCurrency' )
		{
			if(data.balances.length > 2)
			{
				flag =  true;
			}
			else
			{
				flag =  false;
			}
		}
		else
		{
			flag =  false;
		}		
	}
	return flag;
}
function createBankBalanceView(data)
{
	let dom = '';
	let counter = 0;
	
	if(data && data.balances && data.balances.length)
	{
		counter = (data.balances.length > 2) ? 2 : data.balances.length;
		dom +=createBankBalanceDom(data,counter);	
	}
	return dom;   
}

function createBankBalanceDom(data, totalNmbrs)
{
	let item = '';
	
	for(let counter = 0; counter < totalNmbrs; counter++)
	{
		   if(counter == 0)
		   {
			   item +='<div class="row">';
			   item +='<div class="col-sm-4 item-detail-header" >'+getDashLabel('btr.balances.accountType')+'</div>';
			   item +='<div class="col-sm-4 item-detail-header" >'+getDashLabel('btr.balances.acctNmbr')+'</div>';
			   item +='<div class="col-sm-4 item-detail-header" >'+getDashLabel('btr.balances.amount')+'</div>';
			   item +='</div>';
		   }
		   
		   item +='<div class="row">';
		   item +='<div class="col-sm-4" style="">'+getDashLabel( 'accountType.initial.'+data.balances[counter].accountType)+'</div>';

		   let updatedTime= getDashLabel('lastUpdatedOn')+': '+dateFormat(new Date(data.balances[counter].timeStamp),'|');
		   item +='<div class="col-sm-4" style="">'+data.balances[counter].acctNmbr+' ';
		   item +='<button type="button" class="btn btn-btr-info" title="'+updatedTime+'">';
		   item +='<i class="material-icons color-grey info-icon">info</i></button></div>';
		   
		   
		   if(data.balances[counter].equivalentAmount != null && window.embedded === undefined)
		   {
			   item +='<div class="col-sm-4" style=""><span class="secure-hidden-text show item-bank-amount">'+amountMaskingText+'</span><span class="secure-display-text baseAmount item-bank-amount">'+data.balances[counter].baseAmount+'</span>';
			   item +='<span class="secure-display-text equivalentAmount item-bank-amount" >'+data.balances[counter].equivalentAmount+'</span>';
			   if (window.embedded === undefined) 
			   {
				   item += '<span class="compare-arrow"><i class="material-icons color-grey secure-display-text detailAmountToggle">compare_arrows</i></span>';
			   }
			   item += '</div>';
		   }
		   else
		   {
			   item +='<div class="col-sm-4" style=""><span class="secure-hidden-text show item-bank-amount">'+amountMaskingText+'</span><span class="amount secure-display-text baseAmount item-bank-amount" >'+data.balances[counter].baseAmount+'</span></div>'; 
		   }
		   
		//   item +='<div class="col-sm-4" style=""><span class="secure-hidden-text show item-bank-amount">'+amountMaskingText+'</span><span class="amount secure-display-text baseAmount item-bank-amount" >'+data.balances[counter].baseAmount+'</span></div>'; 
		   item +='</div>';				   
	}
	return item;
}