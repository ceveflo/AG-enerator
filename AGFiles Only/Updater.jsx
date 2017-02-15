function Update(){
    
    var html = "";  
    var request = "";  
    var url = "";
    var requesthtml = "";  
    var socket = new Socket;
    var domain = "179.51.4.165" // the domain for the file we want  
    var jsonFile = "/AG-enerator/AGFiles%20Only/preferences.json"; // the rest of the url for the file we want  
    var port = ":3821"; // the port for the file we want 
    var html = ""; 
    
    this.result = true;
    
    this.readUpdateFile = function(){        
        var Name =  jsonFile;
        var jsonPath = "";  

        while (Name.indexOf("/") != -1 ) {                                        // Strip Path  
                  jsonPath= jsonPath + Name.substr(0, Name.indexOf("/") + 1);  
                  Name = Name.substr(Name.indexOf("/") + 1 ,);   
        }
    
        $.writeln('jsonPath:', jsonPath, ' Name: ',Name);
        
        if (socket.open(domain + port, "binary")){
            //alert("GET " + sImg +" HTTP/1.0\n\n"); 
            requesthtml ="\n\nDmain:" + domain + " Port" + port + " binary\n" ;
            request ="GET " + jsonPath + Name +" HTTP/1.0\n\n";
            socket.write(request);
            var binary = socket.read(9999999);  
            binary = removeHeaders(binary);  
            $.writeln('Result: ',binary)
            socket.close();
        }
        
   }

    function removeHeaders(binary){  
              var bContinue = true ; // flag for finding end of header  
              var line = "";  
              var httpheader = "";  
              var nFirst = 0;  
              var count = 0;  
              while (bContinue) {  
                        line = getLine(binary) ; // each header line  
                        httpheader = httpheader + line;  
                        bContinue = line.length >= 2 ; // blank header == end of header  
                        nFirst = line.length + 1 ;  
                        binary = binary.substr(nFirst) ;  
              }  
              if (httpheader.indexOf("Bad Request") != -1 || httpheader.indexOf("Not Found") != -1) {  
                        alert (requesthtml + request + httpheader);  
                        var binary = "";  
              }  
              //alert (requesthtml + request + httpheader + "\nFile length = " + binary.length);  
              return binary;  
    } 

    function getLine(html){  
              var line = "" ;  
              for (var i = 0; html.charCodeAt(i) != 10; i++){ // finding line end  
                        line += html[i] ;  
              }  
              return line ;  
    };    
}

var x = new Update();
x.readUpdateFile();
