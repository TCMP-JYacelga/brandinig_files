const WidgetContainerUtils = {
	containerIds : {
	   'actionMenuBtn' : 'widget-action-menu-btn',
	   'cardBody'      : 'widget-body-',
	   'cardFooter'    : 'widget-footer-'
	},   
	containerClasses : {
	   'card'       : 'card widget-card',
	   'cardBody'   : 'card-body widget-card-body',
	   'fxCardBody'   : 'card-body fx-widget-card-body',
	   'paymentsCardBody' : 'card-body widget-card-body payments-card-body',
	   'payablesCardBody' : 'card-body widget-card-body payables-card-body',
	   'bannerCardBody' : 'card-body banner-card-body',
	   'cardFooter' : 'card-footer widget-card-footer',
	   'cardHeader' : 'card-header widget-card-header',
	   'actionMenu' : 'widget-action-menu'
	},   
	containerIcons : {
	   'menuDropdown' : '<i class="material-icons header-margin pr-2">more_vert</i>'
	}
};

var widgetContainer = {
	'initialize': function (props) {
		widgetId = props.widgetId;
		metadata = props.metadata;
		usrDashboardPref = props.usrDashboardPref || window.usrDashboardPref;
		widgetType = metadata.widgetType;
	    utils = WidgetContainerUtils;
		_thisWidgetContainer = '';
		_thisWidgetContainer = widgetContainer.createContainer(widgetId, widgetType, metadata.title, metadata.desc, usrDashboardPref);
			
		if(metadata.actions)
		{
			_thisWidgetContainer = widgetContainer.addContainerAction(widgetId, _thisWidgetContainer, metadata);
		}
		return _thisWidgetContainer;
    },
	
    'addContainerAction': function(widgetId, widgetContainer, metadata){ 
        var action = actions();
        action.constructor(widgetId, widgetContainer, metadata);
        return action;
	},	
	
	'createContainer': function(widgetId, widgetType, widgetTitle, widgetDesc, usrDashboardPref) {
		let card, cardHeader, cardBody, cardFooter, topLable, marginClass = 'ml-auto';
		if(usrDashboardPref.widgets === undefined || usrDashboardPref.widgets === 'undefined')
		{
			usrDashboardPref.widgets = window.widgetMap;
		}
		
		if(usrDashboardPref.widgets.hasOwnProperty(widgetId))
		{
			let wc = usrDashboardPref.widgets[widgetId];
			if(wc.hasOwnProperty('title'))
			{
				widgetTitle = usrDashboardPref.widgets[widgetId].title;
			}
			if(wc.hasOwnProperty('desc'))
			{
				widgetDesc = usrDashboardPref.widgets[widgetId].desc;
			}
		}
		if(_strUserLocale == 'ar_BH'){
			marginClass = 'mr-auto';			
		}		
		let widgetHeaderTitle =  '<h5 title="'+widgetDesc+'" class="widget-title pt-1 header-margin text-nowrap text-truncate">'+widgetTitle+'</h5>';
		if(_strUserLocale == 'ar_BH'){
				widgetHeaderTitle = '<h5 title="'+widgetDesc+'" class="widget-title pt-1 header-margin text-nowrap text-truncate" style="max-width:calc(100% - 122px);">'+widgetTitle+'</h5>';
			}								
		let widgetHeaderMenu  = '<span class="dropdown"><div id="headerMenuId" class="'+ marginClass+' ' +WidgetContainerUtils.containerClasses.actionMenu+'">';
			widgetHeaderMenu += '<button id="'+WidgetContainerUtils.containerIds.actionMenuBtn+'" class="btn btn-dark pl-2 pt-1 pb-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+WidgetContainerUtils.containerIcons.menuDropdown+'</button>';
			if(_strUserLocale == 'ar_BH'){
				
				widgetHeaderMenu += '<ul class="dropdown-menu" aria-labelledby="'+WidgetContainerUtils.containerIds.actionMenuBtn+'"></ul>';
			}
			else{
				widgetHeaderMenu += '<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="'+WidgetContainerUtils.containerIds.actionMenuBtn+'"></ul>';

			}
			widgetHeaderMenu += '</div></span>';
			
		cardHeader = document.createElement('div');
		cardHeader.className = WidgetContainerUtils.containerClasses.cardHeader;
		cardHeader.innerHTML =  widgetHeaderTitle + widgetHeaderMenu;
		
        cardBody = document.createElement('div');
		cardBody.className = widgetContainer.getCardBodyClass(widgetType);
		cardBody.id = WidgetContainerUtils.containerIds.cardBody+widgetId;
		
		cardFooter = document.createElement('div');
		cardFooter.className = WidgetContainerUtils.containerClasses.cardFooter;
		cardFooter.id = WidgetContainerUtils.containerIds.cardFooter+widgetId;
		
		topLable = document.createElement('div');
		topLable.className = 'widget-top-label';
		topLable.id = 'widget_top_label_'+widgetId;
		
		card = document.createElement('div');
		card.className = WidgetContainerUtils.containerClasses.card;
		card.appendChild(cardHeader);
		card.appendChild(topLable);
		card.appendChild(cardBody);
		card.appendChild(cardFooter);
		
		return card;
	},
	'getCardBodyClass': function(widgetType) {
	  let bodyClass;	
		switch(widgetType) {
		case 'fxRatesWidget': bodyClass=WidgetContainerUtils.containerClasses.fxCardBody;
		                      break;
		case 'top5Payments': bodyClass=WidgetContainerUtils.containerClasses.paymentsCardBody;
                             break; 
		case 'top5Payables': bodyClass=WidgetContainerUtils.containerClasses.payablesCardBody;
                             break; 
		case 'bannerWidget':  bodyClass=WidgetContainerUtils.containerClasses.bannerCardBody;
                             break;
		default : bodyClass=WidgetContainerUtils.containerClasses.cardBody;
		}
		return bodyClass;
	}
}
