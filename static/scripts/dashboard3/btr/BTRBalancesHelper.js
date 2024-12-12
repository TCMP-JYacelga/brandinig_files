BTRBalancesHelper = {};

BTRBalancesHelper.unmaskAmount = function() {
	
	$('.secure-hidden-text').hide();
	$('.secure-display-text').show();
	
	$.each($('.baseAmount'), function( index, cfg ) {
		$(cfg).removeClass('d-none');
	});

	$.each($('.equivalentAmount'), function( index, cfg ) {
		$(cfg).addClass('d-none');
	});
				
}

BTRBalancesHelper.showAccountTypeDetails = function(elementId,data)
{
	// ele chevron
	let ele = $(elementId).find('.item-icon');
	let parentDiv = $(elementId);  // item-block
	let nextParent = $(parentDiv).parent(); // card-item
	let mainParent = $(nextParent).parent(); // card-body widget-card-body      widget-body-btrAccountType
	let cardDiv = $(mainParent).parent();  // parent 
//	let widget = 'groupWidgetContainer_' +widgetId;
	let flag = $(parentDiv)[0].getAttribute('data-show');

/// AFTER RTL CHANGES
		
		if(flag === 'true')
		{	
			if(_strUserLocale == "ar_BH")
			{
				if($(mainParent).find('.card-item') &&
						$(mainParent).find('.card-item').css('display'))
				{
					$(mainParent).find('.card-item').css('display','none');
				}
					
				$(parentDiv).css('float', 'right');
				$(parentDiv).addClass('item-block-left');
				$(nextParent).removeAttr('style');
				$(nextParent).addClass('item-show');
				$(nextParent).find('.item-des').addClass('item-desc-left');
				$(nextParent).find('.item-des').addClass('item-desc-left-rtl');
				$(nextParent).find('.item-des').addClass('field-rtl');
				$(nextParent).find('.item-des').css('display','block');
				//$(nextParent).find('.item-des').css('float', 'left');
				$(parentDiv)[0].setAttribute('data-show', false);
				$(ele)[0].setAttribute('class','item-icon item-icon-rtl uxg-chevron-open');
				$(parentDiv).addClass("item-block-rtl");
				BTRBalancesHelper.toggleViewMore(nextParent, cardDiv);
			}
			else
			{
				if($(mainParent).find('.card-item') &&
				   				$(mainParent).find('.card-item').css('display'))
		   		{
					$(mainParent).find('.card-item').css('display','none');
		   		}		
				$(parentDiv).css('float', 'left');
				$(parentDiv).addClass('item-block-left');
				$(nextParent).removeAttr('style');
				$(nextParent).addClass('item-show');
				$(nextParent).find('.item-des').addClass('item-desc-left');
				$(nextParent).find('.item-des').css('display','block');
				$(nextParent).find('.item-des').css('float', 'right');
				$(parentDiv)[0].setAttribute('data-show', false);
				$(ele)[0].setAttribute('class','item-icon uxg-chevron-default' );
				BTRBalancesHelper.toggleViewMore(nextParent, cardDiv);
			}
		}
		else // ELSE OF RTL CHECK
		{
			if(_strUserLocale == "ar_BH")
			{
				if($(mainParent).find('.card-item') &&
					$(mainParent).find('.card-item').css('display'))
				{
					$(mainParent).find('.card-item').css('display','block');
					$(mainParent).find('.card-item').removeAttr('style');
				}		
				$(parentDiv).removeAttr('style');

				$(parentDiv).removeClass('item-block-left');
				$(nextParent).removeClass('item-show');
				$(nextParent).find('.item-des').removeClass('item-desc-left');
				$(nextParent).find('.item-des').removeClass('item-desc-left-rtl');
				$(nextParent).find('.item-des').css('display','none');
				$(nextParent).find('.item-des').removeAttr('style');
				$(nextParent).find('.item-des').addClass('field-rtl');
				$(parentDiv)[0].setAttribute('data-show', true);
				$(ele)[0].setAttribute('class','item-icon item-icon-rtl uxg-chevron-default' );
				$(parentDiv).addClass("item-block-rtl");
				if(data && data.length > 5)
				{
					$(cardDiv).find('.viewMore').removeClass('d-none');
				}
				else
				{
					$(cardDiv).find('.viewMore').addClass('d-none');
				}
			}
			else
			{
				if($(mainParent).find('.card-item') &&
								$(mainParent).find('.card-item').css('display'))
		   		{
					$(mainParent).find('.card-item').css('display','block');
					$(mainParent).find('.card-item').removeAttr('style');
		   		}		
				$(parentDiv).removeAttr('style');
				
				$(parentDiv).removeClass('item-block-left');
				$(nextParent).removeClass('item-show');
				$(nextParent).find('.item-des').removeClass('item-desc-left');
				$(nextParent).find('.item-des').css('display','none');
				$(nextParent).find('.item-des').removeAttr('style');
				$(parentDiv)[0].setAttribute('data-show', true);
				$(ele)[0].setAttribute('class','item-icon uxg-chevron-open' );
				if(data && data.length > 5)
				{
					$(cardDiv).find('.viewMore').removeClass('d-none');
				}
				else
				{
					$(cardDiv).find('.viewMore').addClass('d-none');
				}
			}
		}
	
	BTRBalancesHelper.resetDetailAmountView();
}
// this method to hide equivalentBaseAmount and un-hide baseAmount
BTRBalancesHelper.resetDetailAmountView = function()
{
	let amountMask = BTRBalancesHelper.isAmountMasked();
	if(amountMask)
	{
		$.each($('.baseAmount, .equivalentAmount'), function( index, cfg ) {
			$(cfg).addClass('d-none');
		});		
	}
	else
	{
		$.each($('.baseAmount'), function( index, cfg ) {
			$(cfg).removeClass('d-none');
		});
		
		$.each($('.equivalentAmount'), function( index, cfg ) {
			$(cfg).addClass('d-none');
		});
	}
}
BTRBalancesHelper.isAmountMasked = function()
{
	if (window.embedded) {
		return false;
	}
	if($('#btn_visible') && $('#btn_visible')[0] && $('#btn_visible')[0].getAttribute('style') && 
			$('#btn_visible')[0].getAttribute('style') && $('#btn_visible')[0].getAttribute('style').indexOf('none') != -1)
	{
		return false;
	}
	return true;
}
BTRBalancesHelper.toggleViewMore =function(ele, cardDiv)
{
	if(ele && ele[0] && ele[0].getAttribute('view-more') && ele[0].getAttribute('view-more') == 'true')
	{
		$(cardDiv).find('.viewMore').removeClass('d-none');
		
	}
	else
	{
		$(cardDiv).find('.viewMore').addClass('d-none');
	}
}
BTRBalancesHelper.getCurActiveWidget = function()
{
	let curActiveWidget = null;
	let widgetId = null;
	let sliders = $('#groupWidgetContainer_btrAccountSummary').find('.carousel-item');
	
	if(sliders && sliders.length > 0)
    {
		$(sliders).each(function(index, slider){		
			if(slider.getAttribute('class').indexOf('active') > 0)
			{
				widgetId = slider.id;
			}
		});
    }
	if(widgetId != null && widgetId.indexOf('_') > 0)
	{
		let arrWidgetId = widgetId.split('_');
		curActiveWidget = arrWidgetId[1];
	}
	return curActiveWidget;
}

