var gluten = {};

//インターフェイス的にArrayっぽいのなら、それはArrayである
gluten.isArray = function(a){
	if(typeof a !== "object") return false;
	if(!("length" in a)) return false;
	
	for(var i = 0; i < a.length; i++){
		if(!(i in a)) return false;
	}
	
	return true;
};


//インターフェイス的にObjectっぽいのなら、それはObjectである
gluten.isObject = function(arg){
	if(arg === null) return false;
	
	return typeof arg === "object" || typeof arg === "function";
}

gluten.copy = function(from){
	var isArray = from instanceof Array;
	var copy = isArray == true ?
				[]:
				{};
	
	if(isArray){
		for (var i=0; i < from.length; i++) {
			copy[i] = from[i];
		}
	}else{
		for(var key in from){
			copy[key] = from[key];
		}
	}
	
	return copy;
};

gluten.fakeToArray = function(fake){
	if(gluten.isArray(fake) === false) return [];
	
	return Array.prototype.slice.apply(fake);
};

gluten.newArray = function(length, setter){
	var array = [];
	
	for(var i = 0; i != length; i++){
		array.push(setter(i));
	}
	
	return array;
};

gluten.asyn = function(event, time){
	var executes = [];
	var time = time || 0;
	
	//init----------------------------------------------------
	var init = function(){
		that.addExecute(event);
		
		setTimeout(function(){
			for(var i = 0; i != executes.length; i++){
				var action = executes[i].call(that);
				
				if(action === gluten.asyn.CONTINUE){
					setTimeout(arguments.callee, time);
					return;
				}else if(action === gluten.asyn.STOP){
					return;
				}
			}
		}, time);
		
		delete event;
		delete init;
	};
	
	//private methods-----------------------------------------
	var that = {};
	
	that.addExecute = function(e){
		if(typeof e !== "function") return that;
		
		executes.push(e);
		return that;
	};
	
	that.addEventListener = function(listener){
		if(typeof listener !== "function") return that;
		
		executes.push(listener);
		
		return that;
	}
	
	that.setTime = function(t){
		time = t;
	};
	
	init();
	
	return that;
};
gluten.asyn.GO = function(g){
	return g === undefined || g == true;
};
gluten.asyn.CONTINUE = {};
gluten.asyn.STOP = false;

Object.freeze(gluten.asyn);





new function(){
	var nullFunction = function(){};
	
	gluten.getNullFunction = function(){
		return nullFunction;
	};
};



gluten.log = function(){
	var that = [];
	
	that.addMessage = function(mess){
		that.push(mess);
		return that;
	};
	
	return that;
};


gluten.localStorage = function(key){
	var that = function(value){
		switch(arguments.length){
			case 0: return that.get();
			default: return that.set(value);
		}
	};
	
	that.create = function(initData){
		if(key in localStorage === false){
			that.set(initData);
		}
		
		return that.get();
	};
	
	that.remove = function(){
		delete localStorage[key];
	};
	
	that.has = function(){
		return key in localStorage;
	};
	
	that.get = function(){
		//型が分からない為、何もない時はundefinedを返すしかない
		if(key in localStorage === false) return undefined;
		
		var saveData = localStorage[key].match(/([^ ]*) (.*)/);
		var type = saveData[1];
		var data = saveData[2];
		
		switch(type){
			case "undefined":
				return undefined;
			case "boolean":
				return !!data;
			case "number":
				return data - 0;
			case "string":
				return data;
			case "object":
				return JSON.parse(data);
			case "function":
				return eval("(" + data + ")");
			default:
				return undefined;
		}
	};
	
	that.set = function(value){
		var toString = "";
		
		if(typeof value === "object"){
			toString = JSON.stringify(value);
		}else if(typeof value === "function"){
			toString = Function.prototype.toString.call(value);
		}else{
			toString = value;
		}
		
		localStorage[key] = typeof value + " " + toString;
		
		return that;
	};
	
	return that;
};


gluten.storage = function(){
	var that = {};
	
	//public--------------------------------------------------------
	that.get = function(key){
		if(key in localStorage === false) return undefined;
		
		var saveData = localStorage[key].match(/([^ ]*) (.*)/);
		var type = saveData[1];
		var data = saveData[2];
		
		switch(type){
			case "undefined":
				return undefined;
			case "boolean":
				return !!data;
			case "number":
				return data - 0;
			case "string":
				return data;
			case "object":
				return JSON.parse(data);
			case "function":
				return eval("(" + data + ")");
			default:
				return undefined;
		}
	};
	
	that.put = function(key, value){
		var toString = "";
		
		if(typeof value === "object"){
			toString = JSON.stringify(value);
		}else if(typeof value === "function"){
			toString = Function.prototype.toString.call(value);
		}else{
			toString = value;
		}
		
		localStorage[key] = typeof value + " " + toString;
	};
	
	return that;
};


gluten.Array = function(existMethodsQuery){
    const that = {};
    var methods = {};

    const _core = [];

    methods.get = function(index){
        return _core[index];
    };

    methods.add = function(data){
        _core.push(data);
    }

    methods.set = function(index, data){
        _core[index] = data;
    };

    methods.remove = function(index){
        _core.splice(index, 1);
    }

    methods.size = function(){
        return _core.length;
    }

    if(arguments.length >= 1){
        existMethodsQuery.split(",").forEach(function(methodName){
            if(methodName in methods == false) return;

            that[methodName] = methods[methodName];
        });
    }

    existMethodsQuery = undefined;
    methods = undefined;

    return that;
};