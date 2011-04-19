Titanium.UI.setBackgroundColor('#000');

var tabGroup = Titanium.UI.createTabGroup();
var tableview = Titanium.UI.createTableView();


var annotaionArray = [];

var rawdata;

var pos = {latitude:38,longitude:140};

var mapview = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    region: {latitude:pos.latitude, longitude:pos.longitude, 
            latitudeDelta:3, longitudeDelta:3},
    regionFit:true,
    userLocation:true
});


var xhr = Titanium.Network.createHTTPClient();

xhr.setTimeout(20000);
xhr.onload = function(e)
{
    var listData = [];
    var tmp = eval("(" + this.responseText + ");");
    
    rawdata = tmp.result;
    
    
    for (i = 0;i < rawdata.length;i++){
        var mountainView = Titanium.Map.createAnnotation({
            latitude:rawdata[i].lat,
            longitude:rawdata[i].lng,
            title:rawdata[i].message.replace(/<br \/>/g,'\n'),
            subtitle:rawdata[i].date_time + ' - ' + rawdata[i].names,
            pincolor:Titanium.Map.ANNOTATION_RED,
            animate:false,
            rightButton: 'arrow.png',
            myid:i // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
        });
        
        
        var listItem = {title:rawdata[i].message.replace(/<br \/>/g,'\n'),hasChild:false};
        
        listData.push(listItem);
        
        annotaionArray.push(mountainView);
        
    }
    tableview.data = listData;
    mapview.addAnnotations(annotaionArray);
};
    xhr.open('POST','http://311help.com/getdata.php');

mapview.addEventListener('complete',function(e){
    //mapview.zoom(-0.01);
    //Titanium.UI.createAlertDialog({title:'Toolbar',message:mapview.location}).show();
    
});
    xhr.send({n:pos.latitude + 5,s:pos.latitude - 5,w:pos.longitude - 5,e:pos.longitude + 5});
    
    mapview.addEventListener('click',function(e){
        if(e.annotation){
        Titanium.UI.createAlertDialog({title:'',message:rawdata[e.annotation.myid].message.replace(/<br \/>/g,'\n')}).show();
        }
    });
    // send the data

// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win1
});

var detail = 



win1.add(mapview);





//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Tab 2',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Tab 2',
    window:win2
});


win2.add(tableview);



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();