BTRBalancesHelper.toggleBalanceWidget = function()
{
	let widgetId=null;
	let mainParentId = null;
	let hiddenElement = null;
	let widgetList = [];
	let widget = {};
	let activeWidget = BTRBalancesHelper.getCurActiveWidget();
	
	if(activeWidget == 'btrBankName')
	{
		widget = {};
		widget.mainParentId = 'widget-body-btrAccountType';
		widget.hiddenElement = 'btrAccountType_length';
		widget.widgetId = 'btrAccountType';
		widgetList.push(widget);

		widget = {};
		widget.mainParentId = 'widget-body-btrCurrency';
		widget.hiddenElement = 'btrCurrency_length';
		widget.widgetId = 'btrCurrency';
		widgetList.push(widget);
		
	}
	else if(activeWidget == 'btrAccountType')
	{
		widget = {};
		widget.mainParentId ='widget-body-btrBankName';
		widget.hiddenElement = 'btrBankName_length';
		widget.widgetId = 'btrBankName';
		widgetList.push(widget);

		widget = {};
		widget.mainParentId = 'widget-body-btrCurrency';
		widget.hiddenElement = 'btrCurrency_length';
		widget.widgetId = 'btrCurrency';
		widgetList.push(widget);		
	}
	else
	{
		widget = {};
		widget.mainParentId = 'widget-body-btrAccountType';
		widget.hiddenElement = 'btrAccountType_length';
		widget.widgetId = 'btrAccountType';
		widgetList.push(widget);
		
		widget = {};
		widget.mainParentId ='widget-body-btrBankName';
		widget.hiddenElement = 'btrBankName_length';
		widget.widgetId = 'btrBankName';
		widgetList.push(widget);		
	}
	
	for (let counter = 0; counter < widgetList.length; counter++)
	{
		BTRBalancesHelper.resetInActiveWidget(widgetList[counter].mainParentId, widgetList[counter].hiddenElement, widgetList[counter].widgetId);
	}
	BTRBalancesHelper.resetDetailAmountView();
}
BTRBalancesHelper.resetInActiveWidget = function(mainParentId, hiddenElement, widgetId)
{
	let mainParent = $('#'+mainParentId);
	let nextParent =  $('#'+mainParentId).find('.card-item');
	let parent = $('#'+mainParentId).find('.item-block');
	let ele = $('#'+mainParentId).find('.item-icon');
	let cardDiv = $(mainParent).parent();
	
	
	if($(mainParent).find('.card-item') &&
			$(mainParent).find('.card-item').css('display'))
		{
		$(mainParent).find('.card-item').css('display','block');
		$(mainParent).find('.card-item').removeAttr('style');
		}		
	$(parent).removeAttr('style');
	
	$(parent).removeClass('item-block-left');
	$(nextParent).removeClass('item-show');
	$(nextParent).find('.item-des').removeClass('item-desc-left');
	$(nextParent).find('.item-des').removeClass('item-desc-left-rtl');
	$(nextParent).find('.item-des').css('display','none');
	$(nextParent).find('.item-des').removeAttr('style');
	$(parent).each(function(index, item){	
		$(item)[0].setAttribute('data-show', true);
	});	
	$(ele).each(function(index, singleElement){	
		$(singleElement)[0].setAttribute('class','item-icon uxg-chevron-default' );		
	});
	
	let dataLength = BTRBalancesHelper.getDataLength(mainParent);
	if(dataLength != null && dataLength.length > 5)
	{
		$(cardDiv).find('.viewMore').removeClass('d-none');
	}
	else
	{
		$(cardDiv).find('.viewMore').addClass('d-none');
	}	
	BTRBalancesHelper.renderSingleView(widgetId);	
}
BTRBalancesHelper.getDataLength = function (ele)
{
	if(ele && ele[0])
	{
		let id = ele[0].id;
		if(id.indexOf('btrAccountType') != -1)
		{
			return accountBalances;
		}
		else if(id.indexOf('btrBankName') != -1)
		{
			return bankBalances;
		}
		else if(id.indexOf('btrCurrency') != -1)
		{
			return currencyBalances;
		}
		else
		{
			return 0;
		}		
	}
	return 0;
}
// In case of only single account type/ single Bank, be default expanded view will render
BTRBalancesHelper.renderSingleView = function (widgetId, dataLength)
{
	if($('#groupWidgetContainer_'+widgetId) && $('#groupWidgetContainer_'+widgetId).find('.item-block') &&
			$('#groupWidgetContainer_'+widgetId).find('.item-block').length == 1)
	{
		let ele = $('#groupWidgetContainer_'+widgetId).find('.item-block');
		$(ele)[0].setAttribute('data-show', true);
		BTRBalancesHelper.showAccountTypeDetails($('#groupWidgetContainer_'+widgetId).find('.item-block'), dataLength)
	}
}