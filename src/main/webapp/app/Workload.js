var Workload = function(workload){

	var minutes = 0;
	
	if(isNaN(workload)){
		var expression = workload.replace("m", "").replace("h","*60").replace("d","*8*60").split(" ").join("+");
		minutes = eval(expression);
	} else{
		minutes = workload;
	}
	
	var printMinutes = function(){
		var min = minutes%60;
		return min == 0 ? "" : min + "m";
	};
	var h = function(m){
		return (m - m%60)/60;
	};
	var printHours = function(){
		var hours = h(minutes)%8;
		return hours == 0 ? "" : hours + "h";
	};
	var printDays = function(){
		var days = (h(minutes) - h(minutes)%8)/8;
		return days == 0 ? "" : days + "d";
	}
	
	return {
		minutes: minutes,
		print: function(){
			return _([printDays(), printHours(), printMinutes()]).without("").join(" ");
		},
		add: function(x){
			return new Workload(minutes + x.minutes);
		}
	};
}