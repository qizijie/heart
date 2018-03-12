+(function(w){
	w.damu = {};
	w.damu.css=function (node,type,val){
			if(typeof node ==="object" && typeof node["transform"] ==="undefined" ){
				node["transform"]={};
			}
			
			if(arguments.length>=3){
				//设置
				var text ="";
				node["transform"][type] = val;
				
				for( item in node["transform"]){
					if(node["transform"].hasOwnProperty(item)){
						switch (item){
							case "translateX":
							case "translateY":
							case "translateZ":
								text +=  item+"("+node["transform"][item]+"px)";
								break;
							case "scale":
								text +=  item+"("+node["transform"][item]+")";
								break;
							case "rotate":
								text +=  item+"("+node["transform"][item]+"deg)";
								break;
						}
					}
				}
				node.style.transform = node.style.webkitTransform = text;
			}else if(arguments.length==2){
				//读取
				val =node["transform"][type];
				if(typeof val === "undefined"){
					switch (type){
						case "translateX":
						case "translateY":
						case "rotate":
							val =0;
							break;
						case "scale":
							val =1;
							break;
					}
				}
				return val;
			}
		}
	w.damu.gesTure =function (node,callBack){
		//手指先触碰元素再触碰白色屏幕时无法触发gesturestart（ios不一样的地方）
		var startDis =0;
		node.addEventListener("touchstart",function(ev){
			node.hasStart =false;
			
			ev = ev||event;
			if(ev.touches.length>=2){
				node.hasStart =true;
				
				startDis  =  getDis(ev.touches[0],ev.touches[1]);
				startDeg  =  getDeg(ev.touches[0],ev.touches[1]);
				
				if(callBack&& typeof callBack["start"] === "function"){
					 callBack["start"].call(node);
				}
			}
		})
		
		node.addEventListener("touchmove",function(ev){
			ev = ev||event;
			if(ev.touches.length>=2){
				ev.scale = getDis(ev.touches[0],ev.touches[1]) / startDis;
				
				//为了兼容安卓方向不一致的问题
				ev.rotation = getDeg(ev.touches[0],ev.touches[1]) - startDeg;
				
				
				if(callBack&& typeof callBack["change"] === "function"){
					 callBack["change"].call(node,ev);
				}
			}
		})
		
		node.addEventListener("touchend",function(ev){
			ev = ev||event;
			//必须有node.hasStart的校验，如果没有单指操作时，gestureend逻辑也会被触发
			if(ev.touches.length<2 && node.hasStart){
				if(callBack&& typeof callBack["end"] === "function"){
					 callBack["end"].call(node);
				}
			}
		})
		
		
		
		//根据两个点拿到手指间的距离
		function getDis(p1,p2){
			var a = p1.clientY - p2.clientY;
			var b = p1.clientX - p2.clientX;
			
			return Math.sqrt(a*a+b*b);
		}
		
		//根据两个点拿到手指间线段与x轴正方向的夹角
		function getDeg (p1,p2){
			var a = p1.clientY - p2.clientY;
			var b = p1.clientX - p2.clientX;
			
			return Math.atan2(a,b)*180/Math.PI;
		}
	}
})(window)
