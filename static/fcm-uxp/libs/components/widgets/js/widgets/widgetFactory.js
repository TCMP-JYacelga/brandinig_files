var _widgetFactory = function() {
	return widgetFactory();
}

function widgetFactory()
{	
    var _this = {};
	_this.constructor = function(type) {
		type = $.type(type) == 'undefined'? '' : type;
        switch (type) {
		  case 'datatable':
			this.widgetClass = dataTable();
			break;
		  case 'chart':
			this.widgetClass = chart();
			break;
		  case 'card':
			this.widgetClass = card();
			break;
		  case 'custom':
		  	this.widgetClass = customWidget();
		  	break;
		  default:
			break;
		}
    }
	/**
	*
	*/
	_this.createWidget = function(props){
       this.widgetClass.constructor(props);
	   this.widgetClass.initialize();
	}
	return _this;
}
