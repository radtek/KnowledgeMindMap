(function($,window,document,undefined){
    function JH_map(map){
        this.map=map;
    }

    JH_map.prototype.getOverlayById=function(id){
        //alert("id:"+id);
        var allOverlay = this.map.getOverlays();
        var tarOverlay=[];
        for (var i = 0; i < allOverlay.length; i++){
            //alert("aid:"+allOverlay[i].id);
            if(allOverlay[i].id == id){
                tarOverlay.push(allOverlay[i]);
            }
        }
        return tarOverlay;
    }
    JH_map.prototype.getOverlayById=function(id){
        //alert("id:"+id);
        var allOverlay = this.map.getOverlays();
        var tarOverlay=[];
        for (var i = 0; i < allOverlay.length; i++){
            //alert("aid:"+allOverlay[i].id);
            if(allOverlay[i].id == id){
                tarOverlay.push(allOverlay[i]);
            }
        }
        return tarOverlay;
    }
    JH_map.prototype.removeMarker = function(marker){
        this.map.removeOverlay(marker);
    }

    JH_map.prototype.createDot=function(data){
        if (!$.isPlainObject(data)) return false;

        var pt = new BMap.Point(data.lng, data.lat);

        if(data.icon){
            var myIcon = new BMap.Icon(data.icon.src, new BMap.Size(data.icon.width,data.icon.height));
            var dot=new BMap.Marker(pt,{icon:myIcon});
        }else{
            var dot=new BMap.Marker(pt);
        }
        if(data.isShowLabel){
            dot.label = {
                name: data.name ,
                info: data.infomation ,
                position: pt ,
                fontSize: 9 ,
                fontColor: 'red' ,
                align: 'middle'
            };
        }

        this.map.addOverlay(dot);

        return dot;

     }
    window.JH_map=JH_map;
})($,window,document)